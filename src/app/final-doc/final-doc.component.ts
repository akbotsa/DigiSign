import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/services.service';
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf';

@Component({
  selector: 'app-final-doc',
  templateUrl: './final-doc.component.html',
  styleUrls: ['./final-doc.component.css']
})
export class FinalDocComponent implements OnInit {
  userdata:any=
  {
    "UserId": "5f63a0a5d4865523ab706587",
    "DocId": "08f04af6-6437-46aa-aa47-45c938211adf",
    "Recipients": [
    {
    "ReceiptId": 1,
    "Name": "test User",
    "Email": "sanjeevreddy644@gmail.com",
    "VerifyFlag": true,
    "signatureImage": "test.png",
    "initialImage": "test.png",
    "signature": [
    {
    "top": 246,
    "left": 24.875
    },
    {
    "top": 360,
    "left": 40
    }
    ],
    "initial": [
    {
    "top": 200,
    "left": 300
    },
    {
    "top": 0,
    "left": 0
    }
    ]
    },
    {
    "ReceiptId": 2,
    "Name": "kirankumar",
    "Email": "chinthadakirankumar@gmail.com",
    "VerifyFlag": false,
    "signatureImage": "test.png",
    "initialImage": "",
    "signature": [
    {
    "top": 408,
    "left": 165
    }
    ]
    }
    ],
    "documents": [
    {
    "_id": "5f65841b0ead043940b05e5b",
    "Status": "1",
    "UserId": "5f645bc4d4865523ab7065db",
    "Doc": "DOC-d4e4.pdf",
    "DocId": "ab339b2f-7542-47ad-91aa-18015cfd7a16",
    "createdAt": "2020-09-19T04:07:55.385Z",
    "updatedAt": "2020-09-19T04:07:55.385Z",
    "__v": 0
    }
    ]
    }

    receipientData:any;
    docId:any;
    userId;
    docfile: any;
    viewSrc: any;
    dummy:any = [];
    isDownloadflag: boolean = true;

  constructor(private services: ServicesService) { }

  ngOnInit(): void {
    this.docfile = localStorage.getItem("docfile");
    this.docId = localStorage.getItem("docId");
    this.viewSrc = `http://15.207.202.132:7000/api/v1/documents/document/${this.docfile}`;
    console.log(this.userdata);
    //this.receipientData= this.userdata.Recipients;
    //this.docId=this.userdata.docId;
    //this.userId=this.userdata.userId;
    this.getDocDetails();
  }

  getDocDetails(){
    let finObject = {
      "DocId" : this.docId
    }
    this.services.getDocumentDetails(finObject).subscribe((resp) => {
      console.log('documentDetails-->', resp);
      this.receipientData = resp.data.Recipients;
      
      //this.useRecId = resp.data[0].Recipients[0].ReceiptId;
      this.userId = resp.data.UserId;
      console.log(this.receipientData);

      if(this.receipientData.length > 0){
        for (let i = 0; i < this.receipientData.length; i++) {
          console.log('verify-->', this.receipientData[i].VerifyFlag);
            if(this.receipientData[i].VerifyFlag === false){
                this.dummy.push(this.receipientData[i].VerifyFlag);
            }
        }
      }

      if(this.dummy.length >0){
        this.isDownloadflag = false;
      }
      

    })
  }

  generatePdf() {
    const filename  = 'FinalDOc.pdf';
		html2canvas(document.querySelector('#content'), {scale: 3}).then(canvas => {
			let pdf = new jsPDF('p', 'mm', 'a4');
			pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 200);
			pdf.save(filename);
		});
  }

}
