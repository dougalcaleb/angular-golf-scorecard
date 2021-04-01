import {Component, OnInit} from "@angular/core";
import {CourseData} from "src/app/models/course-data";
import {ApiHandlerService} from "src/app/services/api-handler.service";
import { StoreService } from "src/app/services/store.service";

@Component({
	selector: "app-load-page",
	templateUrl: "./load-page.component.html",
	styleUrls: ["./load-page.component.scss"],
})
export class LoadPageComponent implements OnInit {
	fetchedData = false;

	initCards: CourseData[] = [];

   constructor(
      private apiHandler: ApiHandlerService,
      private Store: StoreService
   ) { }

	ngOnInit(): void {
      this.apiHandler.grabCourses(() => {
         this.initCards = this.Store.courseData.courses;
         this.fetchedData = true;
      });
   }
}
