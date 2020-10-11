import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.css']
})
export class CompletedComponent implements OnInit {
  userId: any;
  currentUser: any;
  isLoading: boolean;
  documentsList: any;

  constructor(private digiServices: ServicesService,
    private toastr: ToastrService,
    private router: Router ) { }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('userDetails'))._id;
    this.currentUser = JSON.parse(localStorage.getItem('userDetails'));
    this.getDocumentsManage();
  }

  getDocumentsManage() {
    let data = {
      type: 3,
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

  gotoPdfView(doc) {
    this.router.navigateByUrl('/pdfview');
  }
}
