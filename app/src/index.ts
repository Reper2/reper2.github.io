import './sw-installer.js';
import './keybinds.js';
import './app.js';
import './eggs.js';
import './audctrls.js';
import './copy-link.js';

const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

if (isLocalhost) {
  import('./debug-secret.js')
    .then(() => console.log("🛠️ Localhost detected: Debug utilities loaded."))
    .catch(err => console.warn("Failed to load debug-secret.js:", err));
}