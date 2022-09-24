const [audctrls, musicPlayer, showBtn, hideBtn, showBtn_tooltip, hideBtn_tooltip] = [document.getElementById("audctrls"), document.getElementById("music"), document.createElement("button"), document.createElement("button"), document.createElement("span"), document.createElement("span")];

audctrls.className = "tooltip";

[showBtn.id, showBtn.style.display, showBtn.innerHTML] = ["audctrlBtn_show", "block", "🎵🎛️"];
[showBtn_tooltip.className, showBtn_tooltip.id, showBtn_tooltip.innerHTML] = ["tooltiptext", "show-tooltip", "Show Audio Controls (Alt+S)"];
showBtn.appendChild(showBtn_tooltip);

[hideBtn.id, hideBtn.style.display, hideBtn.innerHTML] = ["audctrlBtn_hide", "none", "🚫🎵🎛️"];
[hideBtn_tooltip.className, hideBtn_tooltip.id, hideBtn_tooltip.innerHTML] = ["tooltiptext", "hide-tooltip", "Hide Audio Controls (Alt+H)"];
hideBtn.appendChild(hideBtn_tooltip);

audctrls.appendChild(showBtn);
audctrls.appendChild(hideBtn);

showBtn.addEventListener("click", () => {
	[musicPlayer.style.display, showBtn.style.display, hideBtn.style.display] = ["block", "none", "block"];
	console.log("🎵🎛️Audio controls are now visible.");
});

hideBtn.addEventListener("click", () => {
	[musicPlayer.style.display, showBtn.style.display, hideBtn.style.display] = ["none", "block", "none"];
	console.log("🚫Audio controls are now hidden.");
});