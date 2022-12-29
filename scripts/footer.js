"use strict";

const footer = {
	_: document.getElementById("footer"),
	social: {
		link: [],
		logo: [document.createElement("img"), document.createElement("span")]
	},
	cr: {
		license: document.createElement("a"),
		txt: document.createElement("h3")
	}
};
for (let i = 0; i < footer.social.logo.length; i++) {
	footer.social.link.push(document.createElement("a"));
	[footer.social.link[i].target, footer.social.link[i].rel] = ["_target", "noreferrer noopener"];
	footer.social.logo[i].className = "socialLogo";
}

[footer.social.link[0].href, footer.social.link[0].title] = ["https://www.youtube.com/channel/UCofCDfLjs_TkiC-p0-k_9XA", "Reper2 - YouTube"];
[footer.social.logo[0].src, footer.social.logo[0].style.width, footer.social.logo[0].alt] = ["/assets/social-logos/youtube.svg", "50px", "yt_logo"];
[footer.social.link[1].href, footer.social.link[1].title] = ["https://github.com/Reper2", "Reper2 - GitHub"];
[footer.social.logo[1].className, footer.social.logo[1].dataset.icon, footer.social.logo[1].dataset.width] = ["iconify", "octicon:mark-github-16", "36"];

[footer.cr.license.title, footer.cr.license.href] = ["View License (Alt+R)", "https://github.com/Reper2/reper2.github.io/LICENSE"];
footer.cr.txt.innerHTML = "(c) 2022 Reper2";

for (let i = 0; i < footer.social.logo.length; i++) {
	footer.social.link[i].appendChild(footer.social.logo[i]);
	footer._.appendChild(footer.social.link[i]);
}
footer.cr.license.appendChild(footer.cr.txt);
footer._.appendChild(footer.cr.license);