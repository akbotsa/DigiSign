import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-sent',
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.css']
})
export class SentComponent implements OnInit {
  public currentUser: any;
  public isLoading: boolean = true;
  public documentsList = [];
  userId: any;

  constructor(private digiServices: ServicesService) { }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('userDetails'))._id;
    this.getDocumentsManage();
  }

  public getDocumentsManage(): void {
    let data = {
      "type": "2",
      "UserId": this.userId,//this.currentUser._id//"5f645bc4d4865523ab7065db"
    }
    this.digiServices.getDocumentsManage(data).subscribe(manageDocumentsResp => {
      this.isLoading = false;
      if (manageDocumentsResp.statusCode === 200) {
        this.documentsList = manageDocumentsResp.data.sent;
      }
    })
  }

  onClicksign(doc){
    console.log('doc', doc);
  }

}
