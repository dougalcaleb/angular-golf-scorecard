import {Injectable} from "@angular/core";
import {StoreService as Store} from "./store.service";
import {CardHandlerService as Cards} from "./card-handler.service";

@Injectable({
	providedIn: "root",
})
export class ApiHandlerService {
	url: string = "https://golf-courses-api.herokuapp.com/courses";
	xhr = new XMLHttpRequest();
	cxhr = new XMLHttpRequest();

	private retrievalAttempts = 3;

	constructor() {}

	grabCourses(isSavedData = false) {
		// If the user has enabled persistent cache, look for pre-loaded data from localStorage and place it in sessionStorage for use in this session
		if (isSavedData && localStorage.getItem("courses")) {
			sessionStorage.setItem("courses", localStorage.getItem("courses") || "");
			let setCourseData = JSON.parse(sessionStorage.getItem("courses") || "");
			for (let a = 0; a < setCourseData.courses.length; a++) {
				let lookup = JSON.parse(localStorage.getItem("course-" + setCourseData.courses[a].id) || "");
				if (lookup) {
					sessionStorage.setItem("course-" + setCourseData.courses[a].id, localStorage.getItem("course-" + setCourseData.courses[a].id) || "");
				}
			}
		}
		// The user has not loaded this site in this session, so send a request for data
		if (!sessionStorage.getItem("courses")) {
			this.xhr.open("GET", this.url, true);
			this.xhr.responseType = "text";
			this.xhr.send();
			this.xhr.onload = () => {
				if (this.xhr.status == 200) {
					Store.courseData = JSON.parse(this.xhr.responseText);
					Store.cacheData("courses", Store.courseData);
					Cards.setCards();
					// Add options to the select input for persistent course
					for (let a = 0; a < Store.courseData.courses.length; a++) {
						let newOption = document.createElement("OPTION");
						//  document.querySelector(".persistentCourse").appendChild(newOption);
						newOption.setAttribute("value", (a as unknown) as string);
						newOption.innerText = Store.courseData.courses[a].name;
					}
				}
			};
			// If there is data cached (user has not left the session), get that instead of sending another request. Reduces network usage
		} else {
			Store.courseData = JSON.parse(sessionStorage.getItem("courses") || "");
			for (let a = 0; a < Store.courseData.courses.length; a++) {
				let lookup = JSON.parse(sessionStorage.getItem("course-" + Store.courseData.courses[a].id) || "");
				if (lookup) {
					Store.courses[Store.courseData.courses[a].id] = lookup;
				}
			}
			Cards.setCards();
			// Add options to the select input for persistent course
			for (let a = 0; a < Store.courseData.courses.length; a++) {
				let newOption = document.createElement("OPTION");
				//   document.querySelector(".persistentCourse").appendChild(newOption);
				newOption.setAttribute("value", (a as unknown) as string);
				newOption.innerText = Store.courseData.courses[a].name;
			}
		}
	}

	loadBasicInfo(id: any, display = true) {
		let basic;
		id = parseInt(id);
		let apiurl: string = this.url + "/" + Store.courseData.courses[id].id;
		this.cxhr.open("GET", apiurl, true);
		this.cxhr.responseType = "text";
		this.cxhr.send();
		this.cxhr.onload = () => {
			if (this.cxhr.status == 200) {
				basic = JSON.parse(this.cxhr.responseText);
				// console.log("Recieved course data... ",basic);
				Store.cacheData("course-" + Store.courseData.courses[id].id, basic);
				Store.courses[Store.courseData.courses[id].id] = basic;

				// will show info on the selection card. false when user selects a course without loading info first, reduces jank
				if (display) {
					// document.querySelector(".card"+id).innerHTML = `
					// <div class="card-img card-img-${id}"></div>
					// <div class="card-title">${courseData.courses[id].name}</div>
					// <div class="card-info">
					//     <span class="emp">Holes:</span> ${courses[courseData.courses[id].id].data.holeCount}<br/>
					//     <span class="emp">Status:</span> ${courses[courseData.courses[id].id].data.status}<br/>
					// </div>
					// <div class="card-desc">
					//     <span class="emp">Address:</span><br/>${courses[courseData.courses[id].id].data.addr1}, ${courses[courseData.courses[id].id].data.city}, ${courses[courseData.courses[id].id].data.stateOrProvince}<br/>
					//     <span class="emp">Website:</span><br/>${courses[courseData.courses[id].id].data.website}
					// </div>
					// <div class="select-course select-${id}">Select Course</div>`;
					// document.querySelector(`.card-img-${id}`).style.background = `url(${courseData.courses[id].image})`;
					// document.querySelector(`.card-img-${id}`).style.backgroundSize = "cover";
					// document.querySelector(`.card-img-${id}`).style.backgroundPosition = "center center";
					// document.querySelector(".select-"+id).addEventListener("click", function() {
					//     selectCourse(this.classList[1].split("-")[1]);
					// });
					// setTimeout(function(){
					//     document.querySelector(".card"+id).classList.add("has-info");
					// }, 100);
				} else {
					Store.activeCourse = "course-" + Store.courseData.courses[id].id;
					Cards.fillCard(id);
				}
				this.retrievalAttempts = 3;
			} else {
				console.warn("Retrieval failed, retrying");
				if (this.retrievalAttempts > 0) {
					this.loadBasicInfo(id, display);
					this.retrievalAttempts--;
				} else {
					console.warn("Retried 3 times and failed. Try refreshing the page.");
				}
			}
		};
	}
}
