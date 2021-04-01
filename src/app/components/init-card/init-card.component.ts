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
	courseData: CourseData = {name: "NULL", hasData: false};
	@Input() idx = -1;
	fetched = false;

	constructor(private Store: StoreService, private apiHandler: ApiHandlerService) {}

	ngOnInit(): void {
		// console.log(this.idx);
		console.log(this.Store.courseData);
		this.courseData = this.Store.courseData.courses[this.idx];
	}

	requestLoad(id: any) {
		id = parseInt(id);
      console.log(id);
      // this.courseData = await this.apiHandler.loadBasicInfo(id);
      // console.log("After");
      
		this.courseData.data = this.apiHandler.loadBasicInfo(id).then(
         (data) => {
            this.Store.cacheData("course-" + this.Store.courseData.courses[id].id, data.data);
            this.Store.courses[this.Store.courseData.courses[id].id] = data.data;
            console.log("Recieved new data:");
            console.log(data);
            
            this.courseData.data = data.data;
				this.fetched = true;
				document.querySelector(`.card-${this.idx}`)?.classList.remove("no-info");
				document.querySelector(`.card-${this.idx}`)?.classList.add("has-info");
			},
			() => {
				console.error("Promise rejected");
			}
		);
	}

	select(id: any) {
		id = parseInt(id);
	}
}
