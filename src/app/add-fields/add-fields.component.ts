import { Component, OnInit } from '@angular/core';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgbModal,  ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

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


  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    // this.viewSrc = localStorage.getItem("PdfViewerSrc");
    this.viewSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
    console.log("srccccccc",this.viewSrc)
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
  }

  onFileSelected(event){
    const file = (event.target as HTMLInputElement).files[0];
    
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

}
