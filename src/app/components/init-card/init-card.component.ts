import {Component, Input, OnInit} from "@angular/core";
import {CourseData} from "src/app/models/course-data";
import {ApiHandlerService} from "src/app/services/api-handler.service";
import {StoreService} from "src/app/services/store.service";

@Component({
	selector: "app-init-card",
	templateUrl: "./init-card.component.html",
	styleUrls: ["./init-card.component.scss"],
})
export class InitCardComponent implements OnInit {
	// @Input() courseData:CourseData = { name: "NULL", hasData: false, };
	courseData: CourseData = {name: "NULL", hasData: false}; // basic data for a singular course
	@Input() idx = -1;
   fetched = false;
   displayInfo = false;

	constructor(private Store: StoreService, private apiHandler: ApiHandlerService) {}

	ngOnInit(): void {
		// console.log(this.Store.courseData);
		this.courseData = this.Store.courseData.courses[this.idx];
	}

	requestLoad(id: any, from?: string, callback?: any) {
      id = parseInt(id);
      if (from != "select") {
         document.querySelector(`.load-${this.idx}`)?.classList.add("clocking");
      } else {
         
      }
		this.courseData.data = this.apiHandler.loadBasicInfo(id, from == "select" ? false : true).then(
         (data) => {
            // console.log(`Will cache data:`);
            // console.log(data.data);
            document.querySelector(`.load-${this.idx}`)?.classList.remove("clocking");
				this.Store.cacheData("course-" + this.Store.courseData.courses[id].id, data.data);
				this.Store.courses[this.Store.courseData.courses[id].id] = data.data;
				this.courseData.data = data.data;
				this.fetched = true;
            if (from == "select") {
               this.Store.setActive(id);
               callback();
            } else {
               this.displayInfo = true;
               document.querySelector(`.card-${this.idx}`)?.classList.remove("no-info");
               document.querySelector(`.card-${this.idx}`)?.classList.add("has-info");
            }
			},
			() => {
				console.error("Promise rejected");
			}
		);
	}

   select(id: any) {
      // console.log(`initcard select`, id);
      document.querySelector(`.select-${this.idx}`)?.classList.add("clocking");
      id = parseInt(id);
      this.Store.activeCourse = this.Store.courseData.courses[id].id;
      this.requestLoad(id, "select", () => {
         // console.log(`select callback triggered`);
         document.querySelector(`.select-${this.idx}`)?.classList.remove("clocking");
         document.querySelector(".root-wrap")?.scroll({
				top: 0,
				left: 0,
				behavior: "smooth",
			});
			// document.querySelector(".scorecard").style.animation = "0.6s slidein ease-out forwards";
         // document.querySelector(".scorecard").style.animationDelay = "0.5s";
         document.querySelector(".scorecard")?.setAttribute("style", "animation: 0.6s slidein ease-out forwards; animation-delay: 0.5s");
			document.querySelector(`.select-${this.idx}`)?.classList.remove("clocking");
			for (let a = 0; a < document.querySelectorAll(".card").length; a++) {
				// document.querySelectorAll(".card")[a].style.animation = "0.6s slideout cubic-bezier(.54,-0.06,.6,-0.34) forwards";
            // document.querySelectorAll(".card")[a].style.animationDelay = 0.083 + 0.08 * a + "s";
            document.querySelectorAll(".card")[a].setAttribute("style", `animation: 0.6s slideout cubic-bezier(0.54, -0.06, 0.6, -0.34) forwards; animation-delay: ${(0.083 + (0.08*a))}s`);
         }
      });
      // console.log("Active course is");
      // console.log(this.Store.activeCourse);
      // console.log("All course data is");
      // console.log(this.Store.courses);
	}
}
