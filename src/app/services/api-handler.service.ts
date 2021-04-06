import {Injectable} from "@angular/core";
import {StoreService} from "./store.service";
import {CardHandlerService as Cards} from "./card-handler.service";
// import { LoadPageComponent } from "../components/load-page/load-page.component";

@Injectable({
	providedIn: "root",
})
export class ApiHandlerService {
	url = "https://golf-courses-api.herokuapp.com/courses";
	xhr = new XMLHttpRequest();
	cxhr = new XMLHttpRequest();

	private retrievalAttempts = 3;

	constructor(private Store: StoreService) {}

	public grabCourses(callback: any, isSavedData = false) {
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
			// console.log("No cache data");
			this.xhr.open("GET", this.url, true);
			this.xhr.responseType = "text";
			this.xhr.send();
			this.xhr.onload = () => {
				if (this.xhr.status == 200) {
					this.Store.courseData = JSON.parse(this.xhr.responseText);
					this.Store.cacheData("courses", this.Store.courseData);
					// Cards.setCards();
					callback();
					// Add options to the select input for persistent course
					for (let a = 0; a < this.Store.courseData.courses.length; a++) {
						let newOption = document.createElement("OPTION");
						//  document.querySelector(".persistentCourse").appendChild(newOption);
						newOption.setAttribute("value", (a as unknown) as string);
						newOption.innerText = this.Store.courseData.courses[a].name;
					}
				}
			};
			// If there is data cached (user has not left the session), get that instead of sending another request. Reduces network usage
		} else {
			// console.log("Found cache data");
			this.Store.courseData = JSON.parse(sessionStorage.getItem("courses") || "");
			for (let a = 0; a < this.Store.courseData.courses.length; a++) {
				let toGet = "";
				if (this.Store.courseData.courses[a].id) {
					toGet = "course-" + this.Store.courseData.courses[a].id;
            }
            if (sessionStorage.getItem(toGet) == undefined) {
               sessionStorage.removeItem(toGet);
            }
				let lookup = JSON.parse(sessionStorage.getItem(toGet) || "null");
				if (lookup != null) {
					this.Store.courses[this.Store.courseData.courses[a].id] = lookup;
				}
			}
			// Cards.setCards();
			callback();
			// Add options to the select input for persistent course
			for (let a = 0; a < this.Store.courseData.courses.length; a++) {
				let newOption = document.createElement("OPTION");
				//   document.querySelector(".persistentCourse").appendChild(newOption);
				newOption.setAttribute("value", (a as unknown) as string);
				newOption.innerText = this.Store.courseData.courses[a].name;
			}
		}
		// console.log(this.Store.courses);
		// console.log(this.Store.courseData);
	}

   async loadBasicInfo(id: any, display = true): Promise<any> {
      // console.log("loadBasicInfo called");
		id = parseInt(id);
      let basic;
      if (sessionStorage.getItem(`course-${this.Store.courseData.courses[id].id}`)) {
         // console.log("Returning a cached dataset from id",id);
         return new Promise((resolve, reject) => {
            // console.log(`Returning ${this.Store.courseData.courses[id].id} from cached data.`);
            // console.log(JSON.parse(sessionStorage.getItem(`course-${this.Store.courseData.courses[id].id}`) || "null"));
            let r = { data: JSON.parse(sessionStorage.getItem(`course-${this.Store.courseData.courses[id].id}`) || "null") };
            resolve(r);
         });
      }
      // console.log("Fetching non-cached dataset");
		let apiurl: string = this.url + "/" + this.Store.courseData.courses[id].id;
		this.cxhr.open("GET", apiurl, true);
		this.cxhr.responseType = "text";
		this.cxhr.send();
		return new Promise((resolve, reject) => {
			this.cxhr.onload = () => {
				if (this.cxhr.status == 200) {
					basic = JSON.parse(this.cxhr.responseText);
					// console.log("Recieved course data... ", basic);
					// this.Store.cacheData("course-" + this.Store.courseData.courses[id].id, basic);
					// this.Store.courses[this.Store.courseData.courses[id].id] = basic;

					// will show info on the selection card. false when user selects a course without loading info first, reduces jank
					if (display) {
						// console.log("Returning", this.Store.courseData[id]);
					} else {
                  this.Store.activeCourse = this.Store.courseData.courses[id].id;
                  // console.log(`store activecourse is`, this.Store.activeCourse);
                  // this.Store.activeCourse = JSON.parse(sessionStorage.getItem("course-" + this.Store.courseData.courses[id].id) || "");
					}
					resolve(basic);
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
		});
	}

	selectCourse(id: any) {
		id = parseInt(id);
      if (!sessionStorage.getItem("course-" + this.Store.courseData.courses[id].id)) {
         // console.log("Loading not from cache");
         let loader = this.loadBasicInfo(id, false);
         // loader.then()
      } else {
         // console.log("Retrieving from cache");
			this.Store.activeCourse = JSON.parse(sessionStorage.getItem("course-" + this.Store.courseData.courses[id].id) || "");
			// fillCard(id);
		}
	}
}
