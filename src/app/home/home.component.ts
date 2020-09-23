import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;
  firstName: any;
  @ViewChild('mymodal', { static: false }) mymodal: TemplateRef<any>;
  fileContent: File;
  imageURL: any;
  itemId: any;
  signatureImage: any;
  initialFile: any;
  mainImage: any;

  constructor(private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("userDetails"));
    // this.firstName = this.user.FirstName;
    console.log("user----",this.user)
  }

  sign() {
    this.modalService.open(this.mymodal);
  }

  onFileSelected(event) {
    console.log('onFileSelected--->', event);
    const file = (event.target as HTMLInputElement).files[0];
    this.fileContent = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  saveImage(data) {
    let self = this;
    var reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = function () {
      var base64data = reader.result;
      self.itemId = localStorage.getItem('itemId');
      if (self.itemId == 1) {
        var xx = '.drag';
        var yy = '.remove';
        var aa = 'remove';
        self.signatureImage = data;
      } else {
        var xx = '.idrag';
        var yy = '.iremove';
        var aa = 'iremove';
        self.initialFile = data;
      }
      $(yy).remove();
      $(xx).css({ 'background-color': 'transparent', padding: 0 });
      $(xx).append(
        `<img class="${aa}" style="height: 100px;width: auto;" src="${base64data}">`
      );
      self.modalService.dismissAll();
    };
  }

  uploadSignature() {
    this.itemId = localStorage.getItem('itemId');
    console.log('uploadSignature--->', this.fileContent);
    const reader = new FileReader();
    reader.onload = () => {
      console.log('res--->', reader.result);
      this.mainImage = reader.result as string;

      /* append image here */

      if (this.itemId == 1) {
        var xx = '.drag';
        var yy = '.remove';
        var aa = 'remove';
        this.signatureImage = this.fileContent;
      } else {
        var xx = '.idrag';
        var yy = '.iremove';
        var aa = 'iremove';
        this.initialFile = this.fileContent;
      }
      console.log('yy--->', yy);
      console.log('xx--->', xx);
      $(yy).remove();
      $(xx).css({ 'background-color': 'transparent', padding: 0 });
      $(xx).append(
        `<img class="${aa}" style="height: 100px;width: auto;" src="${this.mainImage}">`
      );

      console.log(this.uploadedFiles);

      this.modalService.dismissAll();
    };
    reader.readAsDataURL(this.fileContent);
  }
  uploadedFiles(uploadedFiles: any) {
    throw new Error('Method not implemented.');
  }
  
}
