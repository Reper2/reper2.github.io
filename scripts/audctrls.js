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

const audctrls = {
	_: document.getElementById("audctrls"),
	mus: document.getElementById("music"),
	btn: {
		_: [],
		id: ["audctrlBtn_show", "audctrlBtn_hide"],
		disp: ["none", "block"],
		name: ["🎵🎛️", "🚫🎵🎛️"],
		log: ["🎵🎛️Audio controls are now visible.", "🚫Audio controls are now hidden."],
	},
	tooltip: {
		_: [],
		class: [],
		name: ["Show Audio Controls (Alt+S)", "Hide Audio Controls (Alt+H)"]
	}
};

/**
 * @param n - Number to be flipped, either 0 or 1.
 * @returns 1 if 0
 * @returns 0 if 1
*/
function flip(n) {
	if (n == 0) return 1;
	if (n == 1) return 0;
}

for (let i = 0; i < audctrls.btn.name.length; i++) {
	audctrls.btn._.push(document.createElement("button"));
	audctrls.btn._[i].id = audctrls.btn.id[i];
	audctrls.btn._[i].style.display = audctrls.btn.disp[flip(i)];
	audctrls.btn._[i].innerHTML = audctrls.btn.name[i];

	audctrls.tooltip._.push(document.createElement("span"));
	audctrls.tooltip.class.push("tooltiptext");
	audctrls.tooltip._[i].className = audctrls.tooltip.class[i];
	audctrls.tooltip._[i].innerHTML = audctrls.tooltip.name[i];
}

audctrls._.className = "tooltip";
audctrls.btn._[0].onclick = () => {
	audctrls.mus.style.display = audctrls.btn.disp[1];
	audctrls.btn._[0].style.display = audctrls.btn.disp[0];
	audctrls.btn._[1].style.display = audctrls.btn.disp[1];
	console.log(audctrls.btn.log[0]);
};
audctrls.btn._[1].onclick = () => {
	audctrls.mus.style.display = audctrls.btn.disp[0];
	audctrls.btn._[0].style.display = audctrls.btn.disp[1];
	audctrls.btn._[1].style.display = audctrls.btn.disp[0];
	console.log(audctrls.btn.log[1]);
};

for (let i = 0; i < audctrls.btn.name.length; i++) {
	audctrls.btn._[i].appendChild(audctrls.tooltip._[i]);
	audctrls._.appendChild(audctrls.btn._[i]);
}