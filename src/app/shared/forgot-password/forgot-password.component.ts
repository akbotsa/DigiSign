import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  changePasswordForm: FormGroup;

  constructor(private fb:FormBuilder) { 
    this.changePasswordForm = this.fb.group({
      newPassword:[""],
      repeatpassword:[""]
    })
  }

  ngOnInit(): void {
  }
  changePassword(){
     console.log("changePasswordForm",this.changePasswordForm.value)
  }

}
