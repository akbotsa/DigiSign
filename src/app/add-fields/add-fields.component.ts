import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { ServicesService } from '../services/services.service';
import { Router } from '@angular/router';
declare var jquery: any;
declare var $: any;
import { ToastrComponentlessModule, ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-fields',
  templateUrl: './add-fields.component.html',
  styleUrls: ['./add-fields.component.css'],
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
  sendBtnHide: boolean = false;
  indexdoc: any;
  indexdocId: any;

  documents: any = []

  public imageBaseUrl = environment.imageBaseUrl

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private services: ServicesService,
    private router: Router
  ) { }
  private modelref: NgbModalRef;
  ngOnInit(): void {
    localStorage.removeItem('userData');
    // this.viewSrc = localStorage.getItem("PdfViewerSrc");

    // this.viewSrc = "http://15.207.202.132:7000/api/v1/documents/document/Roles-b81e.pdf";
    //console.log("srccccccc",this.viewSrc)
    this.userId = JSON.parse(localStorage.getItem('userDetails'))._id;
    this.docID = localStorage.getItem('docId');
    // console.log("dociiddddd",this.docID);
    this.loadRecipientsList();
    this.getdrag();
    console.log('ngOnInit', this.documents)
  }

  /* ngAfterContentInit(){
    console.log('ngAfterContentInit', this.documents)
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit', this.documents)
    if (this.documents.length > 0) {
      $('.pdfViewerSection_0').css('display', 'block');
    }
  } */

  getdrag() {
    var sigcount = 1;
    var inicount = 1;
    $(function () {
      $('#sortable').sortable({
        revert: true,
      });
      $('.draggable').draggable({
        containment: 'parent',
        drag: function () {
          var offset = $(this).offset();

          //console.log("positions:", offset);
          var xPos = offset.left;
          var yPos = offset.top;
          $('#posX').text('x: ' + xPos);
          $('#posY').text('y: ' + yPos);
        },
      });

      $('.draggable1').draggable({
        connectToSortable: '#sortable',
        helper: 'clone',
        revert: 'invalid',
      });

      //$( ".one" ).draggable();

      //$( "ul, li" ).disableSelection();
    });
  }

  cloneSignature(user, index, docindex, indexdocId) {
    console.log('hello', docindex);
    if (docindex == undefined) {
      this.toastr.error('Please Select any one Document', 'error');
    } else {
      this.sendBtnHide = true;
      if (!this.recpList[index].hasOwnProperty('document')) {
        let temp2 = [{}];
        this.recpList[index]['document'] = temp2;
        if (!this.recpList[index].document[docindex].hasOwnProperty('id')) {
          this.recpList[index].document[docindex]['id'] = indexdocId;
        }
        if (!this.recpList[index].document[docindex].hasOwnProperty('signature')) {
          let temp = [
            {
              top: 0,
              left: 0
            },
          ];
          this.recpList[index].document[docindex]['signature'] = temp;
        } else {
          // console.log("recp list  have signature key");
          this.recpList[index]['signature'].push({
            top: 0,
            left: 0
          });
        }
      } else {
        if (!this.recpList[index].document[docindex]) {
          this.recpList[index]['document'].push({});
          if (!this.recpList[index].document[docindex].hasOwnProperty('id')) {
            this.recpList[index].document[docindex]['id'] = indexdocId;
          }
          if (!this.recpList[index].document[docindex].hasOwnProperty('signature')) {
            let temp = [
              {
                top: 0,
                left: 0,
              },
            ];
            this.recpList[index].document[docindex]['signature'] = temp;
          } else {
            // console.log("recp list  have signature key");
            this.recpList[index]['signature'].push({
              top: 0,
              left: 0
            });
          }
        } else {
          if (!this.recpList[index].document[docindex].hasOwnProperty('signature')) {
            let temp = [
              {
                top: 0,
                left: 0,
              },
            ];
            this.recpList[index].document[docindex]['signature'] = temp;
          } else {
            // console.log("recp list  have signature key");
            this.recpList[index]['signature'].push({
              top: 0,
              left: 0
            });
          }
        }
      }
      //console.log("rec list length", this.recpList[index]['positions'].length);
      $('.pdfViewerSection_' + docindex)
        .prepend(`<div class="draggable2 drag-cls " style="display: inline; z-index:1; background: #ccccccba; padding: 10px 10px; border-radius: 5px; color: #fff; cursor: move; left:0px; top:0px;"
      id="drag_${index}_${docindex}_${this.recpList[index].document[docindex]['signature'].length}">
      <p  class="ui-state-highlight" style="display: inline; color: #135699; font-weight: bold" ><img style="height: 20px;" src="assets/images/sign.png">${user.Name}</p></div>`);
      let self = this;
      $('.draggable2').draggable({
        containment: 'parent',
        stop: function (event, ui) {
          console.log('draggable element id ', $(this).attr('id'));
          let [name, parentIndex, dIndex, positionIndex] = $(this).attr('id').split('_');
          self.recpList[parentIndex].document[dIndex]['signature'][positionIndex - 1]['top'] =
            ui.position.top;
          self.recpList[parentIndex].document[dIndex]['signature'][positionIndex - 1]['left'] =
            ui.position.left;
          console.log("recpList", self.recpList);
          localStorage.setItem('userData', JSON.stringify(self.recpList));
        },
      });
      //console.log("First");
      console.log("recpList", self.recpList);
      localStorage.setItem('userData', JSON.stringify(self.recpList));
    }
  }

  cloneIntial(user, index, docindex, indexdocId,) {
    if (docindex == undefined) {
      this.toastr.error('Please Select any one Document', 'error');
    } else {
      this.sendBtnHide = true;
      if (!this.recpList[index].hasOwnProperty('document')) {
        let temp2 = [{}];
        this.recpList[index]['document'] = temp2;
        if (!this.recpList[index].document[docindex].hasOwnProperty('id')) {
          this.recpList[index].document[docindex]['id'] = indexdocId;
        }
        if (!this.recpList[index].document[docindex].hasOwnProperty('initial')) {
          let temp = [
            {
              top: 0,
              left: 0
            },
          ];
          this.recpList[index].document[docindex]['initial'] = temp;
        } else {
          // console.log("recp list  have signature key");
          this.recpList[index].document[docindex]['initial'].push({
            top: 0,
            left: 0
          });
        }
      } else {
        if (!this.recpList[index].document[docindex]) {
          this.recpList[index]['document'].push({});
          if (!this.recpList[index].document[docindex].hasOwnProperty('id')) {
            this.recpList[index].document[docindex]['id'] = indexdocId;
          }
          if (!this.recpList[index].document[docindex].hasOwnProperty('initial')) {
            let temp = [
              {
                top: 0,
                left: 0
              },
            ];
            this.recpList[index].document[docindex]['initial'] = temp;
          } else {
            // console.log("recp list  have signature key");
            this.recpList[index].document[docindex]['initial'].push({
              top: 0,
              left: 0
            });
          }
        } else {
          if (!this.recpList[index].document[docindex].hasOwnProperty('initial')) {
            let temp = [
              {
                top: 0,
                left: 0
              },
            ];
            this.recpList[index].document[docindex]['initial'] = temp;
          } else {
            // console.log("recp list  have signature key");
            this.recpList[index].document[docindex]['initial'].push({
              top: 0,
              left: 0
            });
          }
        }
      }
      $('.pdfViewerSection_' + docindex).prepend(
        `<div class="draggable3 drag-cls" style="display: inline; z-index:1; background: #ccccccba; padding: 10px 10px; border-radius: 5px; color: #fff; cursor: move" id="drag_${index}_${docindex}_${this.recpList[index].document[docindex]['initial'].length}"> <p  class="ui-state-highlight" style="display: inline; color: #135699;  font-weight: bold"><img style="height: 20px;" src="assets/images/digital.png">${user.Name}</p></div>`
      );

      let self = this;
      $('.draggable3').draggable({
        containment: 'parent',
        stop: function (event, ui) {
          let [name, parentIndex, dIndex, positionIndex] = $(this).attr('id').split('_');
          self.recpList[parentIndex].document[dIndex]['initial'][positionIndex - 1]['top'] =
            ui.position.top;
          self.recpList[parentIndex].document[dIndex]['initial'][positionIndex - 1]['left'] =
            ui.position.left;
          console.log("recpList", self.recpList);
          localStorage.setItem('userData', JSON.stringify(self.recpList));
        },
      });
      localStorage.setItem('userData', JSON.stringify(self.recpList));
    }

  }


  cloneComment(user, index, docindex, indexdocId) {
    if (docindex == undefined) {
      this.toastr.error('Please Select any one Document', 'error');
    } else {
      this.sendBtnHide = true;
      if (!this.recpList[index].hasOwnProperty('document')) {
        let temp2 = [{}];
        this.recpList[index]['document'] = temp2;
        if (!this.recpList[index].document[docindex].hasOwnProperty('id')) {
          this.recpList[index].document[docindex]['id'] = indexdocId;
        }
        if (!this.recpList[index].document[docindex].hasOwnProperty('commentsCoordinates')) {
          let temp = [
            {
              top: 0,
              left: 0
            },
          ];
          this.recpList[index].document[docindex]['commentsCoordinates'] = temp;

          $('.pdfViewerSection_' + docindex).prepend(
            `<div class="draggable4 drag-cls" style="display: inline; z-index:1; background: #ccccccba; padding: 10px 10px; border-radius: 5px; color: #fff; cursor: move" id="drag_${index}_${docindex}_${this.recpList[index].document[docindex]['commentsCoordinates'].length}"> <p  class="ui-state-highlight" style="display: inline; color: #135699;  font-weight: bold"><i style="color: #000;" class="fa fa-commenting" aria-hidden="true"></i>&nbsp;${user.Name}</p></div>`
          );

          let self = this;
          $('.draggable4').draggable({
            containment: 'parent',
            stop: function (event, ui) {
              let [name, parentIndex, dIndex, positionIndex] = $(this).attr('id').split('_');
              self.recpList[parentIndex].document[dIndex]['commentsCoordinates'][positionIndex - 1]['top'] =
                ui.position.top;
              self.recpList[parentIndex].document[dIndex]['commentsCoordinates'][positionIndex - 1]['left'] =
                ui.position.left;
              //console.log("recpList", self.recpList);
              localStorage.setItem('userData', JSON.stringify(self.recpList));
            },
          });
          localStorage.setItem('userData', JSON.stringify(self.recpList));

        }
      } else {
        if (!this.recpList[index].document[docindex]) {
          this.recpList[index]['document'].push({});
          if (!this.recpList[index].document[docindex].hasOwnProperty('id')) {
            this.recpList[index].document[docindex]['id'] = indexdocId;
          }
          if (!this.recpList[index].document[docindex].hasOwnProperty('commentsCoordinates')) {
            let temp = [
              {
                top: 0,
                left: 0
              },
            ];
            this.recpList[index].document[docindex]['commentsCoordinates'] = temp;
            $('.pdfViewerSection_' + docindex).prepend(
              `<div class="draggable4 drag-cls" style="display: inline; z-index:1; background: #ccccccba; padding: 10px 10px; border-radius: 5px; color: #fff; cursor: move" id="drag_${index}_${docindex}_${this.recpList[index].document[docindex]['commentsCoordinates'].length}"> <p  class="ui-state-highlight" style="display: inline; color: #135699;  font-weight: bold"><i style="color: #000;" class="fa fa-commenting" aria-hidden="true"></i>&nbsp;${user.Name}</p></div>`
            );

            let self = this;
            $('.draggable4').draggable({
              containment: 'parent',
              stop: function (event, ui) {
                let [name, parentIndex, dIndex, positionIndex] = $(this).attr('id').split('_');
                self.recpList[parentIndex].document[dIndex]['commentsCoordinates'][positionIndex - 1]['top'] =
                  ui.position.top;
                self.recpList[parentIndex].document[dIndex]['commentsCoordinates'][positionIndex - 1]['left'] =
                  ui.position.left;
                //console.log("recpList", self.recpList);
                localStorage.setItem('userData', JSON.stringify(self.recpList));
              },
            });
          }
        } else {
          if (!this.recpList[index].document[docindex].hasOwnProperty('commentsCoordinates')) {
            let temp = [
              {
                top: 0,
                left: 0
              },
            ];
            this.recpList[index].document[docindex]['commentsCoordinates'] = temp;
            $('.pdfViewerSection_' + docindex).prepend(
              `<div class="draggable4 drag-cls" style="display: inline; z-index:1; background: #ccccccba; padding: 10px 10px; border-radius: 5px; color: #fff; cursor: move" id="drag_${index}_${docindex}_${this.recpList[index].document[docindex]['commentsCoordinates'].length}"> <p  class="ui-state-highlight" style="display: inline; color: #135699;  font-weight: bold"><i style="color: #000;" class="fa fa-commenting" aria-hidden="true"></i>&nbsp;${user.Name}</p></div>`
            );

            let self = this;
            $('.draggable4').draggable({
              containment: 'parent',
              stop: function (event, ui) {
                let [name, parentIndex, dIndex, positionIndex] = $(this).attr('id').split('_');
                self.recpList[parentIndex].document[dIndex]['commentsCoordinates'][positionIndex - 1]['top'] =
                  ui.position.top;
                self.recpList[parentIndex].document[dIndex]['commentsCoordinates'][positionIndex - 1]['left'] =
                  ui.position.left;
                //console.log("recpList", self.recpList);
                localStorage.setItem('userData', JSON.stringify(self.recpList));
              },
            });
          }
        }
      }
    }
  }

  async loadRecipientsList() {
    let reqObj = {
      UserId: this.userId,
      DocId: this.docID,
    };

     this.services.recipientsList(reqObj).subscribe(async (resp) => {
      //console.log("recpList resp-----", resp);
      this.recpList = await resp.data.ReceiptsDetails[0]?.Receipts;
      //console.log("recpList- ", this.recpList)
      let docum = resp.data.DocDetails[0]?.Doc;
      //console.log("doccccccccc", docum);
      // this.viewSrc = `${environment.imageBaseUrl}${docum}`;
      this.viewSrc = await resp.data.DocDetails[0]?.Documents[0]?.Doc;

      this.documents = await resp.data.DocDetails[0]?.Documents
      if(this.documents.length > 0){
        this.indexdoc = 0;
        this.indexdocId = this.documents[0].id;
      }
      console.log('documents', this.documents)


    });
  }

  DocView(doc, index) {

    this.indexdoc = index;
    this.indexdocId = doc.id;
    if (this.documents.length > 0) {
      for (let h = 0; h < this.documents.length; h++) {
        this.documents
        $('.pdfViewerSection_' + h).css('display', 'none');
        $('.final_'+ h).removeClass('active');
      }
    }
    $('.pdfViewerSection_' + index).css('display', 'block');
    $('.final_'+ index).addClass('active');
    //this.viewSrc = doc.Doc
  }

  onPdfUpload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      // this.viewSrc = "http://15.207.202.132:7000/api/v1/documents/document/57e98bd0-6fec-4379-b844-e2bc448ccefd-8ccd.pdf";
      // this.viewSrc = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  open(content, index) {
    //console.log("indexxxx", index);
    this.currentIndex = index;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed`;
        }
      );
  }

  saveImage(data) {
    this.signatureImage = data;
    //console.log("Draw Signature image data--->", this.signatureImage);
    this.modelref.close();
  }

  onFileSelected(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.fileContent = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  uploadSignature() {
    //console.log('fileContent-->', this.fileContent);

    const reader = new FileReader();
    reader.onload = () => {
      this.mainImage = reader.result as string;
    };
    reader.readAsDataURL(this.fileContent);

    //console.log(this.mainImage);
  }

  updateCoordinates() {
    if (this.recpList.length > 0) {
      for (let i = 0; i < this.recpList.length; i++) {
        this.recpList[i]['VerifyFlag'] = false;
        this.recpList[i]['viewFlag'] = false;
        this.recpList[i]['signatureImage'] = '';
        this.recpList[i]['initialImage'] = '';
        this.recpList[i]['isReject'] = false;
        this.recpList[i]['isDelete'] = false;
        this.recpList[i]['createAt'] = '';

      }
    }

    var recepctData = JSON.stringify(localStorage.getItem('userData'));

    console.log('final Data--->', this.recpList);

    let object = {
      UserId: this.userId,
      DocId: this.docID,
      Recipients: this.recpList,
    };
    //console.log(object);
    this.services.insertDragObject(object).subscribe((resp) => {
      console.log('Final Coordiantes', resp);
      if (resp.statusCode == 200) {
        this.router.navigateByUrl('document/sent');
        //alert('Coordinate send successfully.');
      } else {
        this.toastr.error('Something went wrong.', 'Failed:');
      }
    });
  }
}
