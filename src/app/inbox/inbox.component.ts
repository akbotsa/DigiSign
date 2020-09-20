import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
})
export class InboxComponent implements OnInit {
  public currentUser: any;
  public isLoading: boolean = true;
  public documentsList = [];
  userId: any;
  public page: number = 1;

  constructor(
    private digiServices: ServicesService,
    private readonly router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('userDetails'))._id;
    this.currentUser = JSON.parse(localStorage.getItem('userDetails'));
    this.getDocumentsManage();
  }

  /* Call documents manage api call based on  userId and type as 1 */
  public getDocumentsManage(): void {
    let data = {
      type: '1',
      UserId: this.userId, //this.currentUser._id//"5f645bc4d4865523ab7065db"
    };
    this.digiServices
      .getDocumentsManage(data)
      .subscribe((manageDocumentsResp) => {
        this.isLoading = false;
        if (manageDocumentsResp.statusCode === 200) {
          this.documentsList = manageDocumentsResp.data.inbox;
        } else {
          this.toastr.error('Somthing went wrong.', 'Failed:');
        }
      });
  }

  /* Click on sign button in table row */
  public onClicksign(document): void {
    let docId = document.documents[0].DocId;
    let docfile = document.documents[0].Doc;
    localStorage.setItem('docId', docId);
    localStorage.setItem('docfile', docfile);
    this.router.navigateByUrl('/pdfview');
  }
}
