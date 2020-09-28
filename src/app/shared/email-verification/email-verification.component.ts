import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  constructor(private router:Router,private activatedRoute:ActivatedRoute ,  private digiService: ServicesService) { }

  ngOnInit(): void {
  this.activatedRoute.queryParams.subscribe(res=>{
    console.log("res",res)

      const obj ={
        UserID : res.UserID
      }

      this.digiService.authenticationStatusUpdate(obj).subscribe(res =>{
        console.log('res' , res)
      })

  })
  }
  login(){
   this.router.navigateByUrl("/login")

  }

}
