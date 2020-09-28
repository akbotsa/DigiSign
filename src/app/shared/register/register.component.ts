import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm : FormGroup;

  constructor(private fb: FormBuilder, private services: ServicesService, private route: Router ) { }

  ngOnInit(): void {
    
    const user = JSON.parse(localStorage.getItem("userDetails"));
    if(user){
      this.route.navigateByUrl('/home')
    }
    this.loadRegisterForm();
  }

  loadRegisterForm() {
    this.registerForm = this.fb.group({ 
      first_name: ['',Validators.required],
      last_name: ['',Validators.required],
      email: ['',Validators.required],
      password: ['',Validators.required],
      phone: ['',Validators.required],
      job_title: [''],
      // industry: ['',]
    })
    // console.log("registerForm",this.registerForm);
  }

  get r() { return this.registerForm.controls }

  register() {
    // console.log("regForm-----",this.registerForm.valid);
    if( this.registerForm.valid ) {
      // console.log("registerForm",this.registerForm);

      let regObj = {
        FirstName: this.registerForm.value.first_name,
        LastName:  this.registerForm.value.last_name,
        Email:  this.registerForm.value.email,
        DialingCode: "",
        Mobile: this.registerForm.value.phone,
        Password: this.registerForm.value.password,
        JobTitle: this.registerForm.value.job_title,
        Industry: "",
        DeviceToken: "",
        DeviceType: "",
        FirBaseToken: ""
      }

      this.services.register(regObj).subscribe((response)=> {
        console.log("reg response----", response);
        if(response.StatusCode == 201) {
          alert(`${response.Message}`)
          this.route.navigateByUrl("/login");
        } else {
          alert(`${response.Message}`)
        }
      })
    } else {
      alert("Please fill the required fields");
    }
    
  }
}
