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
declare module 'https://cdn.jsdelivr.net/npm/fflate@0.8.2/+esm' {
  export * from 'fflate';
}
declare module 'https://cdn.jsdelivr.net/npm/workbox-window@6.5.4/+esm' {
  import { Workbox as LocalWorkbox } from 'workbox-window';
  export { LocalWorkbox as Workbox };
}