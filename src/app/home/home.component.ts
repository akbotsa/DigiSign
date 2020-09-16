import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;
  firstName: any;

  constructor() { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("userDetails"));
    // this.firstName = this.user.FirstName;
    console.log("user----",this.user)
  }

}
