import { Component, OnInit } from '@angular/core';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgbModal,  ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ServicesService } from '../services/services.service';
declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-add-fields',
  templateUrl: './add-fields.component.html',
  styleUrls: ['./add-fields.component.css']
})
export class AddFieldsComponent implements OnInit {
  viewSrc: string;
  closeResult: string;
  signatureImage;
  imageURL: string;

  mainImage: string;

  fileContent: any;
  userId: any;
  docID: string;
  doc: any;
  recpList: any;
  currentIndex: any;


  constructor(private modalService: NgbModal, private services: ServicesService) { }
  private modelref: NgbModalRef
  ngOnInit(): void {
    // this.viewSrc = localStorage.getItem("PdfViewerSrc");
    
    // this.viewSrc = "http://15.207.202.132:7000/api/v1/documents/document/Roles-b81e.pdf";
    //console.log("srccccccc",this.viewSrc)
    this.userId = JSON.parse(localStorage.getItem('userDetails'))._id;
    this.docID = localStorage.getItem("docId");
    // console.log("dociiddddd",this.docID);
    this.getdrag();
    this.loadRecipientsList();
  }

  getdrag(){
    $(function () {
      $( "#sortable" ).sortable({
        revert: true
      });
      $( ".draggable" ).draggable({
        containment: "parent"
      });


      $( ".draggable1" ).draggable({
        connectToSortable: "#sortable",
        helper: "clone",
        revert: "invalid"
      });

      
      //$( ".one" ).draggable();

      //$( "ul, li" ).disableSelection();
    });
  }

  clontheitem(){
    var el = $('.child').clone(); 
    $('.pdfViewerSection').prepend(`<div class="draggable2 drag-cls" style="display: inline; z-index:1" >
    <p  class="ui-state-highlight" style="display: inline;">Main Drag</p>
</div>`);
    $('.draggable2').draggable({
      containment: "parent"
    });
    console.log(el);
  }

  loadRecipientsList() {

    let reqObj = {
      UserId: this.userId,
      DocId: this.docID
    }

    this.services.recipientsList(reqObj).subscribe((resp)=> {
      console.log("recpList resp-----",resp);
      this.recpList = resp.data.ReceiptsDetails[0].Receipts;
      console.log("recpList- ",this.recpList)
      let docum = resp.data.DocDetails[0].Doc;
      console.log("doccccccccc",docum);
      this.viewSrc = `http://15.207.202.132:7000/api/v1/documents/document/${docum}`;
    })
  }


  onPdfUpload(event){
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      // this.viewSrc = "http://15.207.202.132:7000/api/v1/documents/document/57e98bd0-6fec-4379-b844-e2bc448ccefd-8ccd.pdf";
      // this.viewSrc = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  open(content,index) {
    console.log("indexxxx",index);
    this.currentIndex = index;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size : 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  saveImage(data) {
    this.signatureImage = data;
    console.log("Draw Signature image data--->",this.signatureImage);
    this.modelref.close();
  }

  onFileSelected(event){
    const file = (event.target as HTMLInputElement).files[0];
    this.fileContent = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  uploadSignature(){
    console.log('fileContent-->', this.fileContent);

    const reader = new FileReader();
    reader.onload = () => {
      this.mainImage = reader.result as string;
    }
    reader.readAsDataURL(this.fileContent);

    console.log(this.mainImage);

  }

}
