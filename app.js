let scene, camera, renderer, avatar, conferenceRoom;
let mixer, action;
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

    camera.position.z = 5;
}

function loadBackground() {
    const loader = new THREE.TextureLoader();
    loader.load('https://your-realistic-background-texture.jpg',
        function(texture) {
            scene.background = texture;
        },
        undefined,
        function(err) {
            console.error('Error cargando la textura de fondo:', err);
        }
    );
}

function loadConferenceRoom() {
    const roomLoader = new THREE.GLTFLoader();
    roomLoader.load('path-to-your-realistic-room-model.glb', 
        function(gltf) {
            conferenceRoom = gltf.scene;
            conferenceRoom.scale.set(10, 10, 10);
            conferenceRoom.position.set(0, -10, -20);
            scene.add(conferenceRoom);
        },
        undefined,
        function(error) {
            console.error('Error cargando la sala de conferencias:', error);
        }
    );
}

function loadAvatar() {
    const avatarLoader = new THREE.GLTFLoader();
    avatarLoader.load('path-to-your-realistic-avatar-model.glb', 
        function(gltf) {
            avatar = gltf.scene;
            avatar.scale.set(0.5, 0.5, 0.5);
            avatar.position.set(0, -5, 0);
            scene.add(avatar);

            mixer = new THREE.AnimationMixer(avatar);
            const animations = gltf.animations;
            action = mixer.clipAction(animations[1]);
            action.play();

            showMessage("Hola, hoy te diré el día que cambiará tu vida. Acompáñame.");
            setTimeout(() => {
                action.stop();
                action = mixer.clipAction(animations[3]);
                action.play();
                moveAvatar();
            }, 5000);
        },
        undefined,
        function(error) {
            console.error('Error cargando el avatar:', error);
        }
    );
}

function moveAvatar() {
    const duration = 5000;
    const startPosition = avatar.position.clone();
    const endPosition = new THREE.Vector3(0, -10, -15);
    const startTime = Date.now();

    function update() {
        const now = Date.now();
        const timeElapsed = now - startTime;
        if (timeElapsed < duration) {
            const progress = timeElapsed / duration;
            avatar.position.lerpVectors(startPosition, endPosition, progress);
            requestAnimationFrame(update);
        } else {
            avatar.position.copy(endPosition);
            action.stop();
            showMessage("Bienvenido a la Conferencia de Innovación del Futuro");
            document.getElementById('joinButton').style.display = 'block';
        }
    }
    update();
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
    loadBackground();
    loadConferenceRoom();
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
