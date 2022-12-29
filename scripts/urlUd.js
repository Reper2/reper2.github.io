"use strict";
/* eslint-disable no-undef */

const urlUd = {
	_: document.getElementById("urlUpdate"),
	btn: document.createElement("button"),
	tt: document.createElement("span")
};

[urlUd._.className, urlUd._.onclick] = ["tooltip", () => window.location.href = "./?music=" + encodeURIComponent(opt.mus._sav.ss) + "&grass=" + encodeURIComponent(opt.grass._sav.ss) + "&bg=" + encodeURIComponent(opt.bg._sav.ss)];
urlUd._.className = "tooltip";
urlUd.btn.innerHTML = "🔄️🔗";
[urlUd.tt.className, urlUd.tt.innerHTML] = ["tooltiptext", "Update URL with new params (Ctrl+U)"];

urlUd.btn.appendChild(urlUd.tt);
urlUd._.appendChild(urlUd.btn);