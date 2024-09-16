let scene, camera, renderer, avatar;
let mixer, action, backgroundState = 0;
const clock = new THREE.Clock();

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

    camera.position.z = 5; // Ajusta la posición de la cámara para ver el avatar de frente.
}

function loadSpaceBackground() {
    const loader = new THREE.TextureLoader();
    loader.load(
        'https://upload.wikimedia.org/wikipedia/commons/e/e3/ISS-44_International_Space_Station_Flyaround.jpg', // Fondo del espacio exterior
        function(texture) {
            scene.background = texture;
        },
        undefined,
        function(err) {
            console.error('Error cargando la textura de fondo del espacio:', err);
        }
    );
}

function loadConferenceBackground() {
    const loader = new THREE.TextureLoader();
    loader.load(
        'https://your-conference-background-image.jpg', // Fondo del escenario de conferencia
        function(texture) {
            scene.background = texture;
        },
        undefined,
        function(err) {
            console.error('Error cargando la textura de fondo de conferencia:', err);
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
            avatar.position.set(0, -1.5, 0); // Coloca el avatar en el centro de la pantalla.
            scene.add(avatar);

            mixer = new THREE.AnimationMixer(avatar);
            const animations = gltf.animations;
            action = mixer.clipAction(animations[1]); // Animación de saludo saltando.
            action.play();

            showMessage("Hola, bienvenido a la Conferencia de Innovación. Acompáñame.");
            setTimeout(() => {
                transitionToConference();
            }, 5000);
        },
        undefined,
        function(error) {
            console.error('Error cargando el avatar:', error);
        }
    );
}

function transitionToConference() {
    // Cambiar el fondo a la sala de conferencias
    loadConferenceBackground();

    // Cambiar la posición del avatar al estrado
    avatar.position.set(0, -1.5, -5); // Ajustar la posición para que esté en el escenario

    // Mostrar nuevo mensaje
    showMessage("¡Bienvenido a la Conferencia! El futuro comienza aquí.");
    action.stop();
    action = mixer.clipAction(avatar.animations[1]); // Realiza otra animación si es necesario
    action.play();

    // Mostrar botón de unirse
    document.getElementById('joinButton').style.display = 'block';
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
    loadSpaceBackground();
    loadAvatar();
    animate();
    window.addEventListener('resize', onWindowResize);
    document.getElementById('loading').style.display = 'none';
}

document.getElementById('joinButton').addEventListener('click', () => {
    alert('¡Gracias por unirte a la Conferencia de Innovación!');
});

window.addEventListener('load', function() {
    if (typeof THREE === 'undefined') {
        console.error('Three.js no está disponible. Asegúrate de que el script se haya cargado correctamente.');
        return;
    }
    if (typeof THREE.GLTFLoader === 'undefined') {
        console.error('GLTFLoader no está disponible. Asegúrate de que el script se haya cargado correctamente.');
        return;
    }
    init();
});
