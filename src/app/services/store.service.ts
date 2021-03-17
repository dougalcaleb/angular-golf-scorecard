import {Injectable} from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class StoreService {
	static courses: any;
	static players: object = {
		0: {
			name: "",
			scores: [],
			inScore: 0,
			outScore: 0,
			totalScore: 0,
			hcp: null,
			net: 0,
		},
		1: {
			name: "",
			scores: [],
			inScore: 0,
			outScore: 0,
			totalScore: 0,
			hcp: null,
			net: 0,
		},
		2: {
			name: "",
			scores: [],
			inScore: 0,
			outScore: 0,
			totalScore: 0,
			hcp: null,
			net: 0,
		},
		3: {
			name: "",
			scores: [],
			inScore: 0,
			outScore: 0,
			totalScore: 0,
			hcp: null,
			net: 0,
		},
	};
	static courseData: any;

	constructor() {}

	static cacheData(name: string, data: any) {
		data = JSON.stringify(data);
		sessionStorage.setItem(name, data);
		let settings = JSON.parse(localStorage.getItem("settings") || "");
		if (settings.tg_preserve) {
			localStorage.setItem(name, data);
		}
	}
}
