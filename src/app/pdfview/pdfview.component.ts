import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ServicesService } from '../services/services.service';
import {NgbModal,  ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
declare var jquery: any;
declare var $: any;

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf';



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
  imageURL: String;
  signatureImage;
  fileContent: any;
  mainImage: any;
  itemId: any;
  @ViewChild("mymodal",{static: false})mymodal:TemplateRef<any>

  constructor(private modalService: NgbModal, private services: ServicesService) { }

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

  draggable_Signature(obj, index, index2, id) {
    console.log(index)
    console.log(index2)
    console.log(id)
    this.modalService.open(this.mymodal);
    //this.modelref.close();
    console.log("method working");
    localStorage.setItem('index',index);
    localStorage.setItem('index2',index2);
    localStorage.setItem('itemId',id);
  }

  saveImage(data) {
    this.signatureImage = data;
    var index1 = localStorage.getItem('index');
    var index2 = localStorage.getItem('index2');
    this.itemId = localStorage.getItem('itemId');
    if(this.itemId == 1){
      var xx = '#drag_'+index1+'_'+index2;
      var yy = '#remove_'+index1+'_'+index2;
    }else{
      var xx = '#idrag_'+index1+'_'+index2;
      var yy = '#iremove_'+index1+'_'+index2;
    }
    $(yy).remove();
    $(xx).css({"background-color": "transparent", "padding": 0});
    $(xx).append(`<img style="height: 40px;width: 80px;" src="${this.signatureImage}">`);
    console.log("Draw Signature image data--->", this.signatureImage);
    //this.modalService.

  }

  onFileSelected(event) {
    console.log("onFileSelected--->");
    const file = (event.target as HTMLInputElement).files[0];
    this.fileContent = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  uploadSignature() {
    console.log("uploadSignature--->");
    const reader = new FileReader();
    reader.onload = () => {
      this.mainImage = reader.result as string;

      /* append image here */
      var index1 = localStorage.getItem('index');
      var index2 = localStorage.getItem('index2');
      this.itemId = localStorage.getItem('itemId');
      if(this.itemId == 1){
        var xx = '#idrag_'+index1+'_'+index2;
        var yy = '#remove_'+index1+'_'+index2;
      }else{
        var xx = '#idrag_'+index1+'_'+index2;
        var yy = '#iremove_'+index1+'_'+index2;
      }

      $(yy).remove();
      $(xx).css({"background-color": "transparent", "padding": 0});
      $(xx).append(`<img style="height: 40px;width: 80px;" src="${this.mainImage}">`);
    }
    reader.readAsDataURL(this.fileContent);

  }

  generatePdf() {
    const filename  = 'Invoice.pdf';
		html2canvas(document.querySelector('#content'), {scale: 4}).then(canvas => {
			let pdf = new jsPDF('p', 'mm', 'a4');
			pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 200);
			pdf.save(filename);
		});
  }

}
