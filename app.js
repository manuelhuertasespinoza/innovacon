let scene, camera, renderer, avatar, mixer, action;
const clock = new THREE.Clock();
let backgroundLoaded = false;

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
    scene.background = new THREE.Color(0x1a1a1a); // Fijar un color de fondo inicial
}

function loadBackground(textureUrl, fallbackColor = 0x000000, callback) {
    const loader = new THREE.TextureLoader();
    loader.load(
        textureUrl,
        function(texture) {
            scene.background = texture; // Aplicar la textura como fondo
            callback();
        },
        undefined,
        function(err) {
            console.error('Error cargando la textura:', err);
            scene.background = new THREE.Color(fallbackColor); // Aplicar un color de respaldo si falla
            callback();
        }
    );
}

function loadAvatar() {
    const avatarLoader = new THREE.GLTFLoader();
    avatarLoader.load(
        'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
        function(gltf) {
            avatar = gltf.scene;
            avatar.scale.set(0.5, 0.5, 0.5);
            avatar.position.set(0, -1.5, 0);
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
        }
    );
}

function startTransitionToConference() {
    action.stop();

    // Cambiar el fondo a una conferencia
    loadBackground('https://your-conference-background-image.jpg', 0x1a1a1a, () => {
        avatar.position.set(0, -1.5, -5);
        action = mixer.clipAction(avatar.animations[1]); // Cambiar a animación de salto si existe
        action.play();

        showMessage("¡Bienvenido a la conferencia de innovación!");
        document.getElementById('joinButton').style.display = 'block';
    });
}

function animate() {
    requestAnimationFrame(animate);
    if (mixer) {
        mixer.update(clock.getDelta());
    }
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
    loadBackground(
        'https://upload.wikimedia.org/wikipedia/commons/e/e3/ISS-44_International_Space_Station_Flyaround.jpg',
        0x000000, // Color de respaldo si la textura falla
        () => {
            loadAvatar(); // Una vez cargado el fondo, cargar el avatar
        }
    );
    animate();
    window.addEventListener('resize', onWindowResize);
    document.getElementById('loading').style.display = 'none';
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
