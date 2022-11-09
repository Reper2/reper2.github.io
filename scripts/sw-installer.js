/**
 * Copyright 2022 Reper2
 * 
 * Licensed under the MIT License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * 		https://github.com/Reper2/reper2.github.io/LICENSE
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *   
 */

"use strict";

const sw = {
	sessStart: sessionStorage.getItem("session_started"),
	i: {
		_: document.getElementById("install"),
		btn: document.createElement("button"),
		tt: document.createElement("span"),
		msg: "Thank you for installing the app!"
	}
};

if (sw.sessStart != "true") {
	alert("Welcome to Reper2's Epic Website!\nPress Ctrl+/ for a list of keybinds.");
	sessionStorage.setItem("session_started", "true");
}

onload = () => {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.register("/sw.js").then((registration) => {
			console.log("ServiceWorker registration successful with scope:", registration.scope);
			if (registration.installing) console.log("Service worker installing");
			if (registration.waiting) console.log("Service worker installed");
			if (registration.active) console.log("Service worker active");
		}).catch((err) => console.error("ServiceWorker registration failed:", err));
	}

	if (!matchMedia("(display-mode: standalone)").matches) {
		let deferredPrompt;
		onbeforeinstallprompt = (e) => deferredPrompt = e;

		sw.i._.onclick = async () => {
			if (deferredPrompt !== null) {
				deferredPrompt.prompt();
				const { outcome } = await deferredPrompt.userChoice;
				if (outcome === "accepted") deferredPrompt = null;
			}
		};

		sw.i._.className = "tooltip";
		sw.i.btn.innerHTML = "📲";
		[sw.i.tt.className, sw.i.tt.innerHTML] = ["tooltiptext", "Install App (Ctrl+I)"];

		sw.i.btn.appendChild(sw.i.tt);
		sw.i._.appendChild(sw.i.btn);
	}
};

onappinstalled = () => {
	console.log(sw.i.msg);
	console.warn("Reload to remove the install button.");
};