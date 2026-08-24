/**
 * @author Ethan Graham
 * @license MIT
 * @copyright 2021-2026 Ethan Graham
 * @see https://github.com/fire-ethan/fire-ethan.github.io/blob/master/LICENSE
 * License information in LICENSE file overrides any other license information in this file.
 */

import './app';
import './buttons';
import './eggs/';
import './keybinds';

import { isLocalhost } from './core/';
if (isLocalhost) {
  import('./eggs/private/debug')
    .then(() => console.log("🛠️ Localhost detected: Debug utilities loaded."))
    .catch(err => console.warn("Failed to load debug-secret.js:", err));
}