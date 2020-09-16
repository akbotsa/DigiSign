import { Component, OnInit } from '@angular/core';
import {DragDropModule} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-add-fields',
  templateUrl: './add-fields.component.html',
  styleUrls: ['./add-fields.component.css']
})
export class AddFieldsComponent implements OnInit {
  viewSrc: string;

  constructor() { }

  ngOnInit(): void {
    // this.viewSrc = localStorage.getItem("PdfViewerSrc");
    this.viewSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
    console.log("srccccccc",this.viewSrc)
  }

}
