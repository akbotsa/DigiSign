import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/services.service';
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf';
import { environment } from 'src/environments/environment';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-final-doc',
  templateUrl: './final-doc.component.html',
  styleUrls: ['./final-doc.component.css']
})
export class FinalDocComponent implements OnInit {
  userdata: any =
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

  receipientData: any;
  docId: any;
  userId;
  docfile: any;
  viewSrc: any;
  dummy: any = [];
  isDownloadflag: boolean = true;
  public worker: Worker;

  public imageBaseUrl = environment.imageBaseUrl
  constructor(private services: ServicesService,
    private imageCompress: NgxImageCompressService
    ) {



    if (typeof Worker !== 'undefined') {
      // Create a new
      this.worker = new Worker('./final-doc.worker', { type: 'module' });
      this.worker.onmessage = ({ data }) => {
        console.log(`page got message: `, JSON.stringify(data));
        console.log(data.type);
        var orientation = -1;
        if(data.type=== "initial"){
          this.imageCompress.compressFile(data.url, orientation, 50, 50).then(
            result => {
              this.receipientData[data.index].signatureImage = data.url;
            });
          
        }else{
          this.imageCompress.compressFile(data.url, orientation, 50, 50).then(
            result => {
              this.receipientData[data.index].initialImage = data.url
            });
          
        }
        
      };

    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  ngOnInit(): void {
    this.docfile = localStorage.getItem("docfile");
    this.docId = localStorage.getItem("docId");
    this.viewSrc = `${environment.imageBaseUrl}${this.docfile}`;
    console.log(this.userdata);
    //this.receipientData= this.userdata.Recipients;
    //this.docId=this.userdata.docId;
    //this.userId=this.userdata.userId;
    this.getDocDetails();
  }

  getDocDetails() {
    let finObject = {
      "DocId": this.docId
    }
    this.services.getDocumentDetails(finObject).subscribe((resp) => {
      console.log('documentDetails-->', resp);
      this.receipientData = resp.data.Recipients;

      //this.useRecId = resp.data[0].Recipients[0].ReceiptId;
      this.userId = resp.data.UserId;
      // console.log(this.receipientData);

      if (this.receipientData.length > 0) {
        for (let i = 0; i < this.receipientData.length; i++) {
          //console.log('verify-->', this.receipientData[i].VerifyFlag);
          if (this.receipientData[i].VerifyFlag === false) {
            this.dummy.push(this.receipientData[i].VerifyFlag);
          }

          if (this.receipientData[i].comments.length > 0) {
            var items = JSON.parse(this.receipientData[i].comments);
            this.receipientData[i]['comments'] = items;
          }

          if (this.receipientData[i].signatureImage != "") {
            console.log('xdataUrl-->', this.receipientData[i].signatureImage);
            let self = this;
            var burl = `${environment.imageBaseUrl}${this.receipientData[i].signatureImage}`;
            this.toDataURL(burl, function (dataUrl) {
                  let x = dataUrl.split(';')
                  self.receipientData[i].signatureImage = `data:image/png;${x[1]}`;
            }) 
            // this.worker.postMessage('hello');
            let obj = {
              url: burl,
              index: i,
              type: "signature"
            }
            // this.worker.postMessage(obj);
          }

          if (this.receipientData[i].initialImage != "") {
            let self = this;
            var burl = `${environment.imageBaseUrl}${this.receipientData[i].initialImage}`;
            let obj = {
              url: burl,
              index: i,
              type: "initial"
            }
            // this.worker.postMessage(obj);
              this.toDataURL(burl, function (dataUrl) {
               let x = dataUrl.split(';')
               self.receipientData[i].initialImage = `data:image/png;${x[1]}`;
             }) 
          }
        }
      }

      if (this.dummy.length > 0) {
        this.isDownloadflag = false;
      }
    })
    console.log('DataTest-->', this.receipientData);
  }

  toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        //console.log('test--->', reader);
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  generatePdf() {
    const filename = 'FinalDOc.pdf';
    html2canvas(document.querySelector('#content'), { scale: 0.5 }).then(canvas => {
      let pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 200);
      pdf.save(filename);
    });
  }

}
