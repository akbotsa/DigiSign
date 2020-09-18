import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-document-sign-view',
  templateUrl: './document-sign-view.component.html',
  styleUrls: ['./document-sign-view.component.css']
})
export class DocumentSignViewComponent implements OnInit {
  public viewSrc: string;
  //public baseUrl = environment.imageBaseUrl;
  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
  /*   this.route.paramMap.subscribe(params => {
      this.viewSrc = this.baseUrl+params.get("id");
      console.log("pdf url in document sign view",this.viewSrc);
    }); */
    console.log("doc id",localStorage.getItem("docId"));
    console.log("baseUrl",environment.imageBaseUrl);
    this.viewSrc = 'http://15.207.202.132:7000/api/v1/documents/document/'+localStorage.getItem("docId");

    console.log("pdf url in document sign view",this.viewSrc);
  }

}
