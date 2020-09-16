import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: any;
  showLogin: boolean;

  constructor(private router: Router,private services: ServicesService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("userDetails"));
    this.services.loginHideShow.subscribe((resp) => {
      if(resp == true) {
        this.showLogin = true;
      }
    })
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
