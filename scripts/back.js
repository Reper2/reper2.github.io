const [backDiv, backBtn] = [document.getElementById("back"), document.createElement("img")];

backDiv.addEventListener("click", () => {
	if (window.history.length > 1 && document.referrer.startsWith(window.location.origin)) {
		// eslint-disable-next-line semi
		if (window.location.href.endsWith("?download") && sessionStorage.getItem("prevUrl") === window.location.href.replace("?download", "")) window.history.go(-2)
		else if (window.location.href.includes("#") || window.location.href.includes("?")) {
			console.log("⚙️url contained a hash (#) or parameter (?), window.location.href='../' was used rather than window.history.back() to skip all the hashes or url parameters.");
			window.location.href = "../";
		}
		else window.history.back();
	}
	else window.location.href = "../../";
});
[backBtn.src, backBtn.title] = ["/assets/back.png", "Back (Alt+▷)"];
backDiv.appendChild(backBtn);