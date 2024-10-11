// Scene, Camera, Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game-container').appendChild(renderer.domElement);

// Player variables
let player = {
  velocity: new THREE.Vector3(),
  speed: 0.1,
  turnSpeed: Math.PI * 0.01
};

// Setup floor and walls
const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI / 2;
scene.add(floor);

const wallGeometry = new THREE.BoxGeometry(10, 5, 0.5);
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
wall1.position.set(0, 2.5, -5);
scene.add(wall1);

// Adding a gun model for player
const gunGeometry = new THREE.BoxGeometry(0.5, 0.2, 1);
const gunMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const gun = new THREE.Mesh(gunGeometry, gunMaterial);
gun.position.set(0, -0.3, -0.5);
camera.add(gun);
scene.add(camera);

// Adding an enemy
const enemyGeometry = new THREE.BoxGeometry(1, 2, 1);
const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
enemy.position.set(0, 1, -10);
scene.add(enemy);

// Controls
let keys = {};
document.addEventListener('keydown', (event) => keys[event.key] = true);
document.addEventListener('keyup', (event) => keys[event.key] = false);

// Shooting mechanism
let bullets = [];
document.addEventListener('click', () => {
  let bullet = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
  );
  bullet.position.set(camera.position.x, camera.position.y - 0.3, camera.position.z);
  bullet.velocity = new THREE.Vector3(
    -Math.sin(camera.rotation.y),
    0,
    -Math.cos(camera.rotation.y)
  ).multiplyScalar(0.5);
  bullets.push(bullet);
  scene.add(bullet);
});

// Handle player movement
function movePlayer() {
  if (keys['w']) camera.translateZ(-player.speed);
  if (keys['s']) camera.translateZ(player.speed);
  if (keys['a']) camera.translateX(-player.speed);
  if (keys['d']) camera.translateX(player.speed);
  if (keys['ArrowLeft']) camera.rotation.y += player.turnSpeed;
  if (keys['ArrowRight']) camera.rotation.y -= player.turnSpeed;
}

// Handle bullet movement and collision
function moveBullets() {
  bullets.forEach((bullet, index) => {
    bullet.position.add(bullet.velocity);
    if (bullet.position.distanceTo(enemy.position) < 1) {
      console.log("Enemy hit!");
      scene.remove(enemy);
    }
    if (bullet.position.z < -50 || bullet.position.z > 50) {
      scene.remove(bullet);
      bullets.splice(index, 1);
    }
  });
}

// Game loop
function animate() {
  requestAnimationFrame(animate);
  movePlayer();
  moveBullets();
  renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
