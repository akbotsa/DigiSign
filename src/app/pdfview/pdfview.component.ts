import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
  NgbPopover,
} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
declare var jquery: any;
declare var $: any;

import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-pdfview',
  templateUrl: './pdfview.component.html',
  styleUrls: ['./pdfview.component.css'],
})
export class PdfviewComponent implements OnInit, AfterViewInit {
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
  uploadedFiles = [];
  useRecId: any;
  userDocId: any;
  signatureFile: any;
  initialFile: any;
  dummy = [];
  isShowflag: boolean = true;
  downloadFlag: boolean = true
  public otherReceipts = []
  public rejectFormGroup: FormGroup;
  @ViewChild('mymodal', { static: false }) mymodal: TemplateRef<any>;
  @ViewChild('mymodal1', { static: false }) mymodal1: TemplateRef<any>;
  public docRejected: boolean;
  public isVerified: boolean = false;

  public imageBaseUrl = environment.imageBaseUrl;

  comments: any = [];
  defaultSign: any;
  getid: any;
  dafaultSignObj: any;
  showimage: boolean;
  exitSignature: string = null;
  exitInitial: string = null;
  receipientData: any;
  docId: any;
  documents: any
  indexdoc: any
  indexdocId: any
  selectedDocuments: any = []
  pdfDouments: any
  constructor(
    private modalService: NgbModal,
    private services: ServicesService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private aRoute: ActivatedRoute,
    private imageCompress: NgxImageCompressService
  ) {
    this.aRoute.queryParams.subscribe(data => {
      if (data) {
        this.userId = data.UserID
        this.docID = data.DocId
        this.viewSrc = `${environment.imageBaseUrl}${data.DocFile}`;
      }
    })

  }

  ngOnInit(): void {

    const data = new Date()
    console.log(new Date())
    const user = JSON.parse(localStorage.getItem('userDetails'))?._id;
    if (user) {
      this.userId = user
    }
    const docId = localStorage.getItem('docId');
    if (docId) {
      this.docID = docId
    }
    // let localDocfile = localStorage.getItem('docfile')
    // if (localDocfile) {
    //   this.docfile = localDocfile
    //   this.viewSrc = `${environment.imageBaseUrl}${this.docfile}`;
    // }
    const localDocuments = JSON.parse(localStorage.getItem('documents'))
    console.log('localDocuments', localDocuments)
    if (localDocuments) {
      this.documents = localDocuments
      this.viewSrc = `${environment.imageBaseUrl}${this.documents[0].Doc}`;
      this.indexdocId = this.documents[0].id
      if (this.documents.length > 0) {
        $('.pdfViewerSection_0').css('display', 'block');
      }
    }

    this.loadRecipientsList();
    this.loadRejectForm();
    this.getdefaultSigns();
    this.getDocDetails();
    this.Documents()
  }

  ngAfterViewInit() {

    if (this.documents.length > 0) {
      $('.pdfViewerSection_0').css('display', 'block');
      $('.final_0').addClass('active');
    }


  }





  getdefaultSigns() {
    this.services.getDefaultSigns(this.userId).subscribe((res) => {
      if (res.statusCode == 200) {
        this.defaultSign = res.data;
      } else {
        this.defaultSign = [];
      }
      // console.log('getDefaultSigns', this.defaultSign);
    });
  }

  loadRecipientsList() {

    let reqObj = {
      UserId: this.userId,
      DocId: this.docID,
    };

    /* this.services.recipientsList(reqObj).subscribe((resp) => {
      console.log("recpList resp-----", resp);
      this.recpList = resp.data.ReceiptsDetails[0].Receipts;
      console.log("recpList---> ", this.recpList)
      let docum = resp.data.DocDetails[0].Doc;
      console.log("doccccccccc", docum);
      this.viewSrc = `http://15.207.202.132:7000/api/v1/documents/document/${docum}`;
    }) */

    this.services.getpdfcoordinates(reqObj).subscribe((resp) => {
      if (resp.statusCode == 200) {
        console.log('coordinats-->', resp);
        this.userData = resp.data[0].Recipients;
        this.otherReceipts = resp.otherReceipts;
        this.docRejected = resp.data[0].Recipients[0].isReject;
        this.useRecId = resp.data[0].Recipients[0].ReceiptId;
        this.userDocId = resp.data[0].DocId;
        this.isVerified = resp.data[0].Recipients[0].VerifyFlag;
        console.log(this.userData);
        if (this.otherReceipts.length > 0) {
          for (let k = 0; k < this.otherReceipts.length; k++) {
            if (this.otherReceipts[k].signatureImage != "") {
              console.log('xdataUrl-->', this.otherReceipts[k].signatureImage);
              let self = this;
              var burl = `${environment.imageBaseUrl}${this.otherReceipts[k].signatureImage}`;
              this.toDataURL(burl, function (dataUrl) {
                let x = dataUrl.split(';')
                self.otherReceipts[k].signatureImage = `data:image/png;${x[1]}`;
              })
              // this.worker.postMessage('hello');
              let obj = {
                url: burl,
                index: k,
                type: "signature"
              }
              // this.worker.postMessage(obj);
            }

            if (this.otherReceipts[k].initialImage != "") {
              let self = this;
              var burl = `${environment.imageBaseUrl}${this.otherReceipts[k].initialImage}`;
              let obj = {
                url: burl,
                index: k,
                type: "initial"
              }
              // this.worker.postMessage(obj);
              this.toDataURL(burl, function (dataUrl) {
                let x = dataUrl.split(';')
                self.otherReceipts[k].initialImage = `data:image/png;${x[1]}`;
              })
            }
          }
        }
      } else if (resp.statusCode == 403) {
        this.isShowflag = true;
        this.toastr.error(
          'Waiting for prior authorized signatures.',
          'Failed:'
        );
      } else {
        this.toastr.error('Oops! Something went wrong.', 'Failed:');
      }
      if (this.userData?.length > 0) {
        for (let i = 0; i < this.userData.length; i++) {
          console.log('verify-->', this.userData[i].VerifyFlag);
          if (this.userData[i].signatureImage != "") {
            console.log('xdataUrl-->', this.userData[i].signatureImage);
            let self = this;
            var burl = `${environment.imageBaseUrl}${this.userData[i].signatureImage}`;
            this.toDataURL(burl, function (dataUrl) {
              let x = dataUrl.split(';')
              self.userData[i].signatureImage = `data:image/png;${x[1]}`;
            })
            // this.worker.postMessage('hello');
            let obj = {
              url: burl,
              index: i,
              type: "signature"
            }
            // this.worker.postMessage(obj);
          }

          if (this.userData[i].initialImage != "") {
            let self = this;
            var burl = `${environment.imageBaseUrl}${this.userData[i].initialImage}`;
            let obj = {
              url: burl,
              index: i,
              type: "initial"
            }
            // this.worker.postMessage(obj);
            this.toDataURL(burl, function (dataUrl) {
              let x = dataUrl.split(';')
              self.userData[i].initialImage = `data:image/png;${x[1]}`;
            })
          }

          if (this.userData[i].VerifyFlag === true) {
            this.dummy.push(this.userData[i].VerifyFlag);
          }
        }
      }

      if (this.dummy.length > 0) {
        this.isShowflag = true;
      }
    });

    //this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log(this.userData);
  }

  public loadRejectForm(): void {
    this.rejectFormGroup = this.fb.group({
      comments: [null, Validators.required],
    });
  }

  draggable_Signature(id) {
    console.log(id);
    this.getid = id;
    const array = this.defaultSign.find((res) => {
      return res.Type == id.toString();
    });
    console.log('array', array);
    if (array !== undefined) {
      this.dafaultSignObj = array;
      this.showimage = true;
    } else {
      this.dafaultSignObj = {};
      this.showimage = false;
    }

    this.modalService.open(this.mymodal);
    //this.modelref.close();
    console.log('method working');
    localStorage.setItem('itemId', id);
  }

  getDefaultSignature(type, docId, index) {
    /* console.log('type-->',type );
    console.log('docId-->',docId );
    console.log('index-->',index );
    console.log('Sign-->', ); */

    const array = this.defaultSign.find((res) => {
      return res.Type == type.toString();
    });

    if (array == undefined) {
      let txt = 'signature or initial'
      if (type == 1) {
        txt = 'signature'

      }
      if (type == 2) {
        txt = 'initial'
      }
      this.toastr.error(`Please set default ${txt}`, 'Failed:');
    } else {
      if (type == 1) {
        var xx = '.drag_' + docId + '_' + index;
        var yy = '.remove_' + docId + '_' + index;
        var aa = 'remove_' + docId + '_' + index;
        this.exitSignature = array?.Sign;
      } else {
        var xx = '.idrag_' + docId + '_' + index;
        var yy = '.iremove_' + docId + '_' + index;
        var aa = 'iremove_' + docId + '_' + index;
        this.exitInitial = array?.Sign;
      }
      var signImg = this.imageBaseUrl + array?.Sign;
      $(yy).remove();
      $(xx).css({ 'background-color': 'transparent', padding: 0 });
      $(xx).append(
        `<img class="${aa} pdf-sign" src="${signImg}">`
      );
    }
    //console.log('Sign', array?.Sign);
  }

  draggable_comment(docId, index) {
    localStorage.setItem('cdoc_id', docId);
    localStorage.setItem('cindex', index);
    this.modalService.open(this.mymodal1);

  }

  DocView(doc, index) {
    console.log('doc', doc);
    this.indexdoc = index;
    this.indexdocId = doc.id;
    if (this.documents.length > 0) {
      for (let h = 0; h < this.documents.length; h++) {
        this.documents
        $('.pdfViewerSection_' + h).css('display', 'none');
        $('.final_' + h).removeClass('active');
      }
    }
    $('.pdfViewerSection_' + index).css('display', 'block');
    $('.final_' + index).addClass('active');
  }
  saveImage(data) {
    console.log(data);
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
        `<img class="${aa} pdf-sign" src="${base64data}">`
      );
      self.modalService.dismissAll();
      /*  self.imageCompress.compressFile(data, -1, 50, 50).then((result) => {
         console.log(result);
         
       }); */
    };
  }
  saveImage1(data) {
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
        `<img class="${aa} pdf-sign" src="${base64data}">`
      );
      self.modalService.dismissAll();
    };
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

  uploadSignature() {
    this.itemId = localStorage.getItem('itemId');

    /* if(this.uploadedFiles.length > 0){
      if(this.itemId == 1){
        this.uploadedFiles[0] = this.fileContent;
      }else{
        this.uploadedFiles[1] = this.fileContent;
      }
    }else{
      if(this.itemId == 1){
        this.uploadedFiles.push({
          'signature' : this.fileContent
        })
        this.uploadedFiles.push({
          'initial' : ''
        })
      }else{
        this.uploadedFiles.push({
          'signature' : ''
        })
        this.uploadedFiles.push({
          'initial' : this.fileContent
        })
      }
    } */

    /* if(!this.uploadedFiles.hasOwnProperty('signature')){
      this.uploadedFiles.push({
        'signature' : ''
      })
    }

    if(!this.uploadedFiles.hasOwnProperty('initial')){
      this.uploadedFiles.push({
        'initial' : ''
      })
    } */

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
        `<img class="${aa} pdf-sign" src="${this.mainImage}">`
      );

      console.log(this.uploadedFiles);

      this.modalService.dismissAll();
    };
    reader.readAsDataURL(this.fileContent);
  }

  useSignature(sign, type) {
    if (type == '1') {
      var xx = '.drag';
      var yy = '.remove';
      var aa = 'remove';
      this.exitSignature = sign;
    }

    if (type == '2') {
      var xx = '.idrag';
      var yy = '.iremove';
      var aa = 'iremove';
      this.exitInitial = sign;
    }
    $(yy).remove();
    $(xx).css({ 'background-color': 'transparent', padding: 0 });
    $(xx).append(
      `<img class="${aa} pdf-sign" src="${this.imageBaseUrl}${sign}">`
    );
    this.modalService.dismissAll();
  }

  /* cloneComment() {
    var comment = this.rejectFormGroup.value.comments;
    console.log('comment--->', comment);
    if (comment === null) {
      this.toastr.error('Please Enter Comment', 'Failed:');
    } else {
      let cObject = {
        comment: comment,
        top: 0,
        left: 0,
      };
      this.comments.push(cObject);

      $('.pdfViewerSection').prepend(
        `<div class="draggable2 drag-cls " style="display: inline; z-index:1; background: #ccccccba; padding: 10px 10px; border-radius: 5px; color: #fff; cursor: move; left:0px; top:0px;" id="drag_${this.comments.length}"><p  class="ui-state-highlight" style="display: inline; color: #135699; font-weight: bold" ><img style="height: 20px;" src="assets/images/sign.png">${comment}</p></div>`
      );
      let self = this;
      $('.draggable2').draggable({
        containment: 'parent',
        stop: function (event, ui) {
          console.log('draggable element id ', $(this).attr('id'));
          let [name, positionIndex] = $(this).attr('id').split('_');
          self.comments[positionIndex - 1]['top'] = ui.position.top;
          self.comments[positionIndex - 1]['left'] = ui.position.left;
          console.log('comments-->', JSON.stringify(self.comments));
        },
      });

      //console.log('comments-->', JSON.stringify(this.comments));
    }
  } */

  clickOnComment(eve) {
    var cdoc = localStorage.getItem('cdoc_id');
    var cind = localStorage.getItem('cindex');


    var xx = '.icomm_' + cdoc + '_' + cind;
    var yy = '.icommrmv_' + cdoc + '_' + cind;
    var aa = 'icommrmv_' + cdoc + '_' + cind;

    $(yy).remove();
    $(xx).css({ 'background-color': 'transparent', padding: 0 });
    $(xx).append(
      `<p class="ui-state-highlight icommrmv" style="display: inline; color: #135699; font-weight: bold">${eve}</p>`
    );
    this.comments = eve;
    this.modalService.dismissAll();
    //console.log('commment--->', eve);


  }


  updateSignature() {

    var currentdate = new Date();

    let hours = currentdate.getHours()
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12
    // let slotHour = `${hours} ${ampm}`;

    var datetime = currentdate.getDate() + "/"
      + (currentdate.getMonth() + 1) + "/"
      + currentdate.getFullYear() + " "
      + hours + ":"
      + currentdate.getMinutes() + " "
      + ampm

    const formData = new FormData();
    formData.append('DocId', this.userDocId);
    formData.append('RecipientID', this.useRecId);
    formData.append('initialImage', this.initialFile);
    formData.append('signatureImage', this.signatureImage);
    formData.append('exitSignature', this.exitSignature);
    formData.append('exitInitial', this.exitInitial);

    formData.append('comments', this.comments);
    formData.append('createAt', datetime);

    console.log('data', formData.getAll('initialImage'));

    /*  if(this.comments.length > 0){
       for (let i = 0; i < this.comments.length; i++) {
         formData.append('comments[]', JSON.parse(this.comments[i]));
       }
     } */

    //console.log('formData--->', formData);

    this.services.sendRecipientFiles(formData).subscribe((resp) => {


      if (resp.statusCode == 200) {
        this.toastr.success('Signed SuccessFully', 'Success:');

        let user = JSON.parse(localStorage.getItem('userDetails'))?._id;
        if (user) {
          this.router.navigateByUrl('/document');
        } else {
          this.router.navigateByUrl('')
        }


      } else {
        this.toastr.error('Signed Failed , Please sign again', 'Failed:');
      }


      //console.log('coordinats-->', resp);
    });
  }

  /* Signature Rejection  */
  public onRejectInvitation() {



    Swal.fire({
      title: 'Please Enter Your  Reject Reason',
      input: 'text',
      inputValue: "",
      showCancelButton: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: 'Confirm Reject',
      inputValidator: (value) => {
        if (!value) {
          return 'Please Enter Your  Reject Reason'
        } else {
          const currentdate = new Date();

          let hours = currentdate.getHours()
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours ? hours : 12

          const datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " "
            + hours + ":"
            + currentdate.getMinutes() + " "
            // + currentdate.getSeconds();
            + ampm

          const rejectReqObj = {
            DocId: this.userDocId,
            RecipientID: this.useRecId,
            comments: value,
            createAt: datetime
          };


          this.services.getReject(rejectReqObj).subscribe((resp) => {
            if (resp.statusCode === 200) {
              this.toastr.success('Rejected SuccessFully', 'Success:');
              let user = JSON.parse(localStorage.getItem('userDetails'))?._id;
              if (user) {
                this.router.navigateByUrl('/document/inbox');
                this.isShowflag = false;

              } else {
                this.router.navigateByUrl('')
              }
            } else if (resp.statusCode == 403) {
              this.isShowflag = false;
              this.toastr.error(
                'Waiting for prior authorized signatures.',
                'Failed:'
              );
            } else {
              this.toastr.error(`${resp.Message}`);
            }
          });

        }
      }
    })






  }

  /* ========== generate PDF ============== */

  generatePdf() {
    var randNum = Math.floor(1000 + Math.random() * 9000);
    const filename = 'DOC_' + randNum + '.pdf';
    html2canvas(document.querySelector('#content')).then(canvas => {

      var imgData = canvas.toDataURL('image/png', 0.3);
      console.log('cavas--->', canvas);

      let pdf = new jsPDF('p', 'mm', 'a4', true);
      var pageHeight = pdf.internal.pageSize.height;
      var pageWidth = pdf.internal.pageSize.getWidth();
      var imgHeight = canvas.height * 208 / canvas.width;

      var pagecount = Math.ceil(imgHeight / pageHeight);
      console.log(pagecount);
      pdf.addImage(imgData, 'PNG', 0, 0, 208, imgHeight);
      if (pagecount > 0) {
        var xx = pagecount - 1;
        for (var i = 1; i <= xx; i++) {
          pdf.addPage();
          console.log(i);
          pdf.addImage(imgData, 'PNG', 2, -(i * pageHeight), pageWidth - 4, 0);
        }
      }
      pdf.save(filename);
    });
  }

  Documents() {
    this.services.pdfDownload(this.docID).subscribe(resp => {

      if (resp.statusCode == 200) {

        this.pdfDouments = resp.data
      }

    })

  }

  downloadPdf() {
    this.services.pdfDownload(this.docID).subscribe(resp => {

      if (resp.statusCode == 200) {

        if (this.downloadFlag === true) {
          resp.data.forEach(item => {
            saveAs.saveAs(`${this.imageBaseUrl}${item.Doc}`, `Doc${item.Doc}`)
          })

        }

        if (this.downloadFlag === false) {
          this.selectedDocuments.forEach(item => {
            saveAs.saveAs(`${this.imageBaseUrl}${item.Doc}`, `Doc${item.Doc}`)
          })

        }


      } else {
        alert('something went wrong')
      }

    })

  }


  DownloadDocs(type, id, event) {


    if (type == 1) {
      this.downloadFlag = true
    } else {
      this.downloadFlag = false

      if (event.target.checked === false) {

        for (let j = 0; j < this.selectedDocuments.length; j++) {

          const selectDocs = this.selectedDocuments[j]

          if (selectDocs.id === id) {
            this.selectedDocuments.splice(j, 1)
            j--
          }

        }

      } else {
        const data = this.pdfDouments.filter(item => item.id === id)

        this.selectedDocuments.push(data[0])
      }
      console.log(' this.selectedDocuments', this.selectedDocuments)



    }

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


  getDocDetails() {
    let finObject = {
      "DocId": this.docId
    }
    this.services.getDocumentDetails(finObject).subscribe((resp) => {
      console.log('documentDetails-->', resp);
      this.receipientData = resp.data?.Recipients;

      //this.useRecId = resp.data[0].Recipients[0].ReceiptId;
      this.userId = resp.data?.UserId;
      // console.log(this.receipientData);


      if (this.receipientData?.length > 0) {
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

      // if (this.dummy.length > 0) {
      //   this.isDownloadflag = false;
      // }
    })
    console.log('receipientData-->', this.receipientData);
  }

  // DocView(doc, index) {
  //   console.log('doc', doc);
  //   this.indexdoc = index;
  //   this.indexdocId = doc.id;
  //    if(this.documents.length > 0){
  //     for (let h = 0; h < this.documents.length; h++) {
  //         this.documents
  //         $('.pdfViewerSection_'+ h).css('display', 'none');
  //         $('.final_'+ h).removeClass('active');
  //     }
  //   }
  //   $('.pdfViewerSection_'+ index).css('display', 'block'); 

  //   $('.final_'+ index).addClass('active');

  // }
}
