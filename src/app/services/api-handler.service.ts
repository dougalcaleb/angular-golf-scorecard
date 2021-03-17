import { Injectable } from "@angular/core";
import { StoreService as Store } from "./store.service";
import { OrchestratorService as Orchestrator } from "./orchestrator.service";

@Injectable({
	providedIn: "root",
})
export class ApiHandlerService {

   url: string = "https://golf-courses-api.herokuapp.com/courses";
   xhr = new XMLHttpRequest();
   cxhr = new XMLHttpRequest();

   constructor() { }
   
   grabCourses(isSavedData = false) {
      // If the user has enabled persistent cache, look for pre-loaded data from localStorage and place it in sessionStorage for use in this session
      if (isSavedData && localStorage.getItem("courses")) {
          sessionStorage.setItem("courses", localStorage.getItem("courses") || "");
          let setCourseData = JSON.parse(sessionStorage.getItem("courses") || "");
          for (let a = 0; a < setCourseData.courses.length; a++) {
              let lookup = JSON.parse(localStorage.getItem("course-"+setCourseData.courses[a].id) || "");
              if (lookup) {
                  sessionStorage.setItem("course-"+setCourseData.courses[a].id, localStorage.getItem("course-"+setCourseData.courses[a].id) || "");
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
                  Orchestrator.setCards();
                  // Add options to the select input for persistent course
                  for (let a = 0; a < Store.courseData.courses.length; a++) {
                      let newOption = document.createElement("OPTION");
                     //  document.querySelector(".persistentCourse").appendChild(newOption);
                      newOption.setAttribute("value", a as unknown as string);
                      newOption.innerText = Store.courseData.courses[a].name;
                  }
              }
          };
      // If there is data cached (user has not left the session), get that instead of sending another request. Reduces network usage
      } else {
          Store.courseData = JSON.parse(sessionStorage.getItem("courses") || "");
          for (let a = 0; a < Store.courseData.courses.length; a++) {
              let lookup = JSON.parse(sessionStorage.getItem("course-"+Store.courseData.courses[a].id) || "");
              if (lookup) {
                  Store.courses[Store.courseData.courses[a].id] = lookup;
              }
          }
          Orchestrator.setCards();
          // Add options to the select input for persistent course
          for (let a = 0; a < Store.courseData.courses.length; a++) {
              let newOption = document.createElement("OPTION");
            //   document.querySelector(".persistentCourse").appendChild(newOption);
              newOption.setAttribute("value", a as unknown as string);
              newOption.innerText = Store.courseData.courses[a].name;
          }
      }
  }
}
