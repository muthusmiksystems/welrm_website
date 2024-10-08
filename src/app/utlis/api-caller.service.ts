import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Url } from './url';

@Injectable({
  providedIn: 'root'
})
export class ApiCallerService {
  private baseUrl: string = Url.BASE_URL;

  constructor(private http: HttpClient) { }

  callApi(
    method: string,
    endpoint: string,
    body?: any,
    accessToken: boolean = false,
    fileToUpload: boolean = false
  ): Observable<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.createHeaders(accessToken, fileToUpload);
    const options = { headers: headers };

    switch (method) {
      case 'GET':
        return this.http.get(url, options);
    
      case 'POST':
        return this.http.post(url, body, options);
    
      case 'PUT':
        return this.http.put(url, body, options);
    
      case 'DELETE':
        return this.http.delete(url, options);
    
      default:
        return this.http.get(url, options);
    }
    
  }

  private createHeaders(accessToken: boolean, fileToUpload: boolean): HttpHeaders {
    let headers = new HttpHeaders();

    if (accessToken) {
      const token = localStorage.getItem('access_token') ?? '';
      headers = headers.set('oauth-token', token);
    }

    if (fileToUpload) {
      headers = headers.set('Content-Type', 'multipart/form-data');
    } else {
      headers = headers.set('Content-Type', 'application/json');
    }

    return headers;
  }
}




