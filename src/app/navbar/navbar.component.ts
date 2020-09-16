import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: any;
  showLogin: boolean;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("userDetails"));
    console.log("login useerr",this.user);
    if( this.user == null || this.user == undefined) {
      this.showLogin = false;
    } else {
      this.showLogin = true;
    }
  }

  logout() {
    this.showLogin = false;
    this.router.navigateByUrl("/login");
    localStorage.clear();
  }

}
