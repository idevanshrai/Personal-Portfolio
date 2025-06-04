// Global variables
let scene, camera, renderer, stars;

// Initialize everything
function init() {
    // Create scene
    scene = new THREE.Scene();

    // Create camera with adjusted position
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 500;

    // Create renderer with enhanced settings
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Add renderer to page
    document.getElementById('threejs-bg').appendChild(renderer.domElement);

    // Create stars
    createStars();

    // Add window resize handler
    window.addEventListener('resize', onWindowResize, false);

    // Start animation
    animate();
}

// Create the stars
function createStars() {
    // Check if on mobile
    const isMobile = window.innerWidth <= 768;
    
    // Adjust star parameters based on device
    const starConfig = isMobile ? {
        far: { count: 1200, size: 1.2, spread: 2000 },
        mid: { count: 800, size: 1.4, spread: 1500 },
        near: { count: 400, size: 1.6, spread: 1000 }
    } : {
        far: { count: 1500, size: 1.0, spread: 2000 },
        mid: { count: 1000, size: 1.2, spread: 1500 },
        near: { count: 500, size: 1.4, spread: 1000 }
    };

    // Create multiple layers of stars for depth
    createStarLayer(starConfig.far.count, starConfig.far.size, starConfig.far.spread);
    createStarLayer(starConfig.mid.count, starConfig.mid.size, starConfig.mid.spread);
    createStarLayer(starConfig.near.count, starConfig.near.size, starConfig.near.spread);
}

function createStarLayer(count, size, spread) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const opacities = new Float32Array(count);
    const isMobile = window.innerWidth <= 768;

    // Create a more uniform distribution of stars
    for (let i = 0; i < count; i++) {
        const radius = spread * Math.random();
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        vertices.push(x, y, z);
        // Increase base opacity for mobile
        opacities[i] = isMobile ? 
            (0.5 + Math.random() * 0.5) : // Mobile: 0.5 to 1.0
            (0.3 + Math.random() * 0.4);  // Desktop: 0.3 to 0.7
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('opacity', new THREE.Float32BufferAttribute(opacities, 1));

    // Create a custom point material with enhanced glow
    const material = new THREE.PointsMaterial({
        size: size,
        sizeAttenuation: true,
        transparent: true,
        opacity: isMobile ? 0.9 : 0.7, // Increased opacity for mobile
        color: 0xFFFFFF,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const starLayer = new THREE.Points(geometry, material);
    scene.add(starLayer);
    
    // Add the layer to the stars array for animation
    if (!stars) stars = [];
    stars.push({
        mesh: starLayer,
        opacities: opacities,
        initialOpacities: opacities.slice(),
        time: Math.random() * 1000
    });
}

// Handle window resizing
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Recreate stars with appropriate settings for new screen size
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
    stars = [];
    createStars();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Animate each star layer
    if (stars && stars.length) {
        stars.forEach((layer, index) => {
            // Rotate the layer
            layer.mesh.rotation.y += 0.0001 * (index + 1);
            layer.mesh.rotation.x += 0.00005 * (index + 1);

            // Update star opacities for twinkling effect
            layer.time += 0.005;
            const opacities = layer.mesh.geometry.attributes.opacity.array;
            for (let i = 0; i < opacities.length; i++) {
                opacities[i] = layer.initialOpacities[i] * (0.7 + 0.3 * Math.sin(layer.time + i));
            }
            layer.mesh.geometry.attributes.opacity.needsUpdate = true;
        });
    }

    renderer.render(scene, camera);
}

// Start everything after the page loads
window.addEventListener('load', function() {
    // Try to initialize
    function tryInit() {
        const container = document.getElementById('threejs-bg');
        if (!container) {
            console.log('Container not found, retrying...');
            setTimeout(tryInit, 100);
            return;
        }
        if (typeof THREE === 'undefined') {
            console.log('Three.js not loaded, retrying...');
            setTimeout(tryInit, 100);
            return;
        }
        init();
    }
    tryInit();
});
