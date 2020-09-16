import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder , private router : Router,private services: ServicesService) { }

  ngOnInit(): void {
    this.loadLoginForm();
  }

  loadLoginForm(){
    this.loginForm = this.fb.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
    })
  }


  login(){
    console.log("form values--",this.loginForm.value);

    let loginObj = {
      UserName: this.loginForm.value.email,
      Password: this.loginForm.value.password,
      DeviceToken: "",
      DeviceType: ""
    }
    this.services.login(loginObj).subscribe((resp)=> {
      if(resp.StatusCode == 200) {
        localStorage.setItem("userDetails",JSON.stringify(resp.Data.loginDetails));
        this.services.loginHideShow.emit(true);
        alert(`${resp.Message}`);
        this.router.navigateByUrl('home')
      } else {
        alert(`${resp.Message}`)
      }
      console.log("Login resp=---",resp.data);
    })
    
  }
}
