/**
 * @author Ethan Graham
 * @license MIT
 * @copyright 2021-2026 Ethan Graham
 * @see https://github.com/fire-ethan/fire-ethan.github.io/blob/master/LICENSE
 * License information in LICENSE file overrides any other license information in this file.
 */

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

declare module 'https://esm.sh/@eg-frosty-volcano/cosmic-shower@1.0.2?external=three' {
  export * from '@eg-frosty-volcano/cosmic-shower';
}