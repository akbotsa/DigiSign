import { Component, OnInit } from '@angular/core';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgbModal,  ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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


  constructor(private modalService: NgbModal) { }
  private modelref: NgbModalRef
  ngOnInit(): void {
    // this.viewSrc = localStorage.getItem("PdfViewerSrc");
    //this.viewSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
    //console.log("srccccccc",this.viewSrc)

    this.getdrag();
  }

  getdrag(){
    $(function () {
      // $( "#sortable" ).sortable({
      //   revert: true
      // });
      $( ".draggable" ).draggable();
      //$( ".one" ).draggable();

      //$( "ul, li" ).disableSelection();
    });
  }

  onPdfUpload(event){
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.viewSrc = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  open(content) {
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
