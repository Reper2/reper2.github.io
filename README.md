# Frosty Volcano Summit
![logo](/images/logo.png)  

My website includes a library of all my publicly released software, customisation features to enhance your experience, a brief biography, native keyboard shortcuts for accessibility, hidden Easter eggs to collect, and official social links.

## 🎨 Dynamic UI Theming & Responsive Layouts
The platform features an active theme-switching engine allowing users to toggle between layout configurations via the runtime settings:

* **Alt-Inspired Production Theme:** Features a high-fidelity theme adapted from open-source design tokens. Layout buttons dynamically scale across custom vector shapes while introducing exclusive custom audio cues mapped to specific runtime events.
* **Layout Fallback Metrics:** Toggling off the active theme reverts the DOM layout to an optimised baseline layout. While the baseline layout increases text contrast and general readability, the stylised rounded vector buttons automatically fallback to standard rectangular blocks to maintain structural integrity and prevent visual clipping across shifting viewports.

*Asset Attribution:* Vector assets, layout parameters, and the primary coffee-brown design palette were exported from [Hunter Paramore's Alt BoTW UI Kit via Figma Community](https://www.figma.com/design/dDphMZUpaniUZMa10jsdYE/Alt-BOTW-UI-Kit--Community-?node-id=34-1520&p=f&t=Gdxz9FNhcrxFuy2N-0)

The original theme is set by default once you locate all the eggs, as the premium version of the website was optimised for the original theme and does not overlap with the Alt layout structurally. You can still toggle back to the Alt theme, but the buttons will revert to standard rectangular blocks instead of stylised rounded buttons.

## 📦 Dynamic Supply Chain & In-Memory Asset Decompression
To balance network performance against deployment storage footprints, the platform leverages an archive-streaming strategy for audio delivery:
* **Remote Dependency Pinning:** Third-party extraction layers are fetched dynamically using pinned ES modules directly from upstream content delivery networks (`https://esm.unpkg.com/@zip.js/zip.js`), reducing local source distribution footprints and limiting supply chain vulnerabilities.
* **On-the-Fly Stream Parsing:** Rather than permanently hosting bulky decompressed media formats or pre-caching entire directories, an `HttpReader` target acts as a random-access network interface. It isolates and extracts scoped tracking parameters inside compressed `.zip` containers on demand.
* **Volatile Object URL Mapping:** Extracted track byte arrays are transformed sequentially using transient browser blobs via `URL.createObjectURL`. This guarantees media rendering inside standard HTML5 elements without exposing physical directory hierarchies or persisting duplicate assets to the local client drive.

## 🛠️ Localhost Feature Flagging & Dynamic Code Splitting
To protect against technical leakage and restrict diagnostic backdoors, the platform enforces strict environment segmentation:
* **Conditional Module Resolution:** Heavy diagnostic components, such as `eggs/debug`, are strictly quarantined and loaded using asynchronous dynamic imports only when a verified local test environment is parsed.
* **Localhost Form Restrictions:** Core interface generation routines isolate music dropdown matrices, text input entry fields, and tracking submission variables to localhost. In live production builds, the app restricts forms to simple aesthetic customisations (such as background styling panels), limiting the public-facing interactive footprint.

## 🥚 Easter Eggs & Cryptographic System
I have hidden complex Easter eggs across my digital ecosystem. Locating all hidden elements unlocks a premium portal showcasing the true personality of Frosty Volcano Summit. As new eggs are introduced into production, access to the premium tier is revoked until the new parameters are identified. 

### 🛡️ Security Architecture, Obfuscation & Deterrence
From a defensive security perspective, this subsystem was engineered to introduce client-side deterrence against rapid manipulation, simple runtime modification, and superficial reverse engineering:
* **Cryptographic Verification:** The egg hunting architecture relies on canonical strings that are dynamically hashed and executed to attempt decryption of the reward payload. The final validation object acts as the authenticated encryption/decryption key, complete with an **AEAD auth tag** to defend against basic ciphertext tampering.
* **Code Obfuscation & Entropy:** The compiled client-side JavaScript is heavily obfuscated, severely inflating the cognitive load and complexity curve required for automated scraping or manual analysis.
* **Self-Defending Runtimes:** The codebase features active integrity checking and self-defending logic. Attempting to pass the script through a code beautifier, hook the environment, or manipulate the AST (Abstract Syntax Tree) will trigger defensive dead-loops, deliberately crashing the execution context or forcing an infinite execution state.
* **Client-Side Boundaries:** While these mitigations deter casual browser tampering, the architecture acknowledges that complete threat mitigation requires server-side validation. This subsystem serves as an educational sandbox for evaluating client-side defense in depth.

### 💾 Secure State Management & Client-Side Partitioning (`eggs/secure-storage.ts`)
To increase the technical barrier against game-state manipulation (such as users manually editing `localStorage` variables to skip finding eggs), the system implements a highly customised storage-wrapping architecture:

* **Integrity Validation Layer:** Leverages a customised, deterministic **DJB2 hashing variant** combined with a hardcoded application salt (`8675309`). Every time state transitions occur, an agnostic byte-stream serialisation function sorts entity properties alphabetically to guarantee predictable hashing signatures. This blocks basic injection or parameter manipulation in local storage.
* **Legacy State Migration Pipeline:** Includes an automated, fail-safe data routing system that detects, parses, updates, and securely sanitises unhashed legacy data formats into the modern shielded storage layout seamlessly without interrupting runtime access.
* **Low-Level Custom Binary Parser:** The `importFromFile` module abandons generic JSON parsing for backup data. It executes as a low-level binary parser manipulating an array stream (`Uint8Array`) using a custom binary specification via JavaScript `DataView`:
  * **Brand-Integrated Preamble Verification:** Enforces a rigid 6-byte dual-theme signature block split across hex-mapped constants. Rather than using generic placeholders, the system uses the website's literal aesthetic RGB profiles (representing the "Magic Ice" and "Magic Fire" colour schemes) as the functional magic bytes to validate asset provenance.
  * **Variable-Length Packet Decoding:** Dynamically steps through raw bytes using 16-bit and 32-bit offsets to manually reconstruct variable-length string packets (Keys, Paths, Title Lengths) while continually asserting checksum safety across the file boundary.

### 🔒 Resilient Storage Abstraction (`core/storage.ts`)
To interface with volatile web storage subsystems without introducing single points of failure, the codebase implements a custom, highly decoupled storage wrapper abstraction:

* **Zero-Dependency Core Execution:** Built explicitly with zero external module dependencies to definitively eliminate execution order hazards and circular initialisation loops within the core storage lifecycle.
* **Defensive Sandbox Exception Handling:** Interfacing with standard Web APIs (`localStorage` and `sessionStorage`) is aggressively wrapped in local try/catch closures. This blocks fatal DOM exceptions from throwing when the platform encounters restrictive user agent sandboxes, such as Apple Safari's private browsing storage blocks or third-party cookie restrictions.
* **Atomic State Propagation via URL Push:** the platform implements state synchronisation using `window.history.replaceState`. This enables volatile runtime flags to be written cleanly back to the client browser's address query string context (`URLSearchParams`) atomically without forcing a complete DOM re-render or layout jitter.

### 🌐 PWA Lifecycle Orchestration & Environment Isolation (`buttons.ts`)
To coordinate client-side interaction planes without expanding the platform's attack surface, the initialisation engine manages service workers and state logic through strict sandboxing:

* **Asynchronous Service Worker Registration:** Encapsulates the Service Worker (PWA) installation funnel within a protective fallback wrapper. It monitors worker thread transitions (`installing` -> `waiting` -> `active`) inside isolated console group logs, ensuring the platform's offline caching engine handles data streams safely without hanging execution threads.
* **Environment-Isolated Panel Hooking:** Employs environmental detection constraints (`isLocalhost`) before spinning up low-level debug interfaces, such as the `AudioControlPanel`. This prevents internal application hooks, diagnostics, or mock testing panels from leaking into the public-facing production environment.
* **Proactive Event Listener Cleanup & Resource Leak Prevention:** Implements garbage collection safeguards across the Window lifecycle boundary. By actively capturing, nullifying, and executing `removeEventListener` for deferred PWA install prompts (`beforeinstallprompt`, `appinstalled`) during `onbeforeunload`, the code defends against DOM memory leaks and dangling pointer hooks.
* **Secure Navigation & Tab-Nabbing Mitigation:** Enforces defensive context policies on external hyperlinks (such as project licensing targets) using explicitly configured `rel="noopener noreferrer"` properties. This stops parent window context manipulation via target-page hijackings (`window.opener` exploits).

### 🖼️ Remote CDN Asset Ingestion & Performance Double-Buffering (`core/bg.ts`)
To stream dynamic visual backdrops without introducing client-side lag or cross-origin execution risks, the system isolates remote network requests through a specialised asset delivery mechanism:

* **Pre-Rendering Memory Caching Engine:** Instantiates unattached image objects in volatile memory (`new Image()`) to fetch remote graphical payloads completely off-screen. By listening for the atomic asynchronous `onload` event before editing the layout tree, the platform guarantees zero rendering blocking or layout stutter.
* **State-Controlled Double-Buffering:** Implements a hardware-inspired double-buffering routine using alternating layout layers via CSS custom properties (`--bg-before` and `--bg-after`). Flipping a boolean switch (`isLayerA`) transitions the visual layer, preventing raw texture popping or flashes when assets swap.
* **Decoupled Private Asset Delivery Architecture:** Resolves remote asset paths directly from a dedicated, self-managed media repository (`Reper2/switch-album`) containing original console image captures. By isolating your media files from the primary website codebase, you reduce git bloat, separate structural application code from static assets, and pull verified content dynamically via GitHub's unauthenticated distributed storage framework (`://githubusercontent.com`).

### 🌐 Private Network Perimeter Detection & Debug Configuration Overrides (`core/core.ts`)
To securely manage application state profiles across varying deployments, the core initialisation module implements explicit network boundary analysis and runtime environment testing:

* **RFC 1918 Local Subnet Evaluation:** Goes beyond a basic hostname string match to evaluate the client browser's active network footprint. It leverages specialised Regular Expressions (`RegEx`) to parse and discover if the host sits inside standard private IPv4 subnets (Class A: `10.0.0.0/8`, Class B: `172.16.0.0/12`, Class C: `192.168.0.0/16`) or loopback adapter spaces (`127.0.0.1`, `::1`), establishing a precise local network perimeter.
* **Storage-Driven Production Override (Simulated Sandboxing):** Exposes a scoped hardware storage override hook (`fvs_dev_force_production`) directly to the window namespace (`window.devModeStorage`). Setting a local `sessionStorage` token to `"true"` immediately bypasses the subnet detection array. This allows developers to force strict production environmental behaviours locally on a workstation to analyse runtime security compliance before launching live updates.
* **Deterministic Double-Pass Randomization Engine:** The `RandomPicker` abstraction accepts standardised configuration arrays (`Name[]`) to handle multi-stage random selection workflows. By isolating array lookup algorithms through structured callback channels (`pick`), the architecture keeps asset delivery logic completely independent of visual interface components.

### 🎨 WebGL Animation Lifecycle & Low-Level Memory Management (`core.ts` / `utils.ts`)
To stream dynamic visual rewards (such as the Starbit shower unlocked via Easter Egg discovery) without introducing client-side execution lag, main-thread blocking, or browser memory exhaustion, the platform implements an isolated Three.js execution environment:

* **Strict Memory Lifecycle & Resource Disposal:** WebGL contexts do not automatically garbage-collect GPU-allocated resources. To prevent severe client-side browser memory leaks during long-running sessions, the `Starbit3D` and `Moon2D` classes implement explicit `.destroy()` lifecycle hooks. These hooks manually target and invoke `.dispose()` on underlying geometries, materials, and cached textures, while cleanly evicting the cloned meshes from the active `THREE.Scene` graph hierarchy.
* **Isolated Texture De-Duplication Caching Engine:** To mitigate network overhead and avoid multiple concurrent fetch requests for identical remote graphical assets, the system implements a volatile memory `textureCache` object. By intercepting incoming file paths and serving previously instantiated `THREE.Texture` objects from a local dictionary pointer, the platform reduces redundant HTTP I/O footprints and limits client-side resource strain.
* **Dynamic, Content-Type Isolated Asynchronous Module Loading:** The codebase decouples the heavy 3D asset ingestion pipeline by dynamically loading the `GLTFLoader` class using asynchronous ES module imports (`import()`) from a pinned CDN vendor (`esm.sh`). This keeps the initial application bundle lightweight, defers processing costs until an animation event is explicitly triggered, and wraps the dynamic import in rigid try/catch blocks to isolate module resolution failures from dropping execution threads.
* **Non-Blocking Frame Invalidation & Execution Self-Termination:** The rendering pipeline couples `requestAnimationFrame` tracking variables to an atomic `animationId` wrapper context. When the active array collections for running objects (`activeStarbits` and `activeMoons`) drop to zero, the engine invokes `cancelAnimationFrame`, invalidates the rendering loop, and explicitly updates the DOM layer (`display: none`). This prevents phantom background compute cycles, shields mobile device batteries from thermal degradation, and mitigates frame-rate stutter on low-powered client hardware.

*Regions with active hidden parameters:* Base Website, Desktop Clock, Mobile Clock.

*(Note: My Animal Crossing platform and upcoming Tomodachi Life project will receive similar cryptographic updates in a few months).*

## ⌨️ Accessibility & Keybinds
The platform features native desktop shortcut mapping to streamline navigation, trigger interactions, and manage application controls globally:

| Key Binding | Action Triggered |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>/</kbd> | Open Keybind List |
| <kbd>Alt</kbd> + <kbd>S</kbd> | Show Audio Controls |
| <kbd>Alt</kbd> + <kbd>H</kbd> | Hide Audio Controls |
| <kbd>Ctrl</kbd> + <kbd>I</kbd> | Install Web App (PWA) |
| <kbd>Ctrl</kbd> + <kbd>C</kbd> | Copy Site Link |
| <kbd>Alt</kbd> + <kbd>L</kbd> | View Project License |
| <kbd>Enter</kbd> | Confirm Current Selection |
| <kbd>Alt</kbd> + <kbd>R</kbd> | Reset Current Selection |
| <kbd>?</kbd> | Randomise Selection |
| <kbd>X</kbd> | Open Source Code Repository |
| <kbd>Backspace</kbd> | Navigate Back to Previous Referral Page |
| <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>D</kbd> | Open Developer Source Maps and Script Distribution Layers (`keybinds.js` / `keybinds.ts`) |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> | Reset All Found Easter Eggs |

*Note: Some regions of the keybinds page may contain hidden anomalies. Keep an eye out for hidden bubbles while browsing your shortcuts!*

## 📱 Progressive Web App Functionality
If your browser supports modern PWA architecture, you can install this platform to run locally and offline. To optimise performance and storage, asset loading is stratified: only cached backgrounds load without an active network connection, as they are fetched dynamically rather than pre-cached aggressively inside the Service Worker.

## 🖼️ Backgrounds
Background assets displayed on this and associated platforms are dynamically fetched via a custom architecture from the [switch-album](https://github.com/Reper2/switch-album) repository.

## ⏰ Clocks
I have published [mobile](https://github.com/Reper2/mobile-clock) and [desktop](https://github.com/Reper2/desktop-clock) clock interfaces:
* **Mobile Clock:** Engineered as an ambient background utility for focus blocks, utilising original travel photography with low-distraction gradient text animations.
* **Desktop Clock:** Optimised for large-format display output (TVs or secondary monitors) during active gaming sessions.

## ⚖️ Asset Governance & Disclaimer
This is an independent, non-commercial, fan-made passion project designed for technical evaluation, portfolio demonstration, and educational research purposes.

* **Intellectual Property:** All character assets and Animal Crossing terrain textures present on this website are the registered trademarks and intellectual property of **[Nintendo Co., Ltd.](https://www.nintendo.com/)**
* **Typography & Vetting:** Typographic elements used for styling (including fan-created typefaces like *Super Mario 256* and *Hylia Serif*) are gathered directly from verified distribution points. They are utilised strictly in a transformative, non-commercial capacity to test interface aesthetics.
* **Risk & Compliance Isolation:** This platform is fully isolated from commercial monetisation channels. No copyright infringement is intended, and all original rights are recognised and reserved by their respective brand owners.
* **Fallback Bubble Image:** [Bubble PNGs by Vecteezy](https://www.vecteezy.com/free-png/bubble)