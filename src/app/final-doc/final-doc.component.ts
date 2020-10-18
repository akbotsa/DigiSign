import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/services.service';
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf';
import { environment } from 'src/environments/environment';
import { NgxImageCompressService } from 'ngx-image-compress';
import html2pdf from "html2pdf.js";
declare var jquery: any;
declare var $: any;
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-final-doc',
  templateUrl: './final-doc.component.html',
  styleUrls: ['./final-doc.component.css']
})
export class FinalDocComponent implements OnInit , AfterViewInit {

  userdata : any

  receipientData: any;
  docId: any;
  userId;
  docfile: any;
  viewSrc: any;
  documents: any;
  
  indexdoc: any;
  indexdocId: any;

  dummy: any = [];
  isDownloadflag: boolean = true;
  public worker: Worker;
  public imageBaseUrl = environment.imageBaseUrl;
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
    const localDocuments = JSON.parse(localStorage.getItem('documents'))
    console.log('localDocuments' , localDocuments)
    if (localDocuments) {
      this.documents = localDocuments
    }
  }

  ngAfterViewInit(){

    if(this.documents.length > 0){
      $('.pdfViewerSection_0').css('display', 'block');
    }


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

          /* if (this.receipientData[i].comments.length > 0) {
            var items = JSON.parse(this.receipientData[i].comments);
            this.receipientData[i]['comments'] = items;
          } */

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
    console.log('receipientData-->', this.receipientData);
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
    var randNum = Math.floor(1000 + Math.random() * 9000);
    const filename = 'DOC_'+randNum+'.pdf';
    html2canvas(document.querySelector('#content')).then(canvas => {

      var imgData = canvas.toDataURL('image/png',0.3);
      console.log('cavas--->',canvas);
      
      let pdf = new jsPDF('p', 'mm', 'a4',true);
      var pageHeight= pdf.internal.pageSize.height;
      var pageWidth= pdf.internal.pageSize.getWidth();
      var imgHeight = canvas.height * 208/ canvas.width;

      var pagecount = Math.ceil(imgHeight / pageHeight);
      console.log(pagecount);
      pdf.addImage(imgData, 'PNG', 0, 0, 208, imgHeight);
      if (pagecount > 0) {
        var xx = pagecount -1;
        for (var i = 1; i <= xx; i++) { 
          pdf.addPage();
          console.log(i);
          pdf.addImage(imgData, 'PNG', 2, -(i * pageHeight), pageWidth-4, 0);
        }
    }
      pdf.save(filename);
    });
  }

  downloadPdf() {
    this.services.pdfDownload(this.docId).subscribe(resp => {

      if (resp.statusCode == 200) {

        resp.data.forEach(item  =>{
          saveAs.saveAs(`${this.imageBaseUrl}${item.Doc}`, `Doc${item.Doc}`)
        })

      }else{
        alert('something went wrong')
      }

    })

  }

  DocView(doc, index) {
    console.log('doc', doc);
    this.indexdoc = index;
    this.indexdocId = doc.id;
     if(this.documents.length > 0){
      for (let h = 0; h < this.documents.length; h++) {
          this.documents
          $('.pdfViewerSection_'+ h).css('display', 'none');
      }
    }
    $('.pdfViewerSection_'+ index).css('display', 'block'); 
  }

}
