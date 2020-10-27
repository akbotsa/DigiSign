import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private digiServices: ServicesService, private router: Router, private toastr: ToastrService) { }

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

    let documents = document.documents[0].Documents;
    localStorage.setItem('documents', JSON.stringify(documents));
    
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
        status: "Sign"
      }
    }
    if (recipient.VerifyFlag === false) {
      return {
        status: "Pending"
      }
    }

  }

  DocumentStatus(document) {

    if (document.isVoid === true) {
      return {
        status: "Void"
      }
    }

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
        receiptId: "",
        docId: currentDoc.documents[0].DocId
      }
    ]

    let req = {
      deleteType: 2,
      userId: this.userId,
      docs: documents
    }
    this.digiServices.deleteDocument(req).subscribe((resp) => {
      console.log("delete doc resp------", resp);
      if( resp.statusCode == 200 ) {
        this.getDocumentsManage();
        this.toastr.success(`${resp.message}`);
      } else {
        this.toastr.error(`${resp.message}`)
      }
    })
  }

  ResendDoc(Document){

    this.digiServices.reSend(Document.documents[0].DocId).subscribe(res =>{
      console.log('res' , res)
      if(res.statusCode === 200){
        this.toastr.success('Document Sent SuccessFully' , 'Success');
      }else{
        this.toastr.error(`${res.message}` , 'Failed')
      }
    })


  }

  VoidDoc(Document){

       const obj = {
         UserId : this.userId,
         DocId : Document.documents[0].DocId
       }

       this.digiServices.voidDocument(obj).subscribe(resp =>{
         console.log('resp' , resp)
       })

  }
}
