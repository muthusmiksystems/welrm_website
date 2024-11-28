import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  // private apiUrl = 'https://api.welrm.com/api/user/send-otp';
  // private valOtp = 'https://api.welrm.com/api/user/verify-otp';
  private apiUrl = 'https://localhost:5001/api/user/send-otp';
  private valOtp = 'https://localhost:5001/api/user/verify-otp';


  constructor(private http: HttpClient) { }

  sendOtp(countryCode: any, mobile: any,email:any,fullName:any,userType:any): Observable<any> {
    const body = { mobile:mobile,email:email,fullname:fullName,countryCode:countryCode,userType:userType};
    return this.http.post<any[]>(this.apiUrl, body);
  }
  validateOtp(countryCode: any, mobile: any,otp:any): Observable<any> {
    const body = { mobile:mobile,countryCode:countryCode,otp:otp};
    return this.http.post<any[]>(this.valOtp, body);
  }
}

