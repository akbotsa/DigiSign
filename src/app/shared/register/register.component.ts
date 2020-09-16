import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm : FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadRegisterForm();
  }

  loadRegisterForm() {
    this.registerForm = this.fb.group({
      first_name: ['',Validators.required],
      last_name: ['',Validators.required],
      email: ['',Validators.required],
      phone: ['',Validators.required],
      job_title: ['',Validators.required],
      industry: ['',Validators.required]
    })
    // console.log("registerForm",this.registerForm);
  }

  get r() { return this.registerForm.controls }

  register() {
    console.log("regForm-----",this.registerForm.valid);
    if( this.registerForm ) {
      console.log("registerForm",this.registerForm);
    } else {
      alert("Please fill the required fields");
    }
    
  }
}
