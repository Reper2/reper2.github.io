// The whole purpose of this is... https://developer.chrome.com/blog/autoplay/ and also greet the user and inform them about keyboard shortcuts
const checkFirstVisit = sessionStorage.getItem("session_visited");
if (checkFirstVisit == null) {
	alert("Welcome to Reper2's Website!\nPress Ctrl+/ for a list of keyboard shortcuts.");
	sessionStorage.setItem("session_visited", "true");
}

onload = () => {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.register("/sw.js").then(function (registration) {
			console.log("ServiceWorker registration successful with scope:", registration.scope);
			if (registration.installing) console.log("Service worker installing");
			if (registration.waiting) console.log("Service worker installed");
			if (registration.active) console.log("Service worker active");
		}).catch(function (err) { console.error("ServiceWorker registration failed:", err); });
	}

	// Only execute if app is not already installed
	if (!matchMedia("(display-mode: standalone)").matches) {
		const [installDiv, installBtn, installTooltip] = [document.getElementById("install"), document.createElement("button"), document.createElement("span")];

		installDiv.className = "tooltip";
		installBtn.innerHTML = "📲";
		[installTooltip.className, installTooltip.id, installTooltip.innerHTML] = ["tooltiptext", "install-tooltip", "Install App (Ctrl+I)"];

		installBtn.appendChild(installTooltip);
		installDiv.appendChild(installBtn);
	}
};

let deferredPrompt;
onbeforeinstallprompt = (e) => deferredPrompt = e;

// eslint-disable-next-line no-undef
install.addEventListener("click", async () => {
	if (deferredPrompt !== null) {
		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === "accepted") deferredPrompt = null;
	}
});

onappinstalled = () => {
	var msg = "Thank you for installing the app!";
	alert(msg);
	console.log("🙏🏼" + msg);
	console.warn("Reload to remove the install button.");
};