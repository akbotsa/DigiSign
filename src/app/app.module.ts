import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ManageComponent } from './manage/manage.component';
import { ActionComponent } from './action/action.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { WaitingComponent } from './waiting/waiting.component';
import { AdddocumentComponent } from './adddocument/adddocument.component';
import { InboxComponent } from './inbox/inbox.component';
import { SentComponent } from './sent/sent.component';
import { DocumentDetailsComponent } from './document-details/document-details.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LoginComponent } from './shared/login/login.component';
import { RegisterComponent } from './shared/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DraftsComponent } from './drafts/drafts.component';
import { AddFieldsComponent } from './add-fields/add-fields.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignaturePadModule } from '@ng-plus/signature-pad';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PdfviewComponent } from './pdfview/pdfview.component';
import { DocumentSignViewComponent } from './document-sign-view/document-sign-view.component';
import { FinalDocComponent } from './final-doc/final-doc.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DigitOnlyDirective } from './helpers/digitOnlyDirective';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import {NgxImageCompressService} from 'ngx-image-compress';
import { ForgotPasswordComponent } from './shared/forgot-password/forgot-password.component';
import { EmailVerificationComponent } from './shared/email-verification/email-verification.component';

const ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'document',
    component: ManageComponent,
    // redirectTo: "details",
    children: [
      {
        path: '',
        component: InboxComponent,
      },
      {
        path: 'inbox',
        component: InboxComponent,
      },
      {
        path: 'sent',
        component: SentComponent,
      },
      {
        path: 'draft',
        component: DraftsComponent,
      },
    ],
  },
  { path: 'adddocument', component: AdddocumentComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'addfields', component: AddFieldsComponent },
  { path: 'pdfview', component: PdfviewComponent },
  { path: 'documentSign', component: DocumentSignViewComponent },
  { path: 'finalDoc', component: FinalDocComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: 'emailverfication', component: EmailVerificationComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ManageComponent,
    ActionComponent,
    SidenavComponent,
    WaitingComponent,
    AdddocumentComponent,
    InboxComponent,
    SentComponent,
    LoginComponent,
    RegisterComponent,
    DraftsComponent,
    AddFieldsComponent,
    PdfviewComponent,
    DocumentSignViewComponent,
    FinalDocComponent,
    DigitOnlyDirective,
    ForgotPasswordComponent,
    EmailVerificationComponent,
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    BrowserModule,
    PdfViewerModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    RouterModule.forRoot(ROUTES),
    NgbModule,
    NgxPaginationModule,
    SignaturePadModule,
    SignaturePadModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [NgxImageCompressService],
  bootstrap: [AppComponent],
})
export class AppModule {}
