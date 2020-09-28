import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicesService } from 'src/app/services/services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  showForgetPasswordForm: boolean= true;
  showmessage: boolean = false;
  forgetPasswordForm : FormGroup

  constructor(private fb: FormBuilder, private router: Router, private services: ServicesService, private toastr: ToastrService) {
    this.forgetPasswordForm = this.fb.group({
      emailId: ["",Validators.required]
    })
   }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem("userDetails"));
    if (user) {
      this.router.navigateByUrl('/home')
    }

    this.loadLoginForm();

  }

  loadLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }



  login() {

    let loginObj = {
      UserName: this.loginForm.value.email,
      Password: this.loginForm.value.password,
      DeviceToken: "",
      DeviceType: ""
    }
    this.services.login(loginObj).subscribe((resp) => {
      if (resp.StatusCode == 200) {
        localStorage.setItem("userDetails", JSON.stringify(resp.Data.loginDetails));
        this.services.loginHideShow.emit(true);
        this.toastr.success(`${resp.Message}`, 'Success:')
        //alert(`${resp.Message}`);
        this.router.navigateByUrl('document')
      } else {
        this.toastr.error(`${resp.Message}`, 'Failed:')
        // alert(`${resp.Message}`)
      }
    })

  }
  forgotPassword(){
    this.showForgetPasswordForm = false
  }

  forgotPasswordSubmit(){
    // this.showForgetPasswordForm = true
    this.showmessage = true
  }
}
