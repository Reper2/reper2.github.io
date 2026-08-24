/**
 * @author Ethan Graham
 * @license MIT
 * @copyright 2021-2026 Ethan Graham
 * @see https://github.com/fire-ethan/fire-ethan.github.io/blob/master/LICENSE
 * License information in LICENSE file overrides any other license information in this file.
 */

import * as THREE from "https://esm.sh/three@0.160.0";
import * as core from "./core";

let animationId: number | null = null;

interface RainSceneContext {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;
  loader: any;
  init3D?: () => void;
}

let cachedLoaderClass: any = null;
async function getGLTFLoaderClass(): Promise<any> {
  if (cachedLoaderClass) return cachedLoaderClass;

  try {
    const module = await import("https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js");

    if (!module || typeof module.GLTFLoader !== "function") {
      throw new TypeError(`[Galactic Engine] GLTFLoader failed validation. Expected constructor function, received: ${typeof module?.GLTFLoader}`);
    }

    cachedLoaderClass = module.GLTFLoader;
    return cachedLoaderClass;
  } catch (err) {
    console.error("Failed to dynamically load GLTFLoader from esm.sh:", err);
    throw err;
  }
}

export function animateGalacticScene(context: RainSceneContext): void {
  const { scene, camera, renderer, canvas } = context;

  for (let i = core.activeStarbits.length - 1; i >= 0; i--) {
    const bit = core.activeStarbits[i];
    bit.update();

    if (bit.mesh.position.y < -7 || bit.mesh.position.x > 14) {
      bit.destroy();
      core.activeStarbits.splice(i, 1);
    }
  }

  for (let j = core.activeMoons.length - 1; j >= 0; j--) {
    const flatImg = core.activeMoons[j];
    flatImg.update();

    if (flatImg.sprite.position.y < -7 || flatImg.sprite.position.x > 14) {
      flatImg.destroy();
      core.activeMoons.splice(j, 1);
    }
  }

  renderer.render(scene, camera);

  if (core.activeStarbits.length === 0 && core.activeMoons.length === 0) {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    canvas.style.display = "none";
  } else {
    animationId = requestAnimationFrame(() => animateGalacticScene(context));
  }
}

export function generateStarbitShower(
  gltfModelPath: string,
  array2DImageUrls: string[],
  context: any, // Changed to 'any' to safely type-check input variations
  eggCount: number,
  totalEggs: number,
  verseText?: string
): void {

  // 🔄 HYBRID RESOLVER: If the constructor function itself was passed instead of its instance, execute it!
  if (typeof context === "function") {
    context = context();
  } else if (context && !context.scene && typeof context.init3D === "function") {
    context.init3D.call(context);
  } else if (!context && typeof constructStarbitScene === "function") {
    context = constructStarbitScene(); // Ultimate safety recovery path
  }

  // 🛡️ Safe Boundary Exit Safeguard
  if (!context || !context.scene) {
    console.error("[Galactic Engine] Cancellation: Cannot build shower on an uninitialized THREE.Scene context.");
    return;
  }

  context.canvas.style.display = "block";

  if (array2DImageUrls.length > 0) {
    for (let k = 0; k < eggCount; k++) {
      const randomUrlIndex = Math.floor(Math.random() * array2DImageUrls.length);
      const chosenUrl = array2DImageUrls[randomUrlIndex];
      core.activeMoons.push(new core.Moon2D(chosenUrl, context.scene));
    }
  }

  // Safely awaits the clean esm.sh bundle wrapper
  getGLTFLoaderClass().then((GLTFLoaderClass) => {
    if (!context.loader) {
      context.loader = new GLTFLoaderClass();
    }

    context.loader.load(gltfModelPath, (gltf: any) => {
      let masterMesh: THREE.Mesh | null = null;

      // 1. Traverse deeply to crawl past "Node0" and "m0" to extract "Node2"
      gltf.scene.traverse((child: any) => {
        if (!masterMesh && child instanceof THREE.Mesh) {
          masterMesh = child;
        }
      });

      // 2. Safety checklist guard
      if (!masterMesh) {
        console.error("[Starbit Engine] Instantiation aborted: Could not isolate mesh components from Node0 structure.");
        return;
      }

      // 3. Compute calculations using stable boundary integers
      const TOTAL_BITS = core.starBitColours.length * totalEggs;
      const progress = eggCount / totalEggs;
      const exactSpawnTarget = Math.floor(TOTAL_BITS * progress);

      // 4. Instantiation cycle
      for (let i = 0; i < exactSpawnTarget; i++) {
        core.activeStarbits.push(new core.Starbit3D(masterMesh, context.scene));
      }

      if (animationId === null) {
        animateGalacticScene(context);
      }
    }, undefined, (error: any) => {
      console.error("glTF structure failed to load completely:", error);
    });
  });

  if (verseText) {
    const verseBanner = document.createElement("div");
    verseBanner.className = "starbit-verse-banner";
    verseBanner.innerText = verseText;

    Object.assign(verseBanner.style, {
      position: "fixed",
      bottom: "10%",
      left: "50%",
      transform: "translateX(-50%)",
      color: "#ffffff",
      fontSize: "1.25rem",
      fontStyle: "italic",
      textAlign: "center",
      pointerEvents: "none",
      zIndex: "10000",
      opacity: "1",
      transition: "opacity 1s ease-in-out",

      /* High contrast container styles */
      backgroundColor: "rgba(15, 15, 25, 0.85)", // Dark background shield
      padding: "14px 28px",
      borderRadius: "12px",
      border: "1px solid rgba(255, 255, 255, 0.15)", // Subtle glowing border
      backdropFilter: "blur(8px)", // Blurs elements directly behind the box
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.45)", // Strong separation shadow
      maxWidth: "80vw", // Prevents overflow on mobile screens
      whiteSpace: "normal"
    });

    document.body.appendChild(verseBanner);

    // Fade out and cleanup when the shower finishes
    setTimeout(() => {
      verseBanner.style.opacity = "0";
      setTimeout(() => verseBanner.remove(), 1000);
    }, 4000);
  }
}

let rainContextCache: RainSceneContext | null = null;

export function constructStarbitScene(): RainSceneContext {
  if (rainContextCache) return rainContextCache;

  let canvasElement = document.getElementById("bg-canvas");

  if (canvasElement && !(canvasElement instanceof HTMLCanvasElement)) {
    console.warn(`[Galactic Engine] Warning: Element '#bg-canvas' exists but is not an HTMLCanvasElement instance. Replacing node...`);
    canvasElement.remove();
    canvasElement = null;
  }

  // Fallback logic to create a proper canvas if it doesn't exist
  let canvas = canvasElement as HTMLCanvasElement | null;
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "bg-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.zIndex = "9999";
    canvas.style.pointerEvents = "none";
    canvas.style.display = "none";
    document.body.appendChild(canvas);
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(12, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 35;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Prefetch class cleanly in background
  getGLTFLoaderClass();

  rainContextCache = { scene, camera, renderer, canvas, loader: null };
  return rainContextCache;
}