import * as THREE from "https://esm.sh/three@0.160.0";

const starBitColours: number[] = [
  0xBE330B, // Red/Orange
  0xE6A000, // Yellow
  0x308000, // Deep Green
  0x46A108, // Bright Green
  0x375AA0, // Galaxy Blue
  0x800099  // Purple
];

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/assets/HighLight3.png');

export const active3DParticles: Starbit3D[] = [];
export const active2DParticles: Moon2D[] = [];

const textureCache: Record<string, THREE.Texture> = {};

export class Starbit3D {
  public mesh: THREE.Mesh;
  private speedY: number;
  private speedX: number;
  private spinX: number;
  private spinY: number;
  private spinZ: number;
  private scene: THREE.Scene;

  constructor(originalMesh: THREE.Object3D, scene: THREE.Scene) {
    this.scene = scene;

    this.mesh = originalMesh.clone() as THREE.Mesh;
    this.mesh.visible = true;

    const randomColour = starBitColours[Math.floor(Math.random() * starBitColours.length)];

    matcapTexture.mapping = THREE.EquirectangularReflectionMapping;

    const customMaterial = new THREE.MeshPhongMaterial({
      color: randomColour,
      emissive: randomColour,
      emissiveIntensity: 0.75,
      specular: 0xaaaaaa,
      shininess: 120,
      envMap: matcapTexture,
      reflectivity: 0.8,

      combine: THREE.AddOperation,
      flatShading: true
    });

    this.mesh.traverse((child) => {
      child.visible = true;
      if ((child as THREE.Mesh).isMesh) {
        const meshChild = child as THREE.Mesh;

        if (meshChild.geometry) {
          meshChild.geometry = meshChild.geometry.clone();
        }

        if (meshChild.geometry.attributes.UVSET0 && !meshChild.geometry.attributes.uv) {
          meshChild.geometry.setAttribute('uv', meshChild.geometry.attributes.UVSET0);
        }

        // Clear old vertex coloring to keep the highlight pure white
        if (meshChild.geometry.attributes.color) {
          meshChild.geometry.deleteAttribute('color');
        }

        meshChild.geometry.computeVertexNormals();
        meshChild.material = customMaterial;
      }
    });

    // Normalized dimensions for a narrow 12-degree FOV viewport
    const targetScale = 0.6 + Math.random() * 0.3;

    const box = new THREE.Box3().setFromObject(this.mesh);
    const sizeVec = new THREE.Vector3();
    box.getSize(sizeVec);
    const maxMeshDimension = Math.max(sizeVec.x, sizeVec.y, sizeVec.z) || 1;
    const finalScale = targetScale / maxMeshDimension;
    this.mesh.scale.set(finalScale, finalScale, finalScale);

    this.mesh.position.x = -16 + (Math.random() * 12);
    this.mesh.position.y = 0 + (Math.random() * 9);
    this.mesh.position.z = Math.random() * 2 - 1;

    this.speedY = 0.03 + Math.random() * 0.02;
    this.speedX = this.speedY * 1.55;

    this.spinX = Math.random() * 0.04 - 0.02;
    this.spinY = Math.random() * 0.04 - 0.02;
    this.spinZ = Math.random() * 0.04 - 0.02;

    this.scene.add(this.mesh);
  }

  public update(): void {
    this.mesh.position.y -= this.speedY;
    this.mesh.position.x += this.speedX;

    this.mesh.rotation.x += this.spinX;
    this.mesh.rotation.y += this.spinY;
    this.mesh.rotation.z += this.spinZ;
  }

  public destroy(): void {
    this.scene.remove(this.mesh);
    if (this.mesh.geometry) this.mesh.geometry.dispose();
    if (this.mesh.material) {
      if (Array.isArray(this.mesh.material)) {
        this.mesh.material.forEach(m => m?.dispose());
      } else {
        this.mesh.material.dispose();
      }
    }
  }
}

export class Moon2D {
  public sprite: THREE.Sprite;
  private speedY: number;
  private speedX: number;
  private spinZ: number;
  private scene: THREE.Scene;

  constructor(imageTexturePath: string, scene: THREE.Scene) {
    this.scene = scene;

    if (!textureCache[imageTexturePath]) {
      textureCache[imageTexturePath] = textureLoader.load(imageTexturePath);
    }
    const map = textureCache[imageTexturePath];

    const material = new THREE.SpriteMaterial({ map: map, transparent: true });
    this.sprite = new THREE.Sprite(material);

    const targetScale = 0.7 + Math.random() * 0.3;
    this.sprite.scale.set(targetScale, targetScale, 1);

    this.sprite.position.x = -16 + (Math.random() * 12);
    this.sprite.position.y = 0 + (Math.random() * 9);
    this.sprite.position.z = 0.5;

    this.speedY = 0.03 + Math.random() * 0.02;
    this.speedX = this.speedY * 1.55;
    this.spinZ = Math.random() * 0.04 - 0.02;

    this.scene.add(this.sprite);
  }

  public update(): void {
    this.sprite.position.y -= this.speedY;
    this.sprite.position.x += this.speedX;
    this.sprite.material.rotation += this.spinZ;
  }

  public destroy(): void {
    this.scene.remove(this.sprite);
    if (this.sprite.material) this.sprite.material.dispose();
  }
}