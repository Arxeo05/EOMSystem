import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  signup(data: any): Observable<any> {
    return this.http.post<any>(
      'http://127.0.0.1:8000/api/signup',
      JSON.stringify(data),
      this.httpOptions
    );
  }
  login(data: any): Observable<any> {
    return this.http.post<any>(
      'http://127.0.0.1:8000/api/login',
      JSON.stringify(data),
      this.httpOptions
    );
  }
}
