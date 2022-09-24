const [cr, cr_content, license] = [document.getElementById("copyright"), document.createElement("h3"), document.createElement("a")];

[license.target, license.href, license.title] = ["_blank", "https://github.com/Reper2/reper2.github.io/blob/master/LICENSE", "View License (Alt+R)"];
cr_content.innerHTML = "(c) 2022 Reper2";

license.appendChild(cr_content);
cr.appendChild(license);