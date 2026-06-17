import * as THREE from 'https://esm.sh/three@0.160.0';

/**
 * 🫧 Generates a fully procedural 3D Soap Bubble Mesh with realistic highlights and transparency
 */
export function createProceduralBubble(radius: number = 2): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(radius, 64, 64);

  const material = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);

        // Light direction from top-left quadrant
        vec3 lightDir = normalize(vec3(-0.6, 0.6, 0.5));

        // 1. FRESNEL RIM LIGHTING: Spreads structure elegantly away from just the razor edge
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);

        // 2. IRIDESCENT FILM COLORS: Vibrant but clean oil colors on the rim
        vec3 colorRed   = vec3(0.95, 0.4, 0.55) * sin(normal.x * 3.0);
        vec3 colorGreen = vec3(0.35, 0.95, 0.65) * sin(normal.y * 3.0 + 2.0);
        vec3 colorBlue  = vec3(0.4, 0.6, 0.95) * sin(normal.z * 3.0 + 4.0);
        vec3 iridescentEdge = abs(colorRed + colorGreen + colorBlue) * fresnel * 0.45;

        // 3. SPECULAR SPOT: Tight, crisp Vecteezy-style clean circle highlight
        vec3 halfDir = normalize(lightDir + viewDir);
        float ndoth = max(dot(normal, halfDir), 0.0);
        float specIntensity = pow(ndoth, 64.0);
        float primaryHighlight = smoothstep(0.3, 0.85, specIntensity) * 0.85;

        // 4. HIGH-VISIBILITY ALPHA VOLUME FLOOR:
        // Set to 0.30 so the bubble shell is perfectly visible and never vanishes!
        float baseAlpha = max(fresnel * 0.5, 0.30);
        float finalAlpha = max(baseAlpha, primaryHighlight);

        vec3 finalColor = iridescentEdge + vec3(primaryHighlight);

        gl_FragColor = vec4(finalColor, finalAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });

  return new THREE.Mesh(geometry, material);
}

// =========================================================================
// 🫧 Helper function to mount 3D Bubble with automatic 2D Image Fallback
// =========================================================================
export function mountLocal3DBubble(container: HTMLElement, assets: any): void {
  const glAvailable = (() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  })();

  if (!glAvailable) {
    console.warn("WebGL not supported or disabled by client browser. Initialising 2D asset fallback.");
    const fallbackImg = document.createElement("img");
    fallbackImg.className = "egg-box 2d-bubble-fallback";
    fallbackImg.src = assets.original.boxSrc;
    fallbackImg.alt = assets.original.boxAlt;
    container.appendChild(fallbackImg);
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.className = "egg-box 3d-bubble-canvas";
  canvas.style.width = "64px";
  canvas.style.height = "64px";
  container.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(64, 64);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 2;

  const bubbleMesh = createProceduralBubble(0.95);
  scene.add(bubbleMesh);

  let animationFrameId: number;

  function tick() {
    // Gentle rotation makes the thin-film iridescence swirl smoothly
    bubbleMesh.rotation.y += 0.003;
    bubbleMesh.rotation.x += 0.001;

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(tick);
  }

  tick();

  const mutationObserver = new MutationObserver(() => {
    if (!document.body.contains(canvas)) {
      cancelAnimationFrame(animationFrameId);
      bubbleMesh.geometry.dispose();
      (bubbleMesh.material as THREE.ShaderMaterial).dispose();
      renderer.dispose();
      mutationObserver.disconnect();
    }
  });
  mutationObserver.observe(container, { childList: true });
}