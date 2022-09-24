/* eslint-disable no-undef */
$(document).keydown(function (k) {
	if (k.ctrlKey && k.key === "/") {
		console.warn("Ctrl+/ was pressed...");
		window.location.href = "/keybinds";
	}

	if (k.altKey && k.key === "s") {
		console.warn("Alt+S was pressed...");
		$("#audctrlBtn_show").trigger("click");
	}

	if (k.altKey && k.key === "h") {
		console.warn("Alt+H was pressed...");
		$("#audctrlBtn_hide").trigger("click");
	}

	if (k.ctrlKey && k.key === "c") {
		console.warn("Ctrl+C was pressed...");
		$("#copy").trigger("click");
	}

	if (k.key === "l") {
		console.warn("L was pressed...");
		window.open("https://github.com/Reper2/reper2.github.io/blob/master/LICENSE");
	}

	if (k.ctrlKey && k.key === "i") {
		console.warn("Ctrl+I was pressed...");
		$("#install").trigger("click");
	}

	if (k.key === "Enter") {
		console.warn("Enter was pressed...");
		$("#optSet").trigger("click");
	}

	if (k.key === "Backspace") {
		console.warn("Backspace was pressed...");
		$("#optReset").trigger("click");
	}

	if (k.key === "?") {
		console.warn("? was pressed...");
		$("#optRand").trigger("click");
	}

	if (k.key === "x") {
		console.warn("X was pressed...");
		window.open("/scripts/kb.js");
	}
});