import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginserviceService } from './loginservice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from 'src/app/constants/common.constant';
import { GetroomService } from 'src/app/user/views/getroom/getroom.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  result: any;

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
    private auth_service: AuthService,
    private modalService: NgbModal,
    private dataService: GetroomService,
  ) {
    this.auth_service.isLoggedIn().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngOnInit() {
    this.redirectURL  = this.route.snapshot.queryParams['returnUrl'] || '/';

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

            // this.router.navigate(['/']);
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
}
