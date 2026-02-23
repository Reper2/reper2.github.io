"use strict";
const footerEl = document.getElementById("footer");
if (!footerEl)
    throw new Error("Footer element not found");
const footer = {
    elem: footerEl,
    cr: {
        license: document.createElement("a"),
        txt: document.createElement("h3")
    }
};
footer.cr.license.title = "View License (Alt+L)";
footer.cr.license.href = "https://github.com/Reper2/reper2.github.io/blob/master/LICENSE";
footer.cr.license.target = "_blank";
footer.cr.license.rel = "noopener noreferrer";
footer.cr.txt.textContent = "(c) 2021-2026 Reper2";
footer.cr.license.appendChild(footer.cr.txt);
footer.elem.appendChild(footer.cr.license);
//# sourceMappingURL=footer.js.map