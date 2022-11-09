/**
 * Copyright 2022 Reper2
 * 
 * Licensed under the MIT License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * 		https://github.com/Reper2/reper2.github.io/LICENSE
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *   
 */

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