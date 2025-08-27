document.addEventListener('DOMContentLoaded', function () {
    // ---- UI ELEMENT SELECTORS ---- //
    const UI = {
        splashScreen: document.getElementById('splash-screen'),
        splashProgressBar: document.querySelector('#splash-screen .progress-bar'),
        glitchOverlays: document.querySelectorAll('.glitch-overlay'),
        cursor: document.querySelector('.cursor'),
        cursorFollower: document.querySelector('.cursor-follower'),
        typingEffect: document.querySelector(".typing-effect"),
        nav: document.querySelector('nav'),
        sidemenu: document.getElementById("sidemenu"),
        menuBars: document.getElementById("menu-bars"),
        menuClose: document.getElementById("menu-close"),
        projectContainer: document.getElementById('work-list-container'),
    };

    // ---- INITIALIZATION ---- //
    initSplashAnimation();
    initThreeJSBackground();
    fetchGitHubData();
    fetchAndDisplayProjects();

    // ---- Glitch Splash Screen Animation ---- //
    function initSplashAnimation() {
        const mainText = UI.glitchOverlays[0].parentElement.getAttribute('data-text');
        UI.glitchOverlays.forEach(overlay => {
            overlay.setAttribute('data-text', mainText);
        });

        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;
            UI.splashProgressBar.style.width = `${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    UI.splashScreen.style.opacity = '0';
                    UI.splashScreen.style.visibility = 'hidden';
                    UI.cursor.classList.add('visible');
                    UI.cursorFollower.classList.add('visible');
                }, 500);
            }
        }, 20);
    }

    // ---- Typing Effect ---- //
    const texts = ["A Software Dev.", "A CS Student.", "A Human."];
    let textIndex = 0, charIndex = 0, isDeleting = false;
    function type() {
        const currentText = texts[textIndex];
        if (!isDeleting && charIndex < currentText.length) {
            UI.typingEffect.textContent = currentText.substring(0, charIndex + 1); charIndex++; setTimeout(type, 80);
        } else if (isDeleting && charIndex > 0) {
            UI.typingEffect.textContent = currentText.substring(0, charIndex - 1); charIndex--; setTimeout(type, 40);
        } else if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => { isDeleting = true; type(); }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false; textIndex = (textIndex + 1) % texts.length; setTimeout(type, 500);
        }
    }
    setTimeout(type, 3000);

    // ---- Simplified Portfolio Logic (with Serverless Function) ---- //
    async function fetchAndDisplayProjects() {
        try {
            // IMPORTANT: This now points to your serverless function
            const response = await fetch('/api/github');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const repos = await response.json();
            
            const latestProjects = repos.filter(repo => !repo.fork && repo.description).slice(0, 8);

            UI.projectContainer.innerHTML = '';
            
            latestProjects.forEach(repo => {
                const projectElement = document.createElement('div');
                projectElement.className = 'work';
                projectElement.innerHTML = `
                    <div class="work-icon">${getIconForCategory(repo.topics)}</div>
                    <div class="layer">
                        <h3>${repo.name.replace(/-/g, ' ')}</h3>
                        <p>${repo.description}</p>
                        <a href="${repo.html_url}" target="_blank"><i class="fa-solid fa-up-right-from-square"></i></a>
                    </div>
                `;
                UI.projectContainer.appendChild(projectElement);
            });
        } catch (error) {
            console.error('Error fetching projects:', error);
            UI.projectContainer.innerHTML = '<p class="loading-text">Could not load projects. API limit likely reached.</p>';
        }
    }

    function getIconForCategory(topics) {
        if (topics.includes('web-app')) return '<i class="fas fa-globe"></i>';
        if (topics.includes('ai-ml') || topics.includes('ai')) return '<i class="fas fa-brain"></i>';
        if (topics.includes('robotics')) return '<i class="fas fa-robot"></i>';
        if (topics.includes('cli') || topics.includes('automation')) return '<i class="fas fa-terminal"></i>';
        return '<i class="fas fa-code"></i>';
    }

    // ---- GitHub Activity Fetcher ---- //
    async function fetchGitHubData() {
        try {
            const userResponse = await fetch('https://api.github.com/users/idevanshrai');
            const userData = await userResponse.json();
            document.getElementById('total-repos').textContent = userData.public_repos;
            const eventsResponse = await fetch('https://api.github.com/users/idevanshrai/events/public');
            const events = await eventsResponse.json();
            let commitCount = 0, prCount = 0, starCount = 0;
            events.forEach(e => {
                if (e.type === 'PushEvent') commitCount += e.payload.commits.length;
                if (e.type === 'PullRequestEvent' && e.payload.action === 'opened') prCount++;
                if (e.type === 'WatchEvent') starCount++;
            });
            document.getElementById('total-commits').textContent = commitCount;
            document.getElementById('total-prs').textContent = prCount;
            document.getElementById('total-stars').textContent = starCount;
            const activityFeed = document.getElementById('activity-feed');
            activityFeed.innerHTML = '';
            events.slice(0, 5).forEach(event => {
                let icon, type, repo = event.repo.name.split('/')[1];
                switch(event.type) {
                    case 'PushEvent': icon = '<i class="fa-solid fa-code-commit"></i>'; type = `Pushed ${event.payload.commits.length} commit(s)`; break;
                    case 'PullRequestEvent': icon = '<i class="fa-solid fa-code-pull-request"></i>'; type = `${event.payload.action} PR`; break;
                    case 'WatchEvent': icon = '<i class="fa-solid fa-star"></i>'; type = 'Starred repo'; break;
                    default: icon = '<i class="fa-solid fa-code"></i>'; type = event.type.replace('Event', '');
                }
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                activityItem.innerHTML = `<div class="activity-icon">${icon}</div><div class="activity-details"><div class="activity-type">${type} in <span class="activity-repo">${repo}</span></div><div class="activity-date">${new Date(event.created_at).toLocaleDateString()}</div></div>`;
                activityFeed.appendChild(activityItem);
            });
        } catch (error) { console.error('Error fetching GitHub data:', error); }
    }
    
    // ---- SCROLL & INTERSECTION OBSERVER ---- //
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('animate'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.scroll-animation').forEach(el => observer.observe(el));
    
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768) return;
        document.querySelectorAll('.parallax-item').forEach(item => {
            const speed = -0.1;
            const yPos = (item.getBoundingClientRect().top - window.innerHeight / 2) * speed;
            item.style.transform = `translateY(${yPos}px)`;
        });
    });

    // ---- NAVIGATION & MENU ---- //
    UI.menuBars.addEventListener('click', () => UI.sidemenu.classList.add('active'));
    UI.menuClose.addEventListener('click', () => UI.sidemenu.classList.remove('active'));
    window.addEventListener('scroll', () => UI.nav.classList.toggle('scrolled', window.scrollY > 50));

    // ---- CURSOR & MAGNETIC EFFECT ---- //
    let mouseX = 0, mouseY = 0, posX = 0, posY = 0;
    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

    function updateCursor() {
        UI.cursor.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px)`;
        posX += (mouseX - posX) / 8;
        posY += (mouseY - posY) / 8;
        UI.cursorFollower.style.transform = `translate(${posX - 5}px, ${posY - 5}px)`;
        requestAnimationFrame(updateCursor);
    }
    updateCursor();
    
    document.querySelectorAll('.magnetic-link').forEach(link => {
        link.addEventListener('mousemove', e => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            link.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.1)`;
        });
        link.addEventListener('mouseleave', () => { link.style.transform = 'translate(0, 0) scale(1)'; });
    });
});