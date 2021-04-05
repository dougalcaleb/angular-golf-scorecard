import {Injectable} from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class StoreService {
	public courses: any[] = [];
	public courseData: any;
	public teeCount: number = 0;
	public activeCourse: any;
	public players: any = {
		"0": {
			name: "",
			scores: [],
			inScore: 0,
			outScore: 0,
			totalScore: 0,
			hcp: null,
			net: 0,
		},
		"1": {
			name: "",
			scores: [],
			inScore: 0,
			outScore: 0,
			totalScore: 0,
			hcp: null,
			net: 0,
		},
		"2": {
			name: "",
			scores: [],
			inScore: 0,
			outScore: 0,
			totalScore: 0,
			hcp: null,
			net: 0,
		},
		"3": {
			name: "",
			scores: [],
			inScore: 0,
			outScore: 0,
			totalScore: 0,
			hcp: null,
			net: 0,
		},
   };
   private cb: any[] = [];

	constructor() {}

	public cacheData(name: string, data: any) {
		data = JSON.stringify(data);
		sessionStorage.setItem(name, data);
		if (localStorage.getItem("golf-scorecard-settings")) {
			let settings = JSON.parse(localStorage.getItem("golf-scorecard-settings") || "");
			if (settings.tg_preserve) {
				localStorage.setItem(name, data);
			}
		}
   }
   
   public setActive(id: any) {
      this.cb.forEach(c => {
         c();
      });
   }

   public subSelect(callback: any) {
      this.cb.push(callback);
   }
}
