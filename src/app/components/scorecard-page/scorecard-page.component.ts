import {COMPILER_OPTIONS, Component, OnInit} from "@angular/core";
import {StoreService} from "src/app/services/store.service";

@Component({
	selector: "app-scorecard-page",
	templateUrl: "./scorecard-page.component.html",
	styleUrls: ["./scorecard-page.component.scss"],
})
export class ScorecardPageComponent implements OnInit {
	activeCourseData: any = null;
	teeCount = 0;
	teeCountArr: any;
	colors: any = [];
	muted: any = [];
	validKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
	activeInput = "";
	totals: any = {
		par: {
			in: 0,
			out: 0,
			total: 0,
		},
		tees: {
			in: [],
			out: [],
			total: [],
		},
   };
   colpos = 0;

	constructor(public Store: StoreService) {}

	ngOnInit(): void {
		this.Store.subSelect(() => {
			this.initialize();
		});
	}

	initialize() {
		this.Store.activeCourse = this.Store.courses[this.Store.activeCourse];
		this.activeCourseData = this.Store.activeCourse;
		// console.log(this.activeCourseData);

		this.colors = [];

		if (this.activeCourseData.holes[0].teeBoxes[this.activeCourseData.holes[1].teeBoxes.length - 1].teeType === "auto change location") {
			this.teeCount = this.activeCourseData.holes[0].teeBoxes.length - 1;
		} else {
			this.teeCount = this.activeCourseData.holes[0].teeBoxes.length;
		}
		// document.querySelector(".tee-head")?.style.height = ((cellHeight * teeCount) + cellHeightUnits);
		document.querySelector(".tee-head")?.setAttribute("style", `height: ${5 * this.teeCount}vh`);
		document.querySelector(".databody")?.setAttribute("style", `height: calc(5vh * ${this.teeCount + 7})`);
		document.querySelector(".scorecard-nav")?.setAttribute("style", `top: calc(5vh * ${this.teeCount + 7} + 10px)`);

		for (let a = 0; a < this.teeCount; a++) {
			this.colors.push(this.getDynamicColor(this.activeCourseData.holes[0].teeBoxes[a].teeHexColor) || "#ffffff");
		}

		for (let a = 0; a < this.teeCount; a++) {
			this.muted.push(this.getMutedColor(this.activeCourseData.holes[0].teeBoxes[a].teeHexColor) || "#ffffff");
		}

		for (let a = 0; a < 9; a++) {
			this.totals.par.out += this.activeCourseData.holes[a].teeBoxes[0].par;
			for (let b = 0; b < this.teeCount; b++) {
				if (!this.totals.tees.out[b]) {
					this.totals.tees.out[b] = 0;
				}
				this.totals.tees.out[b] += this.activeCourseData.holes[a].teeBoxes[b].yards;
			}
		}

		for (let a = 9; a < 18; a++) {
			this.totals.par.in += this.activeCourseData.holes[a].teeBoxes[0].par;
			for (let b = 0; b < this.teeCount; b++) {
				if (!this.totals.tees.in[b]) {
					this.totals.tees.in[b] = 0;
				}
				this.totals.tees.in[b] += this.activeCourseData.holes[a].teeBoxes[b].yards;
			}
		}

		for (let a = 0; a < this.teeCount; a++) {
			this.totals.tees.total[a] = this.totals.tees.in[a] + this.totals.tees.out[a];
		}

		this.totals.par.total = this.totals.par.in + this.totals.par.out;

		// console.log(this.colors);
	}

	getDynamicColor(hexcolor: any): string {
		if (hexcolor.substr(0, 1) == "#") {
			hexcolor = hexcolor.substr(1);
		}
		var r = parseInt(hexcolor.substr(0, 2), 16);
		var g = parseInt(hexcolor.substr(2, 2), 16);
		var b = parseInt(hexcolor.substr(4, 2), 16);
		var yiq = (r * 299 + g * 587 + b * 114) / 1000;
		return yiq >= 128 ? "black" : "white";
	}

	getMutedColor(hexcolor: any, muteAmount = 3): string {
		if (hexcolor.substr(0, 1) == "#") {
			hexcolor = hexcolor.substr(1);
		}
		var r = parseInt(hexcolor.substr(0, 2), 16);
		var g = parseInt(hexcolor.substr(2, 2), 16);
		var b = parseInt(hexcolor.substr(4, 2), 16);
		// let lowR = (r-muteAmount > 0) ? r-muteAmount : 0;
		// let lowG = (g-muteAmount > 0) ? g-muteAmount : 0;
		// let lowB = (b-muteAmount > 0) ? b-muteAmount : 0;

		let lowR = r - r / muteAmount;
		let lowG = g - g / muteAmount;
		let lowB = b - b / muteAmount;

		var darkrgb = `rgb(${lowR},${lowG},${lowB})`;
		return darkrgb;
	}

	handleInput(event: any) {
		if (event.target.value.length > 2 && !event.target.classList.contains("name-input")) {
			event.target.value = event.target.value.slice(0, 2);
		} else {
			this.activeInput = event.target.value;
		}
		if (event.target.value < 0) {
			event.target.value = null;
		}
	}

	handleBlur(event: any) {
		// console.log(this.activeInput);
		let inputId = event.target.classList[0].split("-");
		if (this.activeInput != "") {
			// console.log(inputId);
			if (event.target.classList.contains("name-input")) {
				this.updateScores(inputId[2], inputId[4]);
			} else {
				this.updateScores(inputId[1], inputId[3], event.target);
			}
			this.activeInput = "";
		}
	}

	handleKeyDown(event: any) {
		// console.log(this.activeInput);
		if (!this.validKeys.includes(event.key) && !event.target.classList.contains("name-input")) {
			// console.log("Preventing key", event.key);
			event.preventDefault();
		}
	}

	updateScores(pId: any, col: any, element?: any) {
		// pId = parseInt(pId);
		// let newScore = parseInt(this.activeInput);
		let newScore: any = this.activeInput;
		// console.log(`Value is`, newScore);
		// sets name, returns before setting other things
		if (col == "NAME") {
			// console.log("Column is name");
			for (let key in this.Store.players) {
				if (this.Store.players[key].name == newScore && key != pId && newScore != "") {
					// document.querySelector(".input-p-" + pId + "-c-" + col).value = null;
					// document.querySelector(".player" + pId)?.children[0]?.style.animation = "0.5s invalid";
					document.querySelector(".player" + pId)?.children[0]?.setAttribute("style", "animation: 0.5s invalid");
					setTimeout(() => {
						// document.querySelector(".player" + pId).children[0].style.animation = "";
						document.querySelector(".player" + pId)?.children[0]?.setAttribute("style", "animation: none");
					}, 300);
					return;
				}
			}
			this.Store.players[pId].name = newScore;
			// console.log("set name to: ", this.Store.players[pId].name);
			return;
		}
		// sets handicap
		if (col == "HCP") {
			//  newScore = parseInt(newScore);
			this.Store.players[pId].hcp = parseInt(newScore);
		}
		// console.log(`pid is`, pId);
		// sets scores
		if (newScore == null || newScore == "-" || newScore == "") {
			return;
		} else if (this.Store.players[pId].name == "") {
			// console.warn("Need a name");
			element.value = "";
			document.querySelector(".player" + pId)?.children[0].setAttribute("style", "animation: 0.5s invalid");
			setTimeout(() => {
				//  document.querySelector(".player" + pId).children[0].style.animation = "";
				document.querySelector(".player" + pId)?.children[0].setAttribute("style", "animation: none");
			}, 300);
			//  document.querySelector(".input-p-"+pId+"-c-"+col).value = null;
			return;
		} else if (col != "HCP") {
			//  newScore = parseInt(newScore);
			this.Store.players[pId].scores[col] = parseInt(newScore);
		}
		// updates all totals except net. fTotal = first 9 holes, sTotal = second 9, gTotal = grand total aka. all 18
		let fTotal = 0,
			sTotal = 0,
			gTotal = 0;
		for (let a = 0; a < this.Store.players[pId].scores.length; a++) {
			if (this.Store.players[pId].scores[a] && a < 9) {
				fTotal += this.Store.players[pId].scores[a];
				gTotal += this.Store.players[pId].scores[a];
			}
			if (this.Store.players[pId].scores[a] && a >= 9) {
				sTotal += this.Store.players[pId].scores[a];
				gTotal += this.Store.players[pId].scores[a];
			}
		}
		// update scorecard
		this.Store.players[pId].outScore = fTotal;
		this.Store.players[pId].inScore = sTotal;
		this.Store.players[pId].totalScore = fTotal + sTotal;
		this.Store.players[pId].net = gTotal - this.Store.players[pId].hcp;
		// document.querySelector(".data-col-OUT").children[teeCount+1+pId].innerText = fTotal;
		// document.querySelector(".data-col-IN").children[teeCount+1+pId].innerText = sTotal;
		// document.querySelector(".data-col-TOT").children[teeCount+1+pId].innerText = gTotal;
		// document.querySelector(".data-col-NET").children[teeCount+1+pId].innerText = players[pId].net;
		// if (players[pId].scores.length == 18 && players[pId].hcp) {
		//     let diff = parGTotal - players[pId].net;
		//     if (diff > 5) {
		//         message(`Congrats ${players[pId].name}!`, messageGood[Math.floor(Math.random()*messageGood.length)]);
		//     } else if (diff < -5) {
		//         message(`Good work, ${players[pId].name}.`,messageBad[Math.floor(Math.random()*messageBad.length)]);
		//     } else {
		//         message(`Good game, ${players[pId].name}`,messageNormal[Math.floor(Math.random()*messageNormal.length)]);
		//     }
		// }
	}

	navL() {
		if (this.colpos > 0) {
			this.colpos--;
			this.alignCols();
		}
	}

	navR() {
		if (this.colpos < 20) {
			this.colpos++;
			this.alignCols();
		}
	}

	// leverages scroll position to align columns to show 3 perfectly
	alignCols() {
		document.querySelector(".databody")?.scrollTo({
			top: 0,
			left: (this.colpos * window.innerWidth) / 4,
			behavior: "smooth",
		});
   }
   
   handleScroll(event:any) {
      this.colpos = Math.floor(event.target.scrollLeft / (window.innerWidth/(100/25)));
   }
}
