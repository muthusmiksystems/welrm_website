import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiCallerService } from './utlis/api-caller.service';
import { Url } from './utlis/url';
import { MessageService } from 'primeng/api';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private tokenKey = 'access_token';
  private expirationKey = 'token_expiration';
  private userKey = 'user_data';
  // apiUrl = 'https://api.welrm.com/api/login';
  // logoutUrl = 'https://api.welrm.com/api/logout';
  // sendOtpUrl = 'https://api.welrm.com/api/user/send-otp';
  // valOtpUrl = 'https://api.welrm.com/api/user/verify-otp';
  apiUrl = 'https://localhost:5001/api/login';
  logoutUrl = 'https://localhost:5001/api/logout';
  sendOtpUrl = 'https://localhost:5001/api/user/send-otp';
  valOtpUrl = 'https://localhost:5001/api/user/verify-otp';

  constructor(private messageService1: MessageService, private http: HttpClient, private router: Router, private apiService: ApiCallerService,
    public afAuth: AngularFireAuth
  ) { }


  sendOtp(countryCode: any, mobile: any, email: any, fullName: any, userType: any): Observable<any> {
    const body = { mobile: mobile, email: email, fullName: fullName, countryCode: countryCode, userType: userType };
    return this.apiService.callApi('POST', Url.SEND_OTP, body, false, false);
  }

  userCount(): Observable<any> {
    return this.apiService.callApi('GET', Url.COUNT, null, true, false);
  }

  validateOtp(countryCode: any, mobile: any, otp: any): Observable<any> {
    const body = { mobile: mobile, countryCode: countryCode, otp: otp };
    return this.apiService.callApi('POST', Url.VERIFY_OTP, body, false, false).pipe(
      tap((response) => {
        if (response.success == true && response.data.user.userType == 'customer') {
          const token = response.data.accesstoken;
          const user = response.data.user;
          this.storeUserData(response);
          this.setToken(token, 6 * 60 * 60 * 1000); // Set token with expiration time 6 hours
        } else {
          if (response.success == true && response.data.user.userType == 'owner') {
            // console.log('owner login data', response);
            // const token = response.data.accesstoken;
            // const user = response.data.user;
            // this.storeUserData(response);
            // this.setToken(token, 6 * 60 * 60 * 1000); // Set token with expiration time 6 hours
          } else {
            this.messageService1.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        }
      })
    );
  }

  login(
    username: string,
    password: string,
    expirationTime: number
  ): Observable<any> {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
    // const body = { mobile: username, password: password };
    const body = isEmail
      ? { email: username, password: password }  // Send email and password
      : { mobile: username, password: password };  // Send mobile and passwor
    return this.apiService.callApi('POST', Url.LOGIN, body, false, false).pipe(
      tap((response) => {
        if (response.success) {
          if (response.data.user.userType == 'customer') {
            const token = response.data.accesstoken;
            const user = response.data.user;
            this.storeUserData(response);
            this.setToken(token, 6 * 60 * 60 * 1000); // Set token with expiration time 6 hours
            this.messageService1.add({ severity: 'success', summary: 'Success', detail: response.message });
          } else {
            this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Please Login With Hotel Owner Portal' });
          }
        } else {
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: response.message });
        }
      })
    );
  }

  logout(): Observable<void> {
    return this.apiService.callApi('POST', Url.LOGOUT, null, true, false).pipe(
      tap(() => {
        this.clearToken();
        console.log('Logout successful');
        this.router.navigate(['/']);
      })
    );
  }

  accountDelete(): Observable<void> {
    return this.apiService.callApi('POST', Url.DEACTIVE, null, true, false).pipe(
      tap(() => {
        this.clearToken();
        console.log('Account Delete Successfull');
        this.router.navigate(['/']);
      })
    );
  }

  public setToken(token: string, expirationTime: number): void {
    const expirationTimestamp = new Date().getTime() + expirationTime;
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.expirationKey, expirationTimestamp.toString());
    // Schedule the token removal
    setTimeout(() => {
      this.clearToken();
    }, expirationTime);
    this.loggedInSubject.next(true);
  }

  getUserData() {
    const response = localStorage.getItem(this.userKey);
    return response ? JSON.parse(response) : null;
  }

  public clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.expirationKey); // Remove the expiration timestamp
    localStorage.removeItem(this.userKey);
    this.loggedInSubject.next(false);
  }

  // Check if the token is valid until 12 AM of the present day
  isTokenValidUntilMidnight(): boolean {
    const expirationTimestamp = localStorage.getItem(this.expirationKey);
    if (expirationTimestamp) {
      const currentTime = new Date().getTime();
      return currentTime <= parseInt(expirationTimestamp, 10);
    }
    return false; // Token is considered expired if 'token_expiration' is not found
  }

  checkToken(): string | null {
    if (this.isTokenValidUntilMidnight()) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isLoggedIn(): Observable<boolean> {
    if (this.checkToken()) {
      this.loggedInSubject.next(true);
      return this.loggedInSubject.asObservable();
    } else {
      this.loggedInSubject.next(false);
      return this.loggedInSubject.asObservable();
    }
  }

  storeUserData(response: any) {
    localStorage.setItem(this.userKey, JSON.stringify(response));
    this.loggedInSubject.next(true);
  }
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider())
      .then((res: any) => {
        console.log('Login successful:', res); // Log success
        // Here you might want to perform additional actions like navigating to a different page
        return res;
      })
      .catch((error) => {
        console.error('Error during Google login:', error); // Log error
        // You can display a message to the user if needed
        this.messageService1.add({ severity: 'error', summary: 'Login Error', detail: error.message });
      });
  }

  // Common Auth Login logic
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        console.log('Authentication result:', result); // Log result object
        return result;
      })
      .catch((error) => {
        console.error('Error during login:', error); // Log error
        throw error; // Rethrow the error if needed
      });
  }

  socialLogin(payload: any) {
    return this.apiService.callApi('POST', Url.SOCIAL_AUTH, payload, false, false);
  }
  googleSignOut(): Promise<void> {
    return this.afAuth.signOut(); // Firebase auth example
  }
  forgotpassword(
    username: any
  ): Observable<any> {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
    // const body = { mobile: username, password: password };
    const body = { mobile: username, type: 'customer' };  // Send mobile and passwor
    return this.apiService.callApi('POST', Url.FORGOT_PASSWORD, body, false, false).pipe(
      tap((response) => {
        console.log('res', response)
        if (response.success) {
          // if (response.data.user.userType == 'customer') {
          //   const token = response.data.accesstoken;
          //   const user = response.data.user;
          //   this.storeUserData(response);
          //   this.setToken(token, 6 * 60 * 60 * 1000); // Set token with expiration time 6 hours
          //   this.messageService1.add({ severity: 'success', summary: 'Success', detail: response.message });
          // } else {
          //   this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Please Login With Hotel Owner Portal' });
          // }
        } else {
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: response.message });
        }
      })
    );
  }
}
