import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-awaited',
  templateUrl: './awaited.component.html',
  styleUrls: ['./awaited.component.css']
})
export class AwaitedComponent implements OnInit {
  userId: any;
  currentUser: any;
  isLoading: boolean;
  documentsList: any;

  constructor(private digiServices: ServicesService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('userDetails'))._id;
    this.currentUser = JSON.parse(localStorage.getItem('userDetails'));
    this.getDocumentsManage();
  }

  getDocumentsManage() {
    let data = {
      type: 4,
      UserId: this.userId, //this.currentUser._id//"5f645bc4d4865523ab7065db"
    };
    this.digiServices
      .getDocumentsManage(data)
      .subscribe((manageDocumentsResp) => {
        this.isLoading = false;
        console.log("manageDocumentsResp",manageDocumentsResp)
        if (manageDocumentsResp.statusCode === 200) {
          this.documentsList = manageDocumentsResp.data.completed;
        } else {
          this.toastr.error('Something went wrong.', 'Failed:');
        }
      });
  }

  gotoPdfView(document) {
    // let obj = {
    //   Type: "1",
    //   UserId: this.userId,
    //   DocId: document.documents[0].DocId
    // }
    // console.log("objjjjjjjjjjjjj", obj)
    // this.digiServices.viewFlagUpdate(obj).subscribe((resp) => {
    //   console.log("respppppp", resp);
    // })
    let docId = document.documents[0].DocId;
    let docfile = document.documents[0].Doc;
    localStorage.setItem('docId', docId);
    localStorage.setItem('docfile', docfile);
    this.router.navigateByUrl('/pdfview');
  }

}
