import { isLocalhost } from './core/utils.js';
import './app.js';
import './buttons.js';
import './eggs.js';
import './keybinds.js';

if (isLocalhost) {
  import('./debug-secret.js')
    .then(() => console.log("🛠️ Localhost detected: Debug utilities loaded."))
    .catch(err => console.warn("Failed to load debug-secret.js:", err));
}