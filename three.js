// Enhanced Three.js Background with Floating Tech Elements
function initThreeJSBackground() {
    // Only initialize if container exists
    const container = document.getElementById('threejs-bg');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create tech-inspired floating elements
    const elements = [];
    const elementCount = 30;
    const geometry = new THREE.IcosahedronGeometry(0.3, 0);
    
    // Different colors for tech vibe
    const colors = [
        0xff004f, // Primary accent color
        0x00a8ff, // Blue
        0x00ff88, // Green
        0xffaa00, // Orange
        0xaa00ff  // Purple
    ];

    // Create floating elements
    for (let i = 0; i < elementCount; i++) {
        const material = new THREE.MeshPhongMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            emissive: 0x000000,
            specular: 0x111111,
            shininess: 30,
            transparent: true,
            opacity: 0.8
        });
        
        const element = new THREE.Mesh(geometry, material);
        
        // Random position
        element.position.x = (Math.random() - 0.5) * 20;
        element.position.y = (Math.random() - 0.5) * 20;
        element.position.z = (Math.random() - 0.5) * 20;
        
        // Random rotation
        element.rotation.x = Math.random() * Math.PI;
        element.rotation.y = Math.random() * Math.PI;
        
        // Random scale
        const scale = 0.5 + Math.random() * 1.5;
        element.scale.set(scale, scale, scale);
        
        // Store original positions for floating animation
        element.userData = {
            originalX: element.position.x,
            originalY: element.position.y,
            originalZ: element.position.z,
            speed: 0.2 + Math.random() * 0.3,
            rotationSpeed: 0.01 + Math.random() * 0.02
        };
        
        scene.add(element);
        elements.push(element);
    }

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Camera position
    camera.position.z = 5;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Animate elements with floating effect
        const time = Date.now() * 0.001;
        
        elements.forEach(element => {
            // Floating animation
            element.position.y = element.userData.originalY + Math.sin(time * element.userData.speed) * 0.5;
            element.position.x = element.userData.originalX + Math.cos(time * element.userData.speed * 0.7) * 0.5;
            
            // Rotation
            element.rotation.x += element.userData.rotationSpeed * 0.5;
            element.rotation.y += element.userData.rotationSpeed;
            
            // Pulsing scale effect
            const pulse = Math.sin(time * element.userData.speed * 1.3) * 0.1 + 1;
            element.scale.setScalar(pulse);
        });
        
        renderer.render(scene, camera);
    }

    // Handle window resize
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();
}

// Start Three.js after splash screen
document.addEventListener('DOMContentLoaded', function() {
    // The splash screen will call initThreeJSBackground when it finishes
});