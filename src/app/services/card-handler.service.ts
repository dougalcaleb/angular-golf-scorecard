import {Injectable} from "@angular/core";
import {StoreService as Store} from "./store.service";

@Injectable({
	providedIn: "root",
})
export class CardHandlerService {
	constructor() {}

	static setCards() {
		for (let a = 0; a < Store.courseData.courses.length; a++) {
			let newCard = document.createElement("DIV");
			newCard.classList.add(`card${a}`, "card", "no-info");
			let ihtml = `<div class="card-img card-img-${a}"></div> <div class="card-title">${Store.courseData.courses[a].name}</div>`;

			if (!sessionStorage.getItem("course-" + Store.courseData.courses[a].id)) {
				ihtml += `<div class="load-desc load-${a}">Load Course Info</div>`;
			} else {
				newCard.classList.add("has-info");
				ihtml += `<div class="card-info"><span class="emp">Holes:</span> ${
					Store.courses[Store.courseData.courses[a].id].data.holeCount
				}<br/><span class="emp">Status:</span> ${
					Store.courses[Store.courseData.courses[a].id].data.status
				}<br/></div><div class="card-desc"><span class="emp">Address:</span><br/>${Store.courses[Store.courseData.courses[a].id].data.addr1}, ${
					Store.courses[Store.courseData.courses[a].id].data.city
				}, ${Store.courses[Store.courseData.courses[a].id].data.stateOrProvince}<br/><span class="emp">Website:</span><br/>${
					Store.courses[Store.courseData.courses[a].id].data.website
				}</div>`;
			}
			ihtml += `<div class="select-course select-${a}">Select Course</div>`;
			newCard.innerHTML = ihtml;

			newCard.style.animationDelay = 0.07 + 0.07 * a + "s";
			// document.querySelector(".card-wrap").appendChild(newCard);
			// document.querySelector(`.card-img-${a}`).style.background = `url(${courseData.courses[a].image})`;
			// document.querySelector(`.card-img-${a}`).style.backgroundSize = "cover";
			// document.querySelector(`.card-img-${a}`).style.backgroundPosition = "center center";

			if (!sessionStorage.getItem("course-" + Store.courseData.courses[a].id)) {
				// document.querySelector(".load-" + a).addEventListener("click", function () {
				// 	this.classList.add("clocking");
				// 	loadBasicInfo(this.classList[1].split("-")[1]);
				// });
			}
			// document.querySelector(".select-" + a).addEventListener("click", function () {
			// 	this.classList.add("clocking");
			// 	selectCourse(this.classList[1].split("-")[1]);
			// });
		}
	}

	static fillCard(id: any) {
		Store.activeCourse = JSON.parse(sessionStorage.getItem(Store.activeCourse) || "");
		// generateScorecard();
		let totals = [];
		let gTotals = [];
		let parTotal = 0;
		let parGTotal = 0;
		for (let pre = 0; pre < Store.teeCount; pre++) {
			totals.push(0);
			gTotals.push(0);
		}
		for (let a = 0; a < 9; a++) {
			for (let aa = 0; aa < Store.teeCount; aa++) {
				//   document.querySelector(".data-col-"+a).querySelector(".r"+(aa+1)).innerText = activeCourse.data.holes[a].teeBoxes[aa].yards;
				totals[aa] += Store.activeCourse.data.holes[a].teeBoxes[aa].yards;
			}

			//  document.querySelector(".data-col-"+a).querySelector(".r9").innerText = activeCourse.data.holes[a].teeBoxes[0].par;
			//  document.querySelector(".data-col-"+a).querySelector(".r10").innerText = activeCourse.data.holes[a].teeBoxes[0].hcp;

			parTotal += Store.activeCourse.data.holes[a].teeBoxes[0].par;
		}

		parGTotal += parTotal;

		for (let b = 0; b < Store.teeCount; b++) {
			//  document.querySelector(".data-col-OUT").querySelector(".r"+(b+1)).innerText = totals[b];
			gTotals[b] += totals[b];
		}

		// document.querySelector(".data-col-OUT").querySelector(".r"+(5+teeCount)).innerText = parTotal;

		for (let c = 0; c < totals.length; c++) {
			totals[c] = 0;
		}

		parTotal = 0;

		for (let d = 0; d < 9; d++) {
			for (let da = 0; da < Store.teeCount; da++) {
				//   document.querySelector(".data-col-"+(d+9)).querySelector(".r"+(da+1)).innerText = activeCourse.data.holes[d+9].teeBoxes[da].yards;
				totals[da] += Store.activeCourse.data.holes[d + 9].teeBoxes[da].yards;
			}

			//  document.querySelector(".data-col-"+(d+9)).querySelector(".r9").innerText = activeCourse.data.holes[d+9].teeBoxes[0].par;
			//  document.querySelector(".data-col-"+(d+9)).querySelector(".r10").innerText = activeCourse.data.holes[d+9].teeBoxes[0].hcp;

			parTotal += Store.activeCourse.data.holes[d].teeBoxes[0].par;
		}

		parGTotal += parTotal;

		for (let e = 0; e < Store.teeCount; e++) {
			//  document.querySelector(".data-col-IN").querySelector(".r"+(e+1)).innerText = totals[e];
			gTotals[e] += totals[e];
			//  document.querySelector(".data-col-TOT").querySelector(".r"+(e+1)).innerText = gTotals[e];
		}
		// document.querySelector(".data-col-IN").querySelector(".r"+(5+teeCount)).innerText = parTotal;
		// document.querySelector(".data-col-TOT").querySelector(".r"+(5+teeCount)).innerText = parGTotal;

		// document.querySelector(".name").innerText = activeCourse.data.name;

		setTimeout(() => {
			window.scroll({
				top: 0,
				left: 0,
				behavior: "smooth",
			});
			// document.querySelector(".card-wrap-title").style.animation = "0.6s slideout cubic-bezier(.54,-0.06,.6,-0.34) forwards";
			//  document.querySelector(".scorecard").style.animation = "0.6s slidein ease-out forwards";
			//  document.querySelector(".scorecard").style.animationDelay = "0.5s";
			//  document.querySelector(".select-"+id).classList.remove("clocking");
			//  for (let a = 0; a < document.querySelectorAll(".card").length; a++) {
			//      document.querySelectorAll(".card")[a].style.animation = "0.6s slideout cubic-bezier(.54,-0.06,.6,-0.34) forwards";
			//      document.querySelectorAll(".card")[a].style.animationDelay = 0.083+(0.08*a)+"s";
			//  }
		}, 420);
	}
}
