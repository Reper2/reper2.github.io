import * as THREE from "https://esm.sh/three@0.160.0";
import { Starbit3D, Moon2D, activeStarbits, activeMoons, starBitColours } from "./core";

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

  for (let i = activeStarbits.length - 1; i >= 0; i--) {
    const bit = activeStarbits[i];
    bit.update();

    if (bit.mesh.position.y < -7 || bit.mesh.position.x > 14) {
      bit.destroy();
      activeStarbits.splice(i, 1);
    }
  }

  for (let j = activeMoons.length - 1; j >= 0; j--) {
    const flatImg = activeMoons[j];
    flatImg.update();

    if (flatImg.sprite.position.y < -7 || flatImg.sprite.position.x > 14) {
      flatImg.destroy();
      activeMoons.splice(j, 1);
    }
  }

  renderer.render(scene, camera);

  if (activeStarbits.length === 0 && activeMoons.length === 0) {
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
  context: RainSceneContext,
  eggCount: number,
  totalEggs: number
): void {
  if (!context.scene && context.init3D) {
    context.init3D();
  }

  context.canvas.style.display = "block";

  if (array2DImageUrls.length > 0) {
    for (let k = 0; k < eggCount; k++) {
      const randomUrlIndex = Math.floor(Math.random() * array2DImageUrls.length);
      const chosenUrl = array2DImageUrls[randomUrlIndex];
      activeMoons.push(new Moon2D(chosenUrl, context.scene));
    }
  }

  // Safely awaits the clean esm.sh bundle wrapper
  getGLTFLoaderClass().then((GLTFLoaderClass) => {
    if (!context.loader) {
      context.loader = new GLTFLoaderClass();
    }

    context.loader.load(gltfModelPath, (gltf: any) => {
      const masterMesh = gltf.scene.children[0] as THREE.Mesh;
      const TOTAL_BITS = starBitColours.length * totalEggs;
      const progress = eggCount / totalEggs;

      for (let i = 0; i < TOTAL_BITS * progress; i++) {
        activeStarbits.push(new Starbit3D(masterMesh, context.scene));
      }

      if (animationId === null) {
        animateGalacticScene(context);
      }
    }, undefined, (error: any) => {
      console.error("glTF structure failed to load completely:", error);
    });
  });
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