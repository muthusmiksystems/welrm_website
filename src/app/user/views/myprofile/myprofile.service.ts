import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCallerService } from 'src/app/utlis/api-caller.service';
import { Url } from 'src/app/utlis/url';


@Injectable({
  providedIn: 'root'
})
export class MyprofileService {

  constructor(private http: HttpClient,private apiService: ApiCallerService) { }
 
  getProfileData(): Observable<any[]> {
    return this.apiService.callApi('GET', Url.GET_OWNER_PROFILE, null, true, false);
  } 
  updateProfile(name:any,email:any,mobile:any): Observable<any[]> {
    const body = {
      fullName:name,
      email:email,
      mobile:mobile,
      countryCode:91,
    };
    return this.apiService.callApi('PUT', Url.CUSTOMER_PROFILE_UPDATE,body,true,false);
  }
}

