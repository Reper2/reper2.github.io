/**
 * @author Ethan Graham
 * @license MIT
 * @copyright 2021-2026 Ethan Graham
 * @see https://github.com/fire-ethan/fire-ethan.github.io/blob/master/LICENSE
 * License information in LICENSE file overrides any other license information in this file.
 */

import * as THREE from "https://esm.sh/three@0.160.0";
import { Starbit3D, Moon2D, activeStarbits, activeMoons } from "../starbits/core";

// Animation Configuration States
type SequenceState = "FROST_IN" | "SOLID_FREEZE" | "BURST_OUT" | "FINISHED";

interface IceShard {
  mesh: THREE.Mesh;
  targetScale: number;
  currentScale: number;
  vx: number;
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
  baseScale: number;
}

// Custom physics parameters tracked per-instance to avoid mutating your core classes
const moonSpiralStates = new Map<Moon2D, { angle: number; radius: number; delay: number; speed: number }>();
const starbitExplodeStates = new Map<Starbit3D, { vx: number; vy: number; vz: number; spin: THREE.Vector3 }>();

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

// 🧊 Full-screen Ice Frost Overlay Mesh & Shader Material
let frostOverlayMesh: THREE.Mesh | null = null;
let frostMaterial: THREE.ShaderMaterial | null = null;

let targetExplosionVolume = 60;

let cachedLoaderClass: any = null;
async function getGLTFLoaderClass(): Promise<any> {
  if (cachedLoaderClass) return cachedLoaderClass;
  try {
    const module = await import("https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js");
    cachedLoaderClass = module.GLTFLoader;
    return cachedLoaderClass;
  } catch (err) {
    console.error("Failed to dynamically load GLTFLoader from esm.sh:", err);
    throw err;
  }
}

/**
 * Creates a screen-aligned plane running a procedural crystal frost shader
 */
function buildScreenFrostOverlay(): void {
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uProgress; 
    uniform float uOpacity;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float crystalNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), f.x),
                 mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), f.x), f.y);
    }

    void main() {
      vec2 centerDist = vUv - 0.5;
      float vignette = dot(centerDist, centerDist) * 2.5;

      float n1 = crystalNoise(vUv * 8.0 + uTime * 0.1);
      float n2 = crystalNoise(vUv * 24.0 - uTime * 0.05);
      float crystalPattern = (n1 * 0.7 + n2 * 0.3);

      float frostThick = smoothstep(1.0 - uProgress, 1.4 - uProgress, vignette + crystalPattern * 0.25);

      vec3 iceBaseColor = vec3(0.72, 0.91, 1.0); 
      vec3 iceCoreColor = vec3(0.95, 0.98, 1.0);
      vec3 finalIce = mix(iceBaseColor, iceCoreColor, frostThick);

      float alpha = frostThick * uOpacity;
      gl_FragColor = vec4(finalIce, alpha);
    }
  `;

  frostMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uOpacity: { value: 1.0 }
    },
    transparent: true,
    depthTest: false,
    depthWrite: false
  });

  const planeGeo = new THREE.PlaneGeometry(2, 2);
  frostOverlayMesh = new THREE.Mesh(planeGeo, frostMaterial);
  frostOverlayMesh.renderOrder = 999;
  scene.add(frostOverlayMesh);
}

function updateMoonWhirlpool(moon: Moon2D): boolean {
  const spiral = moonSpiralStates.get(moon);
  if (!spiral) return false;

  if (spiral.delay > 0) {
    spiral.delay--;
    return false;
  }
  if (!moon.sprite.visible) moon.sprite.visible = true;

  spiral.radius -= spiral.speed * 2.2;
  spiral.angle += 0.06;

  moon.sprite.position.x = Math.cos(spiral.angle) * spiral.radius;
  moon.sprite.position.y = Math.sin(spiral.angle) * spiral.radius;
  moon.sprite.position.z = 1.2;
  moon.sprite.material.rotation += 0.02;

  if (spiral.radius < 3) {
    const shrink = Math.max(0.01, spiral.radius / 3);
    moon.sprite.scale.set(shrink * 0.6, shrink * 0.6, 1);
  }
  return true;
}

/**
 * 🏆 THE CINEMATIC FINALE ENTRY POINT
 */
export function startCompSeq(
  gltfModelPath: string,
  array2DImageUrls: string[],
  eggCount: number,
  totalEggs: number
): void {
  state = "FROST_IN";
  stateTimer = 0;
  iceShards.length = 0;
  fireParticles.length = 0;

  activeMoons.forEach(m => m.destroy());
  activeStarbits.forEach(s => s.destroy());
  activeMoons.length = 0;
  activeStarbits.length = 0;
  moonSpiralStates.clear();
  starbitExplodeStates.clear();

  const baseVolume = 30;
  const progressFactor = eggCount / totalEggs;
  targetExplosionVolume = Math.floor(baseVolume * progressFactor * 4);

  container = document.createElement("canvas");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100vw";
  container.style.height = "100vh";
  container.style.zIndex = "10000";
  container.style.pointerEvents = "none";
  document.body.appendChild(container);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 15;

  renderer = new THREE.WebGLRenderer({ canvas: container, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);
  const directional = new THREE.DirectionalLight(0xffffff, 0.8);
  directional.position.set(2, 4, 5);
  scene.add(directional);

  buildScreenFrostOverlay();
  buildIceMatrix();

  if (array2DImageUrls && array2DImageUrls.length > 0) {
    for (let k = 0; k < eggCount; k++) {
      const randomUrlIndex = Math.floor(Math.random() * array2DImageUrls.length);
      const url = array2DImageUrls[randomUrlIndex];

      const moon = new Moon2D(url, scene);

      const startingAngle = (k / eggCount) * Math.PI * 2 + (Math.random() * 0.5);
      const startingRadius = 10 + Math.random() * 3;

      moon.sprite.position.x = Math.cos(startingAngle) * startingRadius;
      moon.sprite.position.y = Math.sin(startingAngle) * startingRadius;
      moon.sprite.position.z = 1.2;
      moon.sprite.visible = false;

      moonSpiralStates.set(moon, {
        angle: startingAngle,
        radius: startingRadius,
        delay: k * 2,
        speed: 0.03 + Math.random() * 0.015
      });

      activeMoons.push(moon);
    }
  }

  window.addEventListener("resize", onWindowResize);

  getGLTFLoaderClass().then((GLTFLoaderClass) => {
    const loader = new GLTFLoaderClass();

    loader.load(gltfModelPath, (gltf: any) => {
      
      let masterMesh: THREE.Mesh | null = null;
      gltf.scene.traverse((child: any) => {
        if (!masterMesh && child.isMesh) {
          masterMesh = child;
        }
      });

      // Guard pass to log clean feedback if the asset goes completely missing
      if (!masterMesh) {
        console.error("[End Sequence Engine] Failed to identify any structural THREE.Mesh inside the loaded glTF.");
        return;
      }
      tick(masterMesh);
    }, undefined, (err: any) => {
      console.error("GLTF loader exception inside comp-seq:", err);
      tick(null);
    });
  });
}

function buildIceMatrix(): void {
  const iceGeo = new THREE.IcosahedronGeometry(0.8, 0);
  const totalShards = 90;

  for (let i = 0; i < totalShards; i++) {
    const iceMat = new THREE.MeshPhongMaterial({
      color: 0xd0f0ff,
      emissive: 0x225577,
      specular: 0xffffff,
      shininess: 90,
      flatShading: true,
      transparent: true,
      opacity: 0
    });

    const mesh = new THREE.Mesh(iceGeo, iceMat);
    const angle = Math.random() * Math.PI * 2;
    const distance = 4 + Math.random() * 8;
    mesh.position.x = Math.cos(angle) * distance;
    mesh.position.y = Math.sin(angle) * distance;
    mesh.position.z = Math.random() * 2 - 1;

    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    scene.add(mesh);

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
 * 🌋 Generates organic lava fluid drops
 */
function triggerCoreFireburst(): void {
  const coreGeo = new THREE.OctahedronGeometry(2, 0);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xff3300, wireframe: false });
  centralCore = new THREE.Mesh(coreGeo, coreMat);
  centralCore.scale.set(0.01, 0.01, 0.01);
  scene.add(centralCore);

  // 🌋 Swapped to Low-poly spheres for organic droplets/globs of magma lava
  const lavaParticleGeo = new THREE.IcosahedronGeometry(0.2, 1);
  const magmaColors = [0xff1100, 0xff5500, 0xffaa00, 0x331100]; // Added deep dark crust cooling hues

  for (let i = 0; i < 140; i++) {
    const color = magmaColors[Math.floor(Math.random() * magmaColors.length)];
    const pMat = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      transparent: true,
      opacity: 1.0,
      flatShading: true
    });

    const pMesh = new THREE.Mesh(lavaParticleGeo, pMat);
    pMesh.position.set(0, 0, 1);
    scene.add(pMesh);

    const angle = Math.random() * Math.PI * 2;
    // Push velocities upwards and outwards more naturally
    const speedMagnitude = 0.15 + Math.random() * 0.35;
    const randomScale = 0.6 + Math.random() * 1.6; // Mix of tiny droplets and large heavy sludges

    fireParticles.push({
      mesh: pMesh,
      vx: Math.cos(angle) * speedMagnitude,
      vy: Math.sin(angle) * speedMagnitude + 0.08, // Added initial upward volcanic fountain boost
      vz: (Math.random() * 2 - 1) * 0.1,
      spin: new THREE.Vector3(Math.random() * 0.1, Math.random() * 0.1, Math.random() * 0.1),
      life: 0,
      maxLife: 50 + Math.floor(Math.random() * 50),
      baseScale: randomScale
    });
  }
}

/**
 * Main state machine rendering cycle
 */
function tick(masterMesh: THREE.Mesh | null = null): void {
  if (state === "FINISHED") {
    cleanupSeq();
    return;
  }

  animationId = requestAnimationFrame(() => tick(masterMesh));
  stateTimer++;

  // =========================================================================
  // STAGE 1: THE FULL-SCREEN SCREEN FROST OVER & WHIRLPOOL COMMENCEMENT
  // =========================================================================
  if (state === "FROST_IN") {
    let allInterlocked = true;

    if (frostMaterial) {
      frostMaterial.uniforms.uTime.value = stateTimer * 0.05;
      if (frostMaterial.uniforms.uProgress.value < 1.05) {
        frostMaterial.uniforms.uProgress.value += 0.012;
      }
    }

    iceShards.forEach((shard) => {
      shard.mesh.position.x += (0 - shard.mesh.position.x) * 0.04;
      shard.mesh.position.y += (0 - shard.mesh.position.y) * 0.04;

      if (shard.currentScale < shard.targetScale) {
        shard.currentScale += (shard.targetScale - shard.currentScale) * 0.05;
        shard.mesh.scale.set(shard.currentScale, shard.currentScale, shard.currentScale);
        allInterlocked = false;
      }
      const mat = shard.mesh.material as THREE.MeshPhongMaterial;
      if (mat.opacity < 0.95) mat.opacity += 0.03;
    });

    activeMoons.forEach(moon => updateMoonWhirlpool(moon));

    if (allInterlocked || stateTimer > 100) {
      state = "SOLID_FREEZE";
      stateTimer = 0;
    }
  }

  else if (state === "SOLID_FREEZE") {
    if (stateTimer === 1) {
      triggerCoreFireburst();
    }

    if (centralCore) {
      const pulseFactor = stateTimer * 0.12;
      centralCore.scale.set(pulseFactor, pulseFactor, pulseFactor);
      centralCore.rotation.x += 0.04;
      centralCore.rotation.y += 0.06;
    }

    activeMoons.forEach(moon => updateMoonWhirlpool(moon));

    if (stateTimer > 40) {
      state = "BURST_OUT";
      stateTimer = 0;

      if (centralCore) {
        scene.remove(centralCore);
        centralCore.geometry.dispose();
        (centralCore.material as THREE.Material).dispose();
        centralCore = null;
      }

      activeMoons.forEach(m => m.destroy());
      activeMoons.length = 0;
      moonSpiralStates.clear();

      if (masterMesh) {
        for (let i = 0; i < targetExplosionVolume; i++) {
          const starbit = new Starbit3D(masterMesh, scene);
          starbit.mesh.position.set(0, 0, 1);
          starbit.mesh.scale.set(0.03, 0.03, 0.03);

          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos((Math.random() * 2) - 1);
          const force = 0.15 + Math.random() * 0.35;

          starbitExplodeStates.set(starbit, {
            vx: Math.sin(phi) * Math.cos(theta) * force,
            vy: Math.sin(phi) * Math.sin(theta) * force,
            vz: Math.cos(phi) * force * 0.5,
            spin: new THREE.Vector3(Math.random() * 0.2, Math.random() * 0.2, Math.random() * 0.2)
          });

          activeStarbits.push(starbit);
        }
      }
    }
  }

  else if (state === "BURST_OUT") {
    let itemsVisible = false;

    if (frostMaterial && frostMaterial.uniforms.uOpacity.value > 0) {
      frostMaterial.uniforms.uOpacity.value -= 0.04;
      itemsVisible = true;
    } else if (frostOverlayMesh) {
      scene.remove(frostOverlayMesh);
      frostOverlayMesh.geometry.dispose();
      
      if (frostOverlayMesh.material instanceof THREE.Material) {
        frostOverlayMesh.material.dispose();
      } else if (Array.isArray(frostOverlayMesh.material)) {
        frostOverlayMesh.material.forEach(m => {
          if (m instanceof THREE.Material) m.dispose();
        });
      }
      frostOverlayMesh = null;
      frostMaterial = null;
    }

    iceShards.forEach((shard) => {
      shard.mesh.position.x += shard.vx;
      shard.mesh.position.y += shard.vy;
      shard.mesh.rotation.x += shard.spin.x;
      shard.mesh.rotation.y += shard.spin.y;

      const mat = shard.mesh.material as THREE.MeshPhongMaterial;
      if (mat.opacity > 0) {
        mat.opacity -= 0.02;
        itemsVisible = true;
      }
    });

    // 🌋 Progress fluid lava gravity loops
    fireParticles.forEach((p) => {
      p.life++;

      // Simulate gravity pushing down on liquid magma globs over time
      p.vy -= 0.007;

      p.mesh.position.x += p.vx;
      p.mesh.position.y += p.vy;
      p.mesh.position.z += p.vz;
      p.mesh.rotation.x += p.spin.x;
      p.mesh.rotation.y += p.spin.y;

      const lifeRatio = p.life / p.maxLife;
      const mat = p.mesh.material as THREE.MeshPhongMaterial;

      if (lifeRatio < 1) {
        mat.opacity = 1.0 - lifeRatio;

        // Magma cools and shrinks/stiffens as it finishes its trajectory life loop
        const dynamicScale = p.baseScale * (1.0 - lifeRatio * 0.6);
        p.mesh.scale.set(dynamicScale, dynamicScale, dynamicScale);

        // Gradually shift lava color toward deep cooled red/black as it falls
        if (lifeRatio > 0.5) {
          mat.color.lerp(new THREE.Color(0x110500), 0.05);
          mat.emissive.lerp(new THREE.Color(0x000000), 0.05);
        }

        itemsVisible = true;
      } else {
        mat.opacity = 0;
      }
    });

    activeStarbits.forEach((starbit) => {
      const exp = starbitExplodeStates.get(starbit);
      if (!exp) return;

      starbit.mesh.position.x += exp.vx;
      starbit.mesh.position.y += exp.vy;
      starbit.mesh.position.z += exp.vz;

      exp.vx *= 0.98;
      exp.vy *= 0.98;
      exp.vy -= 0.002;

      starbit.mesh.rotation.x += exp.spin.x;
      starbit.mesh.rotation.y += exp.spin.y;

      if (Math.abs(starbit.mesh.position.x) < 25 && starbit.mesh.position.y > -15) {
        itemsVisible = true;
      }
    });

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
 * Clear DOM and WebGL memory buffers safely
 */
function cleanupSeq(): void {
  if (animationId) cancelAnimationFrame(animationId);
  window.removeEventListener("resize", onWindowResize);

  if (frostOverlayMesh) {
    scene.remove(frostOverlayMesh);
    frostOverlayMesh.geometry.dispose();
    if (Array.isArray(frostOverlayMesh.material)) {
      frostOverlayMesh.material.forEach(m => m.dispose());
    } else {
      frostOverlayMesh.material.dispose();
    }
    frostOverlayMesh = null;
    frostMaterial = null;
  }

  iceShards.forEach((shard) => {
    scene.remove(shard.mesh);
    shard.mesh.geometry.dispose();
    (shard.mesh.material as THREE.Material).dispose();
  });

  fireParticles.forEach((p) => {
    scene.remove(p.mesh);
    p.mesh.geometry.dispose();
    (p.mesh.material as THREE.Material).dispose();
  });

  activeMoons.forEach(m => m.destroy());
  activeStarbits.forEach(s => s.destroy());

  iceShards.length = 0;
  fireParticles.length = 0;
  activeMoons.length = 0;
  activeStarbits.length = 0;
  moonSpiralStates.clear();
  starbitExplodeStates.clear();

  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
  }
}