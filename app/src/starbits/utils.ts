import * as THREE from "https://esm.sh/three@0.160.0";
import { Starbit3D, Moon2D, active3DParticles, active2DParticles } from "./core";

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
    cachedLoaderClass = module.GLTFLoader;
    return cachedLoaderClass;
  } catch (err) {
    console.error("Failed to dynamically load GLTFLoader from esm.sh:", err);
    throw err;
  }
}

export function animateCombinedScene(context: RainSceneContext): void {
  const { scene, camera, renderer, canvas } = context;

  for (let i = active3DParticles.length - 1; i >= 0; i--) {
    const bit = active3DParticles[i];
    bit.update();

    if (bit.mesh.position.y < -7 || bit.mesh.position.x > 14) {
      bit.destroy();
      active3DParticles.splice(i, 1);
    }
  }

  for (let j = active2DParticles.length - 1; j >= 0; j--) {
    const flatImg = active2DParticles[j];
    flatImg.update();

    if (flatImg.sprite.position.y < -7 || flatImg.sprite.position.x > 14) {
      flatImg.destroy();
      active2DParticles.splice(j, 1);
    }
  }

  renderer.render(scene, camera);

  if (active3DParticles.length === 0 && active2DParticles.length === 0) {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    canvas.style.display = "none";
  } else {
    animationId = requestAnimationFrame(() => animateCombinedScene(context));
  }
}

export function buildMeteorShower(
  gltfModelPath: string,
  array2DImageUrls: string[],
  context: RainSceneContext,
  eggCount: number
): void {
  if (!context.scene && context.init3D) {
    context.init3D();
  }

  context.canvas.style.display = "block";

  if (array2DImageUrls.length > 0) {
    for (let k = 0; k < eggCount; k++) {
      const randomUrlIndex = Math.floor(Math.random() * array2DImageUrls.length);
      const chosenUrl = array2DImageUrls[randomUrlIndex];
      active2DParticles.push(new Moon2D(chosenUrl, context.scene));
    }
  }

  // Safely awaits the clean esm.sh bundle wrapper
  getGLTFLoaderClass().then((GLTFLoaderClass) => {
    if (!context.loader) {
      context.loader = new GLTFLoaderClass();
    }

    context.loader.load(gltfModelPath, (gltf: any) => {
      const masterMesh = gltf.scene.children[0] as THREE.Mesh;

      for (let i = 0; i < 40; i++) {
        active3DParticles.push(new Starbit3D(masterMesh, context.scene));
      }

      if (animationId === null) {
        animateCombinedScene(context);
      }
    }, undefined, (error: any) => {
      console.error("glTF structure failed to load completely:", error);
    });
  });
}

let rainContextCache: RainSceneContext | null = null;

export function constructStarbitShower(): RainSceneContext {
  if (rainContextCache) return rainContextCache;

  let canvas = document.getElementById("bg-canvas") as HTMLCanvasElement | null;
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