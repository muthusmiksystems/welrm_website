import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCallerService } from 'src/app/utlis/api-caller.service';
import { Url } from 'src/app/utlis/url';


@Injectable({
  providedIn: 'root'
})
export class ChangepasswordService {

  constructor(private http: HttpClient,private apiService: ApiCallerService) { }

  setPassword(newPassword: any, confirmPassword: any): Observable<any[]> {
    const body = {
      "newPassword": newPassword,
      "confirmPassword": confirmPassword
    };
   
    return this.apiService.callApi('PUT', Url.CHANGE_PASSWORD, body,true, false);
  }
}
