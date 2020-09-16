import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private http: HttpClient) { }

  loginHideShow = new EventEmitter<any>();

  login(data):Observable<any> {
    return this.http.post(environment.baseUrl + 'authentication/login' , data);
  }

  register(data):Observable<any> {
    return this.http.post(environment.baseUrl + "authentication/register", data);
  }
}
