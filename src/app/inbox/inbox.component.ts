import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
})
export class InboxComponent implements OnInit {
  public currentUser: any;
  public isLoading: boolean = true;
  public documentsList = [];
  userId: any;
  public page: number = 1;
  seachpipe: any;
  boldStyleFlag: boolean = true;

  constructor(
    private digiServices: ServicesService,
    private readonly router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.boldStyleFlag = true;
    this.userId = JSON.parse(localStorage.getItem('userDetails'))._id;
    this.currentUser = JSON.parse(localStorage.getItem('userDetails'));
    this.getDocumentsManage();
  }

  /* Call documents manage api call based on  userId and type as 1 */
  public getDocumentsManage(): void {
    let data = {
      type: '1',
      UserId: this.userId, //this.currentUser._id//"5f645bc4d4865523ab7065db"
    };
    this.digiServices
      .getDocumentsManage(data)
      .subscribe((manageDocumentsResp) => {
        this.isLoading = false;
        if (manageDocumentsResp.statusCode === 200) {
          this.documentsList = manageDocumentsResp.data.inbox;
        } else {
          this.toastr.error('Somthing went wrong.', 'Failed:');
        }
      });
  }

  /* Click on sign button in table row */
  public onClicksign(document): void {
    let obj = {
      Type: "1",
      UserId: this.userId,
      DocId: document.documents[0].DocId
    }
    // console.log("objjjjjjjjjjjjj", obj)
    this.digiServices.viewFlagUpdate(obj).subscribe((resp) => {
      // console.log("respppppp", resp);
    })
    
    let docId = document.documents[0].DocId;
    let docfile = document.documents[0].Doc;
    let documents = document.documents[0].Documents;

    localStorage.setItem('docId', docId);
    localStorage.setItem('docfile', docfile);
    localStorage.setItem('documents', JSON.stringify(documents));

    this.router.navigateByUrl('/pdfview');
  }


  docStatus(document) {

    if (document.Recipients.isReject === true) {
      return {
        status: "Rejected"
      }
    }

    if (document.Recipients.VerifyFlag === true) {
      return {
        status: "View"
      }
    }
    if (document.Recipients.VerifyFlag === false) {
      return {
        status: "Sign"
      }
    }

  }

  recipientStatus(recipient) {

    if (recipient.isReject === true) {
      return {
        status: "Rejected"
      }
    }

    if (recipient.VerifyFlag === true) {
      return {
        status: "Sign"
      }
    }
    if (recipient.VerifyFlag === false) {
      return {
        status: "Pending"
      }
    }

  }

  DocStatus(document) {

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

  deleteDoc(currentDoc) {
    let documents = [];
    documents = [
      {
        receiptId: currentDoc.Recipients.ReceiptId,
        docId: currentDoc.documents[0].DocId
      }
    ]

    let req = {
      deleteType: 1,
      userId: this.userId,
      docs: documents
    }
    this.digiServices.deleteDocument(req).subscribe((resp) => {
      console.log("delete doc resp------", resp);
      if( resp.statusCode == 200 ) {
        this.getDocumentsManage();
        this.toastr.success(`${resp.message}`);
      }
    })
  }
}
