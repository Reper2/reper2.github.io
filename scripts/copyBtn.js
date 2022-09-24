const [copyDiv, copyBtn, copyTooltip] = [document.getElementById("copy"), document.createElement("button"), document.createElement("span")];

copyDiv.className = "tooltip";
copyDiv.addEventListener("click", () => {
	const link = window.location.href;
	navigator.clipboard.writeText(link);
	console.log("📋Added to clipboard:", link);
	alert("Copied link: " + link);
});

copyBtn.innerHTML = "📋";

[copyTooltip.className, copyTooltip.id, copyTooltip.innerHTML] = ["tooltiptext", "copy-tooltip", "Copy Link (Ctrl+C)"];

copyBtn.appendChild(copyTooltip);
copyDiv.appendChild(copyBtn);