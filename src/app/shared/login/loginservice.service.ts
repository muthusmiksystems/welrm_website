import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable,BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class LoginserviceService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  // private apiUrl = 'https://api.welrm.com/api/login';
  private apiUrl = 'https://localhost:5001/api/login';
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const body = { mobile:username, password:password };
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'oauth-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6MzM4fSwiaWF0IjoxNjc3NzM5OTg3LCJleHAiOjE2Nzc4MjYzODd9.WQKkAiyhqbDEvY70JIC-PtTHbWkEDFj9xTalfVGKZhs'
    // });
    return this.http.post<any[]>(this.apiUrl, body);
  }
}
