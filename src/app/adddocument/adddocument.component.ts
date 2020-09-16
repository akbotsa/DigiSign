import { Component, Directive, EventEmitter, HostBinding, HostListener, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-adddocument',
  templateUrl: './adddocument.component.html',
  styleUrls: ['./adddocument.component.css']
})


export class AdddocumentComponent implements OnInit {

  @Directive({
    selector: '[appDragDrop]'
  })
  /* ========= for drag and drop ========== */

  @Output() onFileDropped = new EventEmitter<any>();

  @HostBinding('style.background-color') private background = '#f5fcff'
  @HostBinding('style.opacity') private opacity = '1'
  showNextBtn: boolean;
  formLength: number = 1;
  showDelete: boolean;

   //Dragover listener
   @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#9ecbec';
    this.opacity = '0.8'
  }

  //Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff'
    this.opacity = '1'
  }

  //Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff'
    this.opacity = '1'
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files)
    }
  }

  /* ========= END ============ */

  files: any = [];

  
  showAllRecept: boolean;
  url: string | ArrayBuffer;
  recpForm: FormGroup;
  
  pdfSrc : any
  constructor(private router: Router, private fb : FormBuilder) { }

  ngOnInit(): void {
    this.loadRecpForm();
    this.showDelete = false;
    for( let i = this.t.length; i < this.formLength; i++ ) {
      this.t.push(this.fb.group({
        name: ['',Validators.required],
        email: ['',Validators.required]
      }));
  }
  }

  loadRecpForm() {
    this.recpForm = this.fb.group({
      receipents: new FormArray([])
    })
  }

  get f() { return this.recpForm.controls; }
  get t() { return this.f.receipents as FormArray; }

  /* =========== add receipent ========== */

  addRecepient() {
    console.log("addddd")
    this.formLength = this.formLength + 1;

    if(this.formLength > 1) {
      this.showDelete = true;
    }

    for( let i = this.t.length; i < this.formLength; i++ ) {
        this.t.push(this.fb.group({
          name: ['',Validators.required],
          email: ['',Validators.required]
        }));
    }
  }

  deleteRecep(index) {
    
    this.t.removeAt(index);
    this.formLength = this.formLength - 1;
    if(this.formLength == 1) {
      this.showDelete = false;
    }
  }

  submitAddRecps() {
    console.log("form total details---",this.recpForm.value);
  }

  showNextAllRecp() {
    this.showAllRecept = true;
  }

  onFileInput(event) {
    console.log("event",event)
    console.log("eventttt file",event.target.files[0].name)
    if(event.target.files && event.target.files[0].name) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.url = event.target.result;
      console.log("URL",this.url);
      }
    }
  }

  onFileSelected() {
    let $img: any = document.querySelector('#file');
   
    if (typeof (FileReader) !== 'undefined') {
      let reader = new FileReader();
   
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
        console.log("viewwww",this.pdfSrc)
        localStorage.setItem("PdfViewerSrc",JSON.stringify(this.pdfSrc));
      };
   
      reader.readAsArrayBuffer($img.files[0]);
    }
  }

  gotoAddField() {
    this.router.navigateByUrl("/addfields");
  }


  /*  =============== Drag and Drop ============ */

  uploadFile(event) {
    console.log("length",event.length);
    if(event.length > 0) { 
      this.showNextBtn = true;
    }
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element.name);
    }  
  }
  deleteAttachment(index) {
    this.files.splice(index, 1)
  }

  

}
