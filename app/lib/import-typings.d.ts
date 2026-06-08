declare module 'https://esm.unpkg.com/@zip.js/zip.js' {
  // Pull the type declarations dynamically from the installed package types
  export * from '@zip.js/zip.js';
}
declare module 'https://esm.sh/three@0.160.0' {
  export * from 'three';
}
declare module 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js' {
  import { GLTFLoader as LocalGLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  export { LocalGLTFLoader as GLTFLoader };
}