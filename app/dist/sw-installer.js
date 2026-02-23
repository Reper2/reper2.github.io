const sw = {
    sessStart: sessionStorage.getItem("session_started"),
    i: {
        _: document.getElementById("install"),
        btn: document.createElement("button"),
        tt: document.createElement("span"),
        msg: "Thank you for installing the app!"
    }
};
let installListener = null;
let appInstalledListener = null;
onload = () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js").then((reg) => {
            console.groupCollapsed("Service Worker Status");
            if (reg.installing) {
                console.log("Service worker installing");
            }
            if (reg.waiting) {
                console.log("Service worker installed");
            }
            if (reg.active) {
                console.log("Service worker active");
            }
            console.log("Service Worker registration successful with scope:", reg.scope);
            console.groupEnd();
        }).catch((err) => console.error("Service Worker registration failed:", err));
    }
    if (!matchMedia("(display-mode: standalone)").matches) {
        let deferredPrompt;
        installListener = function install(e) {
            e.preventDefault();
            deferredPrompt = e;
        };
        window.addEventListener("beforeinstallprompt", installListener);
        sw.i._.onclick = async () => {
            if (deferredPrompt !== null) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === "accepted")
                    deferredPrompt = null;
            }
        };
        sw.i._.className = "tooltip";
        sw.i.btn.innerHTML = "📲";
        [sw.i.tt.className, sw.i.tt.innerHTML] = ["tooltiptext", "Install App (Ctrl+I)"];
        sw.i.btn.appendChild(sw.i.tt);
        sw.i._.appendChild(sw.i.btn);
    }
    appInstalledListener = function installed() {
        if (installListener) {
            window.removeEventListener("beforeinstallprompt", installListener);
        }
        console.log(sw.i.msg);
        console.warn("Reload to remove the install button.");
    };
    window.addEventListener("appinstalled", appInstalledListener);
};
window.onbeforeunload = () => {
    if (installListener) {
        window.removeEventListener("beforeinstallprompt", installListener);
    }
    if (appInstalledListener) {
        window.removeEventListener("appinstalled", appInstalledListener);
    }
};
export {};
//# sourceMappingURL=sw-installer.js.map