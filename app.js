let scene, camera, renderer, stars;
const clock = new THREE.Clock();
let mixer, action, avatar;
let loadingScreen = document.getElementById('loading'); // Obtener referencia a "Cargando"

function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container').appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 0);
    scene.add(directionalLight);

    camera.position.set(0, 1.5, 5);

    // Cargar estrellas dinámicas
    createStars();

    // Quitar el mensaje de "Cargando" al iniciar la animación
    loadingScreen.style.display = 'none';
}

function createStars() {
    let starGeometry = new THREE.Geometry();
    let starMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 1,
        sizeAttenuation: true
    });

    for (let i = 0; i < 10000; i++) {
        let star = new THREE.Vector3(
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000,
            -Math.random() * 2000
        );
        starGeometry.vertices.push(star);
    }

    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

function loadAvatar() {
    const avatarLoader = new THREE.GLTFLoader();
    avatarLoader.load(
        'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
        function(gltf) {
            avatar = gltf.scene;
            avatar.scale.set(0.5, 0.5, 0.5);
            avatar.position.set(0, -1.5, 0); // Coloca el avatar en el centro de la pantalla.
            scene.add(avatar);

            mixer = new THREE.AnimationMixer(avatar);
            const animations = gltf.animations;
            action = mixer.clipAction(animations[1]);
            action.play();

            showMessage("Hola, bienvenido a la Conferencia de Innovación. Acompáñame.");
            setTimeout(() => {
                startTransitionToConference();
            }, 5000);
        },
        undefined,
        function(error) {
            console.error('Error cargando el avatar:', error);
            showMessage('Error cargando el avatar. Intenta recargar la página.');
        }
    );
}

function startTransitionToConference() {
    action.stop();

    // Cambiar el fondo a una conferencia
    loadConferenceBackground();
}

function loadConferenceBackground() {
    const loader = new THREE.TextureLoader();
    loader.load(
        'https://your-conference-background-image.jpg',
        function(texture) {
            scene.background = texture;
        },
        undefined,
        function(err) {
            console.error('Error cargando la textura de fondo de la conferencia:', err);
            showMessage('Error cargando el fondo de la conferencia.');
        }
    );
}

function animate() {
    requestAnimationFrame(animate);
    if (mixer) {
        mixer.update(clock.getDelta());
    }
    stars.rotation.x += 0.0005;  // Hace que las estrellas se muevan lentamente
    stars.rotation.y += 0.0005;

    renderer.render(scene, camera);
}

function showMessage(text) {
    document.getElementById('message').textContent = text;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function init() {
    initScene();
    animate();
    loadAvatar(); // Cargar el avatar después de inicializar la escena
    window.addEventListener('resize', onWindowResize);
}

document.getElementById('joinButton').addEventListener('click', () => {
    alert('¡Gracias por unirte a la Conferencia de Innovación!');
});

window.addEventListener('load', function() {
    if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
        console.error('Three.js o GLTFLoader no están disponibles.');
        return;
    }
    init();
});
