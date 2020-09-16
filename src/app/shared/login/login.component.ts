import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder , private router : Router) { }

  ngOnInit(): void {
    this.loadLoginForm();
  }

  loadLoginForm(){
    this.loginForm = this.fb.group({
      email: ['',Validators.required]
    })
  }


  login(){
    this.router.navigateByUrl('home')

  }
}
