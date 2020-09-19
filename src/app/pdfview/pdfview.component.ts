import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-pdfview',
  templateUrl: './pdfview.component.html',
  styleUrls: ['./pdfview.component.css']
})
export class PdfviewComponent implements OnInit {
  viewSrc: string;
  userId: any;
  docID: string;
  docfile: string;
  recpList: any;
  currentIndex: any;
  userData: any;

  constructor(private services: ServicesService) { }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('userDetails'))._id;
    this.docID = localStorage.getItem("docId");
    this.docfile = localStorage.getItem("docfile");
    this.viewSrc = `http://15.207.202.132:7000/api/v1/documents/document/${this.docfile}`;
    this.loadRecipientsList();
  }

  loadRecipientsList() {

    let reqObj = {
      UserId: this.userId,
      DocId: this.docID
    }

    /* this.services.recipientsList(reqObj).subscribe((resp) => {
      console.log("recpList resp-----", resp);
      this.recpList = resp.data.ReceiptsDetails[0].Receipts;
      console.log("recpList---> ", this.recpList)
      let docum = resp.data.DocDetails[0].Doc;
      console.log("doccccccccc", docum);
      this.viewSrc = `http://15.207.202.132:7000/api/v1/documents/document/${docum}`;
    }) */


    this.services.getpdfcoordinates(reqObj).subscribe((resp) => {
      console.log('coordinats-->', resp);
      this.userData = resp.data[0].Recipients;
      console.log(this.userData);
    })

    //this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log(this.userData);
  }

}
