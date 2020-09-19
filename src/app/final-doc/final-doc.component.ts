import { Component, OnInit } from '@angular/core';

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
    "top": 245,
    "left": -334.921875
    }
    ],
    "initial": [
    {
    "top": 0,
    "left": 0
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
    "VerifyFlag": true,
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

  constructor() { }

  ngOnInit(): void {
    console.log(this.userdata);
    this.receipientData=this.userdata.Recipients;
    this.docId=this.userdata.docId;
    this.userId=this.userdata.userId;
  }

}
