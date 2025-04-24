// Splash Screen Animation
document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splash-screen');
    const progressBar = document.querySelector('.progress-bar');
    const terminalLines = document.querySelectorAll('.terminal-line');
    
    // Animate terminal lines
    terminalLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, 500 * (index + 1));
    });
    
    // Animate progress bar
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Hide splash screen after delay
            setTimeout(() => {
                splashScreen.style.opacity = '0';
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                    // Initialize Three.js after splash screen disappears
                    initThreeJSBackground();
                }, 1000);
            }, 500);
        }
        progressBar.style.width = `${progress}%`;
        document.querySelector('.progress-text').textContent = `${Math.round(progress)}%`;
    }, 100);
    
    // Initialize custom cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    // Track mouse position
    let mouseX = 0, mouseY = 0;
    let posX = 0, posY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function updateCursor() {
        // Main cursor
        posX += (mouseX - posX) / 5;
        posY += (mouseY - posY) / 5;
        
        cursor.style.left = `${posX}px`;
        cursor.style.top = `${posY}px`;
        
        // Follower cursor
        cursorFollower.style.left = `${mouseX}px`;
        cursorFollower.style.top = `${mouseY}px`;
        
        requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
    
    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .tab-links, .work, input, textarea');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.backgroundColor = 'rgba(255, 0, 79, 0.5)';
            cursor.style.borderColor = 'transparent';
            cursorFollower.style.transform = 'scale(2)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.backgroundColor = 'transparent';
            cursor.style.borderColor = '#ff004f';
            cursorFollower.style.transform = 'scale(1)';
        });
    });
    
    // Scroll animations
    const scrollElements = document.querySelectorAll('.scroll-animation');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    scrollElements.forEach(el => observer.observe(el));
    
    // Tab functionality - Fixed version
    function opentab(event, tabname) {
        // Get all elements with class="tab-links" and remove "active-link" class
        const tablinks = document.getElementsByClassName("tab-links");
        for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].classList.remove("active-link");
        }
        
        // Get all elements with class="tab-contents" and remove "active-tab" class
        const tabcontents = document.getElementsByClassName("tab-contents");
        for (let i = 0; i < tabcontents.length; i++) {
            tabcontents[i].classList.remove("active-tab");
        }
        
        // Add "active-link" class to the clicked tab
        event.currentTarget.classList.add("active-link");
        
        // Add "active-tab" class to the corresponding tab content
        document.getElementById(tabname).classList.add("active-tab");
    }

    // Mobile menu functionality - Updated version
    const sidemenu = document.getElementById("sidemenu");
    function openmenu() {
        sidemenu.classList.add("show-menu");
    }
    function closemenu() {
        sidemenu.classList.remove("show-menu");
    }

    // Typing effect
    const typingElement = document.querySelector(".typing-effect");
    const texts = ["A Software Developer.", "A CS Student.", "A Human."];
    let index = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 60;
    const deletingSpeed = 65;
    const delayBetweenTexts = 600;
    const delayBeforeDeleting = 1000;

    function type() {
        const currentText = texts[index];
        
        if (!isDeleting && charIndex < currentText.length) {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else if (isDeleting && charIndex > 0) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(type, deletingSpeed);
        } else if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => {
                isDeleting = true;
                type();
            }, delayBeforeDeleting);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            index = (index + 1) % texts.length;
            setTimeout(type, delayBetweenTexts);
        }
    }

    // Start typing effect
    setTimeout(type, 1000);
    
    // Form submission
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzAOcBA4M9ZNiW709so-2tWpugf-O2V32TbN6je8VNrsMc7RO4ba7giwuEZe2gVPDr5/exec';
    const form = document.forms['submit-to-google-sheet'];

    form.addEventListener('submit', e => {
        e.preventDefault();
        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => {
                alert('Message sent successfully!');
                form.reset();
            })
            .catch(error => console.error('Error!', error.message));
    });
});