import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  isSignupView = true;
  
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: number | undefined;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
  };

  otp: number | undefined;
  isLoggedIn = false;
  mobile: any;
  fullName: any;
  email: any;
  countryCode: number = 91;
  userType: any = 'customer';
  display: any;
  resendOtp: boolean = false;
  displayTimer: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth_service: AuthService,
    // private authService: SocialAuthService,
    // private headrerService: HeaderService,
    private messageService1: MessageService
  ) {
    this.signupForm = this.formBuilder.group({
      mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    })

    this.auth_service.isLoggedIn().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngOnInit(): void {
  }

  sendOtp() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
    } else {
      const { mobile } = this.signupForm.value;
      this.mobile = mobile;
      this.auth_service.sendOtp(this.countryCode, this.mobile, this.email, this.fullName, this.userType).subscribe(
        (response: any) => {
          if (response.success) {
            this.isSignupView = false;
            this.start(1);
          } else {
            this.messageService1.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
    }
  }
  
  validateOtp(otp: any) {
    this.otp = otp;
    if (otp.length == 6) {
      this.auth_service.validateOtp(this.countryCode, this.mobile, otp).subscribe((response: any) => {
        if (response.success) {
          this.messageService1.add({ severity: 'success', summary: 'Success', detail: 'Success Login' });
          this.router.navigate(['/setpassword']);
        }
      })
    }
  }

  start(minute: number) {
    this.displayTimer = true;
    this.resendOtp = false;
    // let minute = 1;
    let seconds = minute * 60;
    let textSec: any = '0';
    let statSec = 60;

    const prefix = minute < 10 ? '0' : '';

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      // if (statSec < 10) textSec = "0" + statSec;
      // textSec = statSec;

      if (statSec < 10) {
        console.log('inside', statSec);
        textSec = '0' + statSec;
      } else {
        console.log('else', statSec);
        textSec = statSec;
      }

      // this.display = prefix + Math.floor(seconds / 60) + ":" + textSec;
      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        console.log('finished');
        clearInterval(timer);
        this.resendOtp = true;
        this.displayTimer = false;
      }
    }, 1000);
  }

  confirmOtp() {
    this.validateOtp(this.otp);
  }

}
