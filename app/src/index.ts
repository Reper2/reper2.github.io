import './app';
import './buttons';
import './eggs/';
import './keybinds';

import { isLocalhost } from './core/';
if (isLocalhost) {
  import('./eggs/debug')
    .then(() => console.log("🛠️ Localhost detected: Debug utilities loaded."))
    .catch(err => console.warn("Failed to load debug-secret.js:", err));
}