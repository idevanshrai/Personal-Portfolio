// Global variables
let scene, camera, renderer;
let starLayers = [];
let mouseX = 0, mouseY = 0;

// Initialize the Three.js background
function initThreeJSBackground() {
    const container = document.getElementById('threejs-bg');
    if (!container) return;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020412, 0.00035); // Minimal fog

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    createStarfield();

    window.addEventListener('resize', onWindowResize, false);
    document.body.addEventListener('mousemove', onMouseMove, false);

    animate();
}

// Generate a texture for stars
function createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
}

// Create denser star layers
function createStarfield() {
    const starTexture = createStarTexture();
    const layers = [
        { count: 5000, size: 1.8, distance: 3000 },
        { count: 10000, size: 1.2, distance: 2000 },
        { count: 20000, size: 0.7, distance: 1000 }
    ];

    layers.forEach(layer => {
        const vertices = [];
        for (let i = 0; i < layer.count; i++) {
            vertices.push(
                THREE.MathUtils.randFloatSpread(layer.distance),
                THREE.MathUtils.randFloatSpread(layer.distance),
                THREE.MathUtils.randFloatSpread(layer.distance)
            );
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        const material = new THREE.PointsMaterial({
            map: starTexture, size: layer.size, blending: THREE.AdditiveBlending,
            depthWrite: false, transparent: true, opacity: 0.9
        });
        const points = new THREE.Points(geometry, material);
        scene.add(points);
        starLayers.push(points);
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    // Reduced multiplier for less sensitivity
    mouseX = (event.clientX - window.innerWidth / 2) * 0.1;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.1;
}

function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.00005;

    // Slower interpolation for smoother camera movement
    camera.position.x += (mouseX - camera.position.x) * 0.02;
    camera.position.y += (-mouseY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    
    starLayers.forEach((layer, i) => {
        layer.rotation.y = time * 0.2 * (i + 1);
        layer.rotation.x = time * 0.1 * (i + 1);
    });

    renderer.render(scene, camera);
}