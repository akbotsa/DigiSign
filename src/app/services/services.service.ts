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
    return this.http.post(environment.baseUrl + 'authentication/login', data);
  }

  register(data): Observable<any> {
    return this.http.post(
      environment.baseUrl + 'authentication/register',
      data
    );
  }

  public getUploadDocument(data): Observable<any> {
    try {
      return this.http
        .post('http://15.207.202.132:7000/api/v1/' + 'documents/upload', data)
        .pipe(map((res) => res));
    } catch (err) {
      return err;
    }
  }

  loginHideShow = new EventEmitter<any>();

  public addReceiptsData(data): Observable<any> {
    try {
      return this.http
        .post('http://15.207.202.132:7000/api/v1/' + 'receipts/add', data)
        .pipe(map((res) => res));
    } catch (err) {
      return err;
    }
  }
}
