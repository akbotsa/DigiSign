import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  userId: any;
  email: any;

  constructor(private fb:FormBuilder, private readonly service:ServicesService ,
    private activatedRoute:ActivatedRoute,
    private route:Router
    ) { 
    this.changePasswordForm = this.fb.group({
      // email:[""],
      newPassword:[""],
      repeatpassword:[""]
    },
    {
      validator: this.service.MatchPassword('newPassword', 'repeatpassword'),
    }
    )
  }

  ngOnInit(): void {
    // this.activatedRoute.queryParams.subscribe((res)=>{
    //   console.log("res",res.UserID)
    //   this.userId = res.UserID
    //   const email = res.Email
    //   console.log("res",res.UserID,res.Email)
    // })
    const queryParams = this.activatedRoute.queryParams.subscribe(data => {
      if (data) {

        this.userId = data['UserID']
        // this.email = data['Email']
        console.log("res",data.UserID)
        // console.log("res",this.userId,this.email )
      }

    })
    // this.changePasswordForm.patchValue({
    //   email : this.email
    // })
  }

  get f() {return this.changePasswordForm.controls}
  changePassword(){
    
     console.log("changePasswordForm",this.changePasswordForm.value)
     const data =  {
      // "UserID" : this.userId,
      "UserID" : this.userId,
      "Password" : this.changePasswordForm.value.newPassword
     }
     this.service.updatePassword(data).subscribe(res=>{
       console.log("res",res)
       if(res.StatusCode === 200){
         alert("Your Password Updated SuccessFully")
         this.route.navigateByUrl('/')
       }
     })
  }

}
