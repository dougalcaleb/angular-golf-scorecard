import {Component, OnInit} from "@angular/core";
import {StoreService} from "src/app/services/store.service";

@Component({
	selector: "app-scorecard-page",
	templateUrl: "./scorecard-page.component.html",
	styleUrls: ["./scorecard-page.component.scss"],
})
export class ScorecardPageComponent implements OnInit {
   teeCount = 0;

	constructor(private Store: StoreService) {}

   ngOnInit(): void {
   //    if (this.Store.activeCourse.data.holes[0].teeBoxes[this.Store.activeCourse.data.holes[1].teeBoxes.length-1].teeType === "auto change location") {
   //       this.teeCount = this.Store.activeCourse.data.holes[0].teeBoxes.length-1;
   //   } else {
   //       this.teeCount = this.Store.activeCourse.data.holes[0].teeBoxes.length;
   //   }
   //    // document.querySelector(".tee-head").style.height = ((cellHeight * teeCount) + cellHeightUnits);
   //    document.querySelector(".tee-head")?.setAttribute("style", `${(5 * this.teeCount)}vh`);
   }
}
