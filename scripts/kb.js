"use strict";
/* eslint-disable no-undef */

$(document).keydown((k) => {
	if (k.ctrlKey && k.key === "/") window.location.href = "/keybinds";
	if (k.altKey && k.key === "s") $("#audctrlBtn_show").trigger("click");
	if (k.altKey && k.key === "h") $("#audctrlBtn_hide").trigger("click");
	if (k.ctrlKey && k.key === "i") $("#install").trigger("click");
	if (k.altKey && k.key == "u") $("#urlUpdate").trigger("click");
	if (k.ctrlKey && k.key === "c") $("#copy").trigger("click");
	if (k.key === "l") window.open("https://github.com/Reper2/reper2.github.io/blob/master/LICENSE");
	if (k.key === "Enter") $("#optSet").trigger("click");
	if (k.key === "Backspace") $("#optReset").trigger("click");
	if (k.key === "?") $("#optRand").trigger("click");
	if (k.key === "x") window.open("/scripts/kb.js");
});