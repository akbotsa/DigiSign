import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  constructor(private http: HttpClient) {}

  login(data): Observable<any> {
    console.log(environment.baseUrl);
    return this.http.post(
      environment.baseUrl + 'authentication/login',
      data
    );
  }

  register(data): Observable<any> {
    return this.http.post(
      environment.baseUrl + 'authentication/register',
      data
    );
  }

  recipientsList(data): Observable<any> {
    return this.http.post(environment.baseUrl + 'receipts/list' , data);
  }

  getDocument(data):Observable<any> {
    return this.http.get(environment.baseUrl +`documents/document/${data}`);
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

  public getDocumentsManage(data):Observable<any>{
    try {
      return this.http
        .post(environment.baseUrl + 'documents/manage', data)
        .pipe(map((res) => res));
    } catch (err) {
      return err;
    }
  }

  insertDragObject(data): Observable<any> {
    return this.http.post(environment.baseUrl + 'documents/send' , data);
  }

}
