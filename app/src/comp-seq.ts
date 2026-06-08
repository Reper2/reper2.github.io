import * as THREE from "https://esm.sh/three@0.160.0";

// Animation Configuration States
type SequenceState = "FROST_IN" | "SOLID_FREEZE" | "BURST_OUT" | "FINISHED";

interface IceShard {
  mesh: THREE.Mesh;
  targetScale: number;
  currentScale: number;
  vx: number; // Velocity components for the explosion phase
  vy: number;
  spin: THREE.Vector3;
}

interface FireParticle {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  spin: THREE.Vector3;
  life: number;
  maxLife: number;
}

let state: SequenceState = "FROST_IN";
let stateTimer = 0;

// Scene tracking variables
let container: HTMLCanvasElement | null = null;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let animationId: number | null = null;

const iceShards: IceShard[] = [];
const fireParticles: FireParticle[] = [];
let centralCore: THREE.Mesh | null = null;

/**
 * Initializes the full-screen cinematic overlay scene
 */
export function startCompSeq(): void {
  // Reset states
  state = "FROST_IN";
  stateTimer = 0;
  iceShards.length = 0;
  fireParticles.length = 0;

  // Setup Canvas Element
  container = document.createElement("canvas");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100vw";
  container.style.height = "100vh";
  container.style.zIndex = "10000"; // Always on top of everything
  container.style.pointerEvents = "none";
  document.body.appendChild(container);

  // Core ThreeJS setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 15;

  renderer = new THREE.WebGLRenderer({ canvas: container, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Ambient lighting for clean flat shading properties
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);
  const directional = new THREE.DirectionalLight(0xffffff, 0.8);
  directional.position.set(2, 4, 5);
  scene.add(directional);

  // Generate the Procedural Frost Shield Array
  buildIceMatrix();

  // Handle resizing dynamically
  window.addEventListener("resize", onWindowResize);

  // Boot standard animation update loop
  tick();
}

/**
 * Procedurally generates raw low-poly shards to form the frost coating
 */
function buildIceMatrix(): void {
  // Use flat shaded icosahedrons to simulate angular cracked ice blocks
  const iceGeo = new THREE.IcosahedronGeometry(0.8, 0);

  // Spawn ice fragments covering a radial web structure centered around the view volume
  const totalShards = 90;
  for (let i = 0; i < totalShards; i++) {
    const iceMat = new THREE.MeshPhongMaterial({
      color: 0xd0f0ff,
      emissive: 0x225577,
      specular: 0xffffff,
      shininess: 90,
      flatShading: true,
      transparent: true,
      opacity: 0 // Starts completely clear
    });

    const mesh = new THREE.Mesh(iceGeo, iceMat);

    // Place randomly scattered outside the frame or near edges, then focus toward center
    const angle = Math.random() * Math.PI * 2;
    const distance = 4 + Math.random() * 8; // Border ring placement
    mesh.position.x = Math.cos(angle) * distance;
    mesh.position.y = Math.sin(angle) * distance;
    mesh.position.z = Math.random() * 2 - 1;

    // Randomize low-poly geometry rotations
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

    scene.add(mesh);

    // Track velocities pointing away from center (calculated early for explosion phase)
    const speedFactor = 0.15 + Math.random() * 0.25;
    iceShards.push({
      mesh,
      targetScale: 1.2 + Math.random() * 1.5,
      currentScale: 0.01,
      vx: Math.cos(angle) * speedFactor,
      vy: Math.sin(angle) * speedFactor,
      spin: new THREE.Vector3(Math.random() * 0.1, Math.random() * 0.1, Math.random() * 0.1)
    });
  }
}

/**
 * Builds the volcanic cores directly behind the ice structure
 */
function triggerCoreFireburst(): void {
  // Central crystalline energy node
  const coreGeo = new THREE.OctahedronGeometry(2, 0);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xff3300,
    wireframe: false
  });
  centralCore = new THREE.Mesh(coreGeo, coreMat);
  centralCore.scale.set(0.01, 0.01, 0.01);
  scene.add(centralCore);

  // Spawn flying micro-embers
  const particleGeo = new THREE.ConeGeometry(0.15, 0.4, 3);
  const particleColors = [0xff3300, 0xffaa00, 0xffee00];

  for (let i = 0; i < 120; i++) {
    const color = particleColors[Math.floor(Math.random() * particleColors.length)];
    const pMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 1.0 });
    const pMesh = new THREE.Mesh(particleGeo, pMat);

    // Start completely dead-center
    pMesh.position.set(0, 0, 1);
    pMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    scene.add(pMesh);

    // Radial directional blast parameters
    const angle = Math.random() * Math.PI * 2;
    const magnitude = 0.1 + Math.random() * 0.35;

    fireParticles.push({
      mesh: pMesh,
      vx: Math.cos(angle) * magnitude,
      vy: Math.sin(angle) * magnitude,
      vz: (Math.random() * 2 - 1) * 0.1,
      spin: new THREE.Vector3(Math.random() * 0.2, Math.random() * 0.2, Math.random() * 0.2),
      life: 0,
      maxLife: 45 + Math.floor(Math.random() * 45) // frame duration counter
    });
  }
}

/**
 * Main state machine rendering cycle
 */
function tick(): void {
  if (state === "FINISHED") {
    cleanupSeq();
    return;
  }

  animationId = requestAnimationFrame(tick);
  stateTimer++;

  // --- STAGE 1: THE FROST OVER ---
  if (state === "FROST_IN") {
    let allInterlocked = true;

    iceShards.forEach((shard) => {
      // Creep toward true center coordinate
      shard.mesh.position.x += (0 - shard.mesh.position.x) * 0.04;
      shard.mesh.position.y += (0 - shard.mesh.position.y) * 0.04;

      // Expand scale size to form a solid layer wall
      if (shard.currentScale < shard.targetScale) {
        shard.currentScale += (shard.targetScale - shard.currentScale) * 0.05;
        shard.mesh.scale.set(shard.currentScale, shard.currentScale, shard.currentScale);
        allInterlocked = false;
      }

      // Fade up opacity properties
      const mat = shard.mesh.material as THREE.MeshPhongMaterial;
      if (mat.opacity < 0.95) {
        mat.opacity += 0.03;
      }
    });

    // Advance state once fully closed up or timer threshold triggers
    if (allInterlocked || stateTimer > 100) {
      state = "SOLID_FREEZE";
      stateTimer = 0;
    }
  }

  // --- STAGE 2: THE SOLID FREEZE & HEAT RISE ---
  else if (state === "SOLID_FREEZE") {
    // Hold solid ice frame view while triggering central build up behind it
    if (stateTimer === 1) {
      triggerCoreFireburst();
    }

    if (centralCore) {
      // Rapidly swell core scale out
      const pulseFactor = stateTimer * 0.12;
      centralCore.scale.set(pulseFactor, pulseFactor, pulseFactor);
      centralCore.rotation.x += 0.04;
      centralCore.rotation.y += 0.06;
    }

    // Force blast after brief built-up threshold
    if (stateTimer > 35) {
      state = "BURST_OUT";
      stateTimer = 0;
      if (centralCore) {
        scene.remove(centralCore);
        centralCore.geometry.dispose();
        (centralCore.material as THREE.Material).dispose();
        centralCore = null;
      }
    }
  }

  // --- STAGE 3: SHATTER AND DISPERSAL ---
  else if (state === "BURST_OUT") {
    let itemsVisible = false;

    // Disperse Ice chunks outward rapidly
    iceShards.forEach((shard) => {
      shard.mesh.position.x += shard.vx;
      shard.mesh.position.y += shard.vy;
      shard.mesh.rotation.x += shard.spin.x;
      shard.mesh.rotation.y += shard.spin.y;

      const mat = shard.mesh.material as THREE.MeshPhongMaterial;
      if (mat.opacity > 0) {
        mat.opacity -= 0.02; // Fade down shard density
        itemsVisible = true;
      }
    });

    // Accelerate Fire Embers outward on trajectories
    fireParticles.forEach((p) => {
      p.life++;
      p.mesh.position.x += p.vx;
      p.mesh.position.y += p.vy;
      p.mesh.position.z += p.vz;

      p.mesh.rotation.x += p.spin.x;
      p.mesh.rotation.y += p.spin.y;

      const mat = p.mesh.material as THREE.MeshBasicMaterial;

      // Calculate age percentage factor
      const lifeRatio = p.life / p.maxLife;
      if (lifeRatio < 1) {
        mat.opacity = 1.0 - lifeRatio;
        itemsVisible = true;
      } else {
        mat.opacity = 0;
      }
    });

    // When everything is clear off-screen or faded completely, finish sequence
    if (!itemsVisible || stateTimer > 120) {
      state = "FINISHED";
    }
  }

  renderer.render(scene, camera);
}

function onWindowResize(): void {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Garbage disposal hooks to completely clear DOM and WebGL memory buffers
 */
function cleanupSeq(): void {
  if (animationId) cancelAnimationFrame(animationId);
  window.removeEventListener("resize", onWindowResize);

  // Clear ice assets
  iceShards.forEach((shard) => {
    scene.remove(shard.mesh);
    shard.mesh.geometry.dispose();
    (shard.mesh.material as THREE.Material).dispose();
  });

  // Clear fire assets
  fireParticles.forEach((p) => {
    scene.remove(p.mesh);
    p.mesh.geometry.dispose();
    (p.mesh.material as THREE.Material).dispose();
  });

  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
  }
}