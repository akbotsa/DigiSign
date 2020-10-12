import {
  AfterViewInit,
  Component,
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-adddocument',
  templateUrl: './adddocument.component.html',
  styleUrls: ['./adddocument.component.css'],
})
export class AdddocumentComponent implements OnInit {
  @Directive({
    selector: '[appDragDrop]',
  })
  /* ========= for drag and drop ========== */
  @Output()
  onFileDropped = new EventEmitter<any>();

  @HostBinding('style.background-color') private background = '#f5fcff';
  @HostBinding('style.opacity') private opacity = '1';
  showNextBtn: boolean;
  formLength: number = 1;
  showDelete: boolean;
  uploadedFiles : any = [];
  recepArr: FormArray;
  userId: string;
  docId: string;
  isSignInOrder: boolean = false;
  public documentFieldValidationFlag: boolean = false;
  public isOwnVerify: boolean = true;

  //Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#9ecbec';
    this.opacity = '0.8';
  }

  //Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff';
    this.opacity = '1';
  }

  //Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff';
    this.opacity = '1';
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files);
    }
  }

  /* ========= END ============ */

  files: any = [];

  showAllRecept: boolean;
  url: string | ArrayBuffer;
  recpForm: FormGroup;

  pdfSrc: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private digiService: ServicesService
  ) { }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('userDetails'))._id;
    this.loadRecpForm();
    this.showDelete = false;
    for (let i = this.t.length; i < this.formLength; i++) {
      this.t.push(
        this.fb.group({
          ReceiptId: [i + 1],
          Name: ['', Validators.required],
          Email: ['', Validators.required],
          OrderNum: this.isSignInOrder ? [1, Validators.required] : null,
          IsOwnDocVerify: [false],
          comments: [''],
          isReject: [false],
        })
      );
    }
  }

  loadRecpForm() {
    this.recpForm = this.fb.group({
      email_subject: ['', Validators.required],
      email_message: ['', Validators.required],
      receipents: new FormArray([]),
    });
  }

  get f() {
    return this.recpForm.controls;
  }
  get t() {
    return this.f.receipents as FormArray;
  }

  /* =========== add receipent ========== */

  addRecepient() {
    this.formLength = this.formLength + 1;

    if (this.formLength > 1) {
      this.showDelete = true;
    }

    for (let i = this.t.length; i < this.formLength; i++) {
      this.t.push(
        this.fb.group({
          ReceiptId: [i + 1],
          Name: ['', Validators.required],
          Email: ['', Validators.required],
          OrderNum: this.isSignInOrder ? [1, Validators.required] : null,
          IsOwnDocVerify: [false],
          comments: [''],
          isReject: [false],
        })
      );
    }
  }

  onSubmitAddReceipts() {
    if (this.recpForm.valid) {
      console.log('validation if case');
      let receiptsAddReqObj = {
        UserId: this.userId,
        DocId: this.docId,
        Message: this.recpForm.value.email_message,
        Subject: this.recpForm.value.email_subject,
        Receipts: this.recpForm.value.receipents,
      };
      console.log('reqq objjj', receiptsAddReqObj);
      this.digiService.addReceiptsData(receiptsAddReqObj).subscribe((resp) => {
        console.log('add receipts resp', JSON.stringify(resp));
        if (resp.statusCode == 200) {
          this.router.navigateByUrl('/addfields');
        }
      });
    } else {
      console.log('validation else case');
      this.documentFieldValidationFlag = true;
    }
  }

  deleteRecep(index) {
    this.t.removeAt(index);
    this.formLength = this.formLength - 1;
    if (this.formLength == 1) {
      this.showDelete = false;
    }
  }

  showNextAllRecp() {
    console.log('files' , this.uploadedFiles)
    const formData = new FormData();
    formData.append('UserId', this.userId);
    this.uploadedFiles.forEach(file =>{
      formData.append('Doc' , file);
    })
   
    console.log( formData.get('Doc'))
    this.digiService.getUploadDocument(formData).subscribe((resp) => {
      if (resp.statusCode === 200) {
        localStorage.setItem('docId', resp.data.doc.DocId);
        this.docId = resp.data.doc.DocId;
        this.showAllRecept = !this.showAllRecept;
      }
      console.log('file upload resp', JSON.stringify(resp));
    });
  }

  onFileInput(event) {
    console.log('event', event);
    console.log('eventttt file', event.target.files[0].name);
    if (event.target.files && event.target.files[0].name) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.url = event.target.result;
        console.log('URL', this.url);
      };
    }
  }

  onFileSelected() {
    let $img: any = document.querySelector('#file');

    if (typeof FileReader !== 'undefined') {
      let reader = new FileReader();

      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
        console.log('viewwww', this.pdfSrc);
        localStorage.setItem('PdfViewerSrc', JSON.stringify(this.pdfSrc));
      };

      reader.readAsArrayBuffer($img.files[0]);
    }
  }

  gotoAddField() {
    this.router.navigateByUrl('/addfields');
  }

  /*  =============== Drag and Drop ============ */

  uploadFile(event) {
    this.files = []
    this.uploadedFiles = []
    // if (event.length == 1) {

    for (let i = 0; i < event.length; i++) {
      const file = event[i]
      const fileName = file.name.split('.')
      console.log('fileName', fileName)
      const check = fileName.filter(item => {
        return item.toUpperCase() === 'PDF' || item.toUpperCase() === 'DOCX' || item.toUpperCase() === 'DOC'
      })
      if (check.length > 0) {
        this.uploadedFiles.push(file);
        this.files.push(file.name);
        this.showNextBtn = true;
      } else {
        alert('Files should be Pdf file or docx file or doc File')
        break
      }
    }

   
  
    // } else {
    //   alert('Select  Pdf File or docx file  or doc file at a time')
    // }


  }
  deleteAttachment(index) {
    this.files = []
    this.uploadedFiles = []
    this.showNextBtn = false
  }

  /* Sign In order */
  public onChangeSignOrder(eve): void {
    this.isSignInOrder = eve.target.checked ? true : false;
    this.isOwnVerify = this.isOwnVerify === true ? true : false;
  }
}
