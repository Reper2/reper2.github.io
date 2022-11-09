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

const copy = {
	_: document.getElementById("copy"),
	btn: document.createElement("button"),
	tt: document.createElement("span"),
	link: window.location.href
};

copy._.onclick = () => {
	navigator.clipboard.writeText(copy.link);
	console.log("📋Added to clipboard:", copy.link);
	alert("Copied link: " + copy.link);
};

copy._.className = "tooltip";
copy.btn.innerHTML = "📋";
[copy.tt.className, copy.tt.innerHTML] = ["tooltiptext", "Copy Link (Ctrl+C)"];

copy.btn.appendChild(copy.tt);
copy._.appendChild(copy.btn);