import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
   
  showHideLogin = new EventEmitter<any>();
  constructor(private http: HttpClient) {}

  login(data): Observable<any> {
    console.log(environment.baseUrl);
    return this.http.post(environment.baseUrl + 'authentication/login', data);
  }

  register(data): Observable<any> {
    return this.http.post(
      environment.baseUrl + 'authentication/register',
      data
    );
  }
  // http://15.207.202.132:7000/api/v1/authentication/forgetPassword
  // http://15.207.202.132:7000/api/v1/authentication/updatePassword
  updatePassword(data): Observable<any> {
    return this.http.post(
      environment.baseUrl + 'authentication/updatePassword',
      data
    );
  }

  MatchPassword(newPassword: string, repeatpassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[newPassword];
      const confirmPasswordControl = formGroup.controls[repeatpassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  forgetPassword(data): Observable<any> {
    return this.http.post(
      environment.baseUrl + 'authentication/forgetPassword',
      data
    );
  }

  recipientsList(data): Observable<any> {
    return this.http.post(environment.baseUrl + 'receipts/list', data);
  }

  getDocument(data): Observable<any> {
    return this.http.get(environment.baseUrl + `documents/document/${data}`);
  }

  public getUploadDocument(data): Observable<any> {
    try {
      return this.http
        .post(environment.baseUrl + 'documents/upload', data)
        .pipe(map((res) => res));
    } catch (err) {
      return err;
    }
  }

  loginHideShow = new EventEmitter<any>();

  public addReceiptsData(data): Observable<any> {
    try {
      return this.http
        .post(environment.baseUrl + 'receipts/add', data)
        .pipe(map((res) => res));
    } catch (err) {
      return err;
    }
  }

  public getDocumentsManage(data): Observable<any> {
    try {
      return this.http
        .post(environment.baseUrl + 'documents/manage', data)
        .pipe(map((res) => res));
    } catch (err) {
      return err;
    }
  }

  insertDragObject(data): Observable<any> {
    return this.http.post(environment.baseUrl + 'documents/send', data);
  }

  getpdfcoordinates(data): Observable<any> {
    return this.http.post(
      environment.baseUrl + 'documents/doc_Coordinates',
      data
    );
  }

  sendRecipientFiles(data): Observable<any> {
    return this.http.post(environment.baseUrl + 'documents/verify', data);
  }

  getDocumentDetails(data): Observable<any> {
    return this.http.post(environment.baseUrl + 'documents/final_doc', data);
  }

  viewFlagUpdate(data):Observable<any> {
    return this.http.post(environment.baseUrl + 'documents/updateView', data);
  }

  signs(data):Observable<any> {
    return this.http.post(environment.baseUrl + "documents/Signs", data);
  }

  public getReject(data): Observable<any> {
    try {
      return this.http
        .post(environment.baseUrl + 'documents/doc_reject', data)
        .pipe(map((res) => res));
    } catch (err) {
      return err;
    }
  }


  getsigns(data):Observable<any> {
    return this.http.post(environment.baseUrl + "documents/get_signs", data);
  }

  deleteExistedSign(id):Observable<any> {
    return this.http.get(environment.baseUrl + `documents/Sign_remove/${id}`);
  }

  // /documents/Get_Default_Signs
  getDefaultSigns(id):Observable<any> {
    return this.http.get(environment.baseUrl + `documents/Get_Default_Signs/${id}`);
  }

  // /documents/sign_default
  setDefaultSigns(data):Observable<any> {
    return this.http.put(environment.baseUrl + `documents/sign_default`,data);
  }

   // Change Password
   changePassword(data):Observable<any> {
    return this.http.post(environment.baseUrl + `authentication/changePassword`,data);
  }


  // /authentication/Status_Update
  authenticationStatusUpdate(data){
    
    return this.http.post(environment.baseUrl + `authentication/Status_Update`,data);
  }
  
  // http://15.207.202.132:7000/api/v1/documents/counts
  getCounts(data){
    
    return this.http.post(environment.baseUrl + `documents/counts`,data);
  } 

  deleteDocument(data):Observable<any> {
    return this.http.post(environment.baseUrl + "documents/delete",data);
  }

  pdfDownload(DocId : string):Observable<any> {
    const params = new HttpParams().set("DocId" , DocId)
    return this.http.get(environment.baseUrl + "documents/pdfDownload" , {params :params} , );
  }
}
