import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-load-page',
  templateUrl: './load-page.component.html',
  styleUrls: ['./load-page.component.scss']
})
export class LoadPageComponent implements OnInit {

   //! issue here
   initCards: any[] = [
      {
         name: "First Course",
         hasData: false,
      },
      {
         name: "Course 2.0",
         hasData: false,
      },
      {
         name: "Three",
         hasData: false,
      },
      {
         name: "4",
         hasData: false,
      }
   ]

  constructor() { }

  ngOnInit(): void {
  }

}
