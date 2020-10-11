import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-sent',
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.css'],
})
export class SentComponent implements OnInit {
  public currentUser: any;
  public isLoading: boolean = true;
  public documentsList = [];
  userId: any;
  public page: number = 1;
  seachpipe: any;

  constructor(private digiServices: ServicesService, private router: Router) { }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('userDetails'))._id;
    this.getDocumentsManage();
  }

  public getDocumentsManage(): void {
    let data = {
      type: '2',
      UserId: this.userId, //this.currentUser._id//"5f645bc4d4865523ab7065db"
    };
    this.digiServices
      .getDocumentsManage(data)
      .subscribe((manageDocumentsResp) => {
        this.isLoading = false;
        if (manageDocumentsResp.statusCode === 200) {
          this.documentsList = manageDocumentsResp.data.sent;
        }
      });
  }

  onClicksign(document) {
    let docId = document.documents[0].DocId;
    let docfile = document.documents[0].Doc;
    localStorage.setItem('docId', docId);
    localStorage.setItem('docfile', docfile);
    this.router.navigateByUrl('/finalDoc');
  }

  recipientStatus(recipient) {

    if (recipient.isReject === true) {
      return {
        status: "Rejected"
      }
    }

    if (recipient.VerifyFlag === true) {
      return {
        status: "Signed"
      }
    }
    if (recipient.VerifyFlag === false) {
      return {
        status: "Pending"
      }
    }

  }

  DocumentStatus(document) {

    if (document.isRejected === true) {
      return {
        status: "Rejected"
      }
    }

    if (document.isCompleted === true) {
      return {
        status: "Completed"
      }
    }

    if (document.isCompleted === false) {
      return {
        status: "Pending"
      }
    }
  }
}
