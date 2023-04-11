import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class BackendService implements OnInit {
  private token: string | null | undefined;
  constructor(private http: HttpClient, private authtoken: TokenService) {}

  ngOnInit(): void {
    this.token = this.authtoken.get();
    console.log(this.token);
  }
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
  me() {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    return this.http.post('http://127.0.0.1:8000/api/me', null, { headers });
  }
  programs() {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    return this.http.get('http://127.0.0.1:8000/api/programs', { headers });
  }
  programsById(id: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    return this.http.get(`http://127.0.0.1:8000/api/programs/${id}`, {
      headers,
    });
  }
  programLeader(pid: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    return this.http.get(`http://127.0.0.1:8000/api/programLeader/${pid}`, {
      headers,
    });
  }
  programMember(pid: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    return this.http.get(`http://127.0.0.1:8000/api/members/${pid}`, {
      headers,
    });
  }

  programPartners(pid: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    return this.http.get(`http://127.0.0.1:8000/api/partner/${pid}`, {
      headers,
    });
  }

  programParticipants(pid: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    return this.http.get(`http://127.0.0.1:8000/api/participant/${pid}`, {
      headers,
    });
  }
}
