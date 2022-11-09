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

const back = {
	_: document.getElementById("back"),
	btn: document.createElement("img")
};

back._.onclick = () => {
	if (window.history.length > 1 && document.referrer.startsWith(window.location.origin)) {
		// eslint-disable-next-line semi
		if (window.location.href.includes("#") || window.location.href.includes("?")) {
			console.log("⚙️url contained a hash (#) or parameter (?), window.location.href='../' was used rather than window.history.back() to skip all the hashes or url parameters.");
			window.location.href = "../";
		}
		else window.history.back();
	}
	else window.location.href = "../../";
};
[back.btn.src, back.btn.title] = ["/assets/back.png", "Back (Alt+◁)"];
back._.appendChild(back.btn);