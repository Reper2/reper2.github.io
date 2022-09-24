const [footer, hashLink, content, yt, gh, ytLogo, ghLogo] = [document.getElementById("footer"), document.createElement("a"), document.createElement("h3"), document.createElement("a"), document.createElement("a"), document.createElement("img"), document.createElement("span")];

hashLink.href = "#footer";

[yt.target, yt.href, yt.title] = ["_blank", "https://www.youtube.com/channel/UCofCDfLjs_TkiC-p0-k_9XA", "Reper2 - YouTube"];
[ytLogo.src, ytLogo.style.width, ytLogo.alt] = ["/assets/social-logos/youtube.svg", "15vmin", "yt_logo"];
yt.appendChild(ytLogo);
content.appendChild(yt);

content.append("\u00A0");

[gh.target, gh.href, gh.title] = ["_blank", "https://github.com/Reper2", "Reper2 - GitHub"];
[ghLogo.className, ghLogo.dataset.icon, ghLogo.dataset.width] = ["iconify", "octicon:mark-github-16", "50"];
gh.appendChild(ghLogo);
content.appendChild(gh);

hashLink.appendChild(content);
footer.appendChild(hashLink);