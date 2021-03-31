import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-init-card',
  templateUrl: './init-card.component.html',
  styleUrls: ['./init-card.component.scss']
})
export class InitCardComponent implements OnInit {

   @Input() courseData = { name: "NULL" };
   @Input() idx = -1;

  constructor() { }

  ngOnInit(): void {
  }

}
