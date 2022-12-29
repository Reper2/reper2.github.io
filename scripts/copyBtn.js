"use strict";

const copy = {
	_: document.getElementById("copy"),
	btn: document.createElement("button"),
	tt: document.createElement("span"),
	link: window.location.href
};

copy._.onclick = () => {
	navigator.clipboard.writeText(copy.link);
	console.log("📋Added to clipboard:", copy.link);
	alert("Copied link: " + copy.link);
};

copy._.className = "tooltip";
copy.btn.innerHTML = "📋";
[copy.tt.className, copy.tt.innerHTML] = ["tooltiptext", "Copy Link (Ctrl+C)"];

copy.btn.appendChild(copy.tt);
copy._.appendChild(copy.btn);