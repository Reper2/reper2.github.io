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

$(document).keydown((k) => {
	if (k.ctrlKey && k.key === "/") window.location.href = "/keybinds";
	if (k.altKey && k.key === "s") $("#audctrlBtn_show").trigger("click");
	if (k.altKey && k.key === "h") $("#audctrlBtn_hide").trigger("click");
	if (k.ctrlKey && k.key === "i") $("#install").trigger("click");
	if (k.altKey && k.key == "u") $("#urlUpdate").trigger("click");
	if (k.ctrlKey && k.key === "c") $("#copy").trigger("click");
	if (k.key === "l") window.open("https://github.com/Reper2/reper2.github.io/blob/master/LICENSE");
	if (k.key === "Enter") $("#optSet").trigger("click");
	if (k.key === "Backspace") $("#optReset").trigger("click");
	if (k.key === "?") $("#optRand").trigger("click");
	if (k.key === "x") window.open("/scripts/kb.js");
});