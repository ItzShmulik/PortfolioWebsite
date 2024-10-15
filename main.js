import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Set up the scene
const scene = new THREE.Scene();
scene.background = null // Optional: Set background color

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0.5, 1.5); // Position the camera

// Set up the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Load the GLTF model
const loader = new GLTFLoader();
let mixer;
loader.load(
    'fish.glb',
    (gltf) => {
        const fish = gltf.scene;
        fish.position.set(0, 0, 0);
        fish.scale.set(4, 4, 4);
        fish.rotation.y = Math.PI / 1.5;

        mixer = new THREE.AnimationMixer(fish);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });

        // ADD scene.add(fish) ONCE DONE WITH BACKGROUND
    },
    undefined,
    (error) => {
        console.error('Error loading model:', error);
    }
);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if(mixer){
        mixer.update(0.01);
    }

    renderer.render(scene, camera);
}

animate(); // Start the animation loop