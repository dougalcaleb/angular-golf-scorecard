import { Injectable } from "@angular/core";
import { StoreService as Store } from "./store.service";

@Injectable({
	providedIn: "root",
})
export class OrchestratorService {
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
}
