import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginserviceService } from './loginservice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from 'src/app/constants/common.constant';
import { GetroomService } from 'src/app/user/views/getroom/getroom.service';
import { MessageService } from 'primeng/api';
import {IMAGES} from '../constants/images.constant'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public images = IMAGES; 
  loginForm!: FormGroup;
  result: any;
  max: number | null = 10;
  isLoggedIn = false;
  userData: any;
  notification: any = GlobalConstants.notification;
  newPass = false;
  redirectURL: any;
  bookingData: any;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginserviceService,
    private router: Router,
    private route: ActivatedRoute,
    public auth_service: AuthService,
    private modalService: NgbModal,
    private dataService: GetroomService,
    private messageService1: MessageService,
  ) {
    this.auth_service.isLoggedIn().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngOnInit() {
    this.redirectURL = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.userData = this.auth_service.getUserData();
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.dataService.getApiData().subscribe((data) => {
      if (data != null) {
        this.bookingData = data;
      }
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    } else {
      const { username, password } = this.loginForm.value;
      this.auth_service
        .login(username, password, this.calculateExpirationTimeUntilMidnight())
        .subscribe((data) => {
          console.log("data-", data)

          if (data.success == true && data.data.user.userType == 'customer') {

            this.userData = data.data;
            if (this.userData && this.bookingData) {
              this.bookingData.commision_percent = this.userData?.commission_percentage;
              this.bookingData.userId = this.userData?.user?.id;
              this.bookingData.userFullName = this.userData?.user?.fullName;
              this.bookingData.userEmail = this.userData?.user?.email;
              this.bookingData.userType = this.userData?.user?.userType;
            }
            if (this.isLoggedIn) {
              this.auth_service.userCount().subscribe((response: any) => {
                if (response.success) {
                  GlobalConstants.notification = response.data.notifications;
                  this.notification = response.data.notifications;
                  // console.log('Noti call--', GlobalConstants.notification)
                }
              })
            }

            this.router.navigate(['/']);
            if (this.bookingData) this.dataService.setApiData(this.bookingData);
            this.router.navigateByUrl(this.redirectURL, { replaceUrl: true });
          }
        });
    }
  }

  // Calculate expiration time until midnight
  calculateExpirationTimeUntilMidnight(): number {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Set to midnight of the next day

    // Calculate the difference in seconds
    const secondsUntilMidnight = (midnight.getTime() - now.getTime()) / 1000;

    return secondsUntilMidnight;
  }

  gotoNext(route: any) {
    this.router.navigate([`/${route}`]);
  }
  onInputChange() {
    const inputValue = this.loginForm.get('username')?.value;

    // If the input is numeric and length is greater than 10, trim the value
    if (this.isNumeric(inputValue) && inputValue.length > 10) {
      this.loginForm.get('username')?.setValue(inputValue.slice(0, 10));
    }

    // Update max length dynamically
    this.max = this.getMaxLength(inputValue);
  }

  getMaxLength(inputValue: string): number | null {
    // If the input contains letters, return null (no maxlength), otherwise return 10
    return this.isNumeric(inputValue) ? 10 : null;
  }

  isNumeric(value: string): boolean {
    // This regex checks for numbers only
    return /^[0-9]*$/.test(value);
  }
  // Assuming auth_service is already imported and available in this context

  GoogleAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth_service.GoogleAuth().then((res) => {
        console.log("Google login response:", res);

        // Construct the payload from the response
        const payload = {
          userType: "customer",
          type: "google",
          social_loginId: res.user.providerData[0].uid, // Extract from the user object
          fcmToken: res.user.uid, // Replace with actual FCM token if available
          fullName: res.user.displayName, // Extracted from user
          email: res.user.email
        };
        console.log("google payload:", payload)
        // Call the socialLogin function with the constructed payload
        this.auth_service.socialLogin(payload)
          .subscribe((data) => {
            console.log("data:", data)
            if (data.success) {
              if (data.data.user.userType == 'customer') {
                const token = data.data.accesstoken;
                const user = data.data.user;
                this.auth_service.storeUserData(data);
                this.auth_service.setToken(token, 6 * 60 * 60 * 1000); // Set token with expiration time 6 hours
                this.messageService1.add({ severity: 'success', summary: 'Success', detail: data.message });
              } else {
                this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Please Login With Hotel Owner Portal' });
              }
            } else {
              this.messageService1.add({ severity: 'error', summary: 'Error', detail: data.message });
            }
            if (data.success == true && data.data.user.userType == 'customer') {
              this.userData = data.data;
              if (this.userData && this.bookingData) {
                this.bookingData.commision_percent = this.userData?.commission_percentage;
                this.bookingData.userId = this.userData?.user?.id;
                this.bookingData.userFullName = this.userData?.user?.fullName;
                this.bookingData.userEmail = this.userData?.user?.email;
                this.bookingData.userType = this.userData?.user?.userType;
              }
              if (this.isLoggedIn) {
                this.auth_service.userCount().subscribe((response: any) => {
                  if (response.success) {
                    GlobalConstants.notification = response.data.notifications;
                    this.notification = response.data.notifications;
                    console.log('Noti call--', GlobalConstants.notification)
                  }
                })
              }

              // this.router.navigate(['/']);
              if (this.bookingData) this.dataService.setApiData(this.bookingData);
              this.router.navigateByUrl(this.redirectURL, { replaceUrl: true });
            }
            this.auth_service.googleSignOut().then(() => {
              console.log("Google session cache cleared successfully.");
            }).catch((error) => {
              console.error("Error clearing Google session cache:", error);
            });
          });
      }).catch((error) => {
        this.auth_service.googleSignOut().then(() => {
          console.log("Google session cache cleared successfully.");
        }).catch((error) => {
          console.error("Error clearing Google session cache:", error);
        });
        reject(error);
      });
    });
  }

  // Function to handle login response


}
