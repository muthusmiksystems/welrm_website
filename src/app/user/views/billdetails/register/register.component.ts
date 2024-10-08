import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth.service';
import { GetroomService } from '../../getroom/getroom.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;

  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: number | undefined;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
  };
  
  otp: any;
  mobile: any;
  fullName: any;
  email: any;
  countryCode: number = 91;
  userType: any = 'customer';
  display: any;
  resendOtp: boolean = false;
  displayTimer: boolean = false;
  showOtpInput: boolean = false;
  showOtpBtn: boolean = false;
  userData: any;
  bookingData: any;

  constructor(
    private messageService1: MessageService,
    private auth_service: AuthService,
    private router: Router,
    private dataService: GetroomService,
    private formBuilder: FormBuilder,
  ) {
    this.userForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      otp: [''],
    });
  }

  ngOnInit(): void {
    this.dataService.getApiData().subscribe((data) => {
      if (data != null) {
      } else {
        // this.router.navigate(['/home']);
      }
    });

    this.userForm.get("otp")?.valueChanges.subscribe(value => {
      this.otp = value ? value.toString() : value;
    });

    this.dataService.getApiData().subscribe((data) => {
      if (data != null) {
        this.bookingData = data;
      }
    });
  }

  sendOtp() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
    } else {
      const payload = this.userForm.value;
      this.fullName = payload.fullName;
      this.email = payload.email;
      this.mobile = payload.mobile;

      this.showOtpInput = true;
      this.auth_service.sendOtp(this.countryCode, this.mobile, this.email, this.fullName, this.userType).subscribe(
        (response: any) => {
          if (response.success) {
            this.start(1);
            this.messageService1.add({ severity: 'success', summary: 'success', detail: response.message });
          } else {
            this.showOtpInput = false;
            this.messageService1.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        (error: any) => {
          this.showOtpInput = false;
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: error.error.message });
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
          this.userData = response.data;

          if (this.userData && this.bookingData) {
            this.bookingData.commision_percent = this.userData?.commission_percentage;
            this.bookingData.userId = this.userData?.user?.id;
            this.bookingData.userFullName = this.userData?.user?.fullName;
            this.bookingData.userEmail = this.userData?.user?.email;
            this.bookingData.userType = this.userData?.user?.userType;

            this.dataService.setApiData(this.bookingData);
          }
          
          this.router.navigateByUrl('/list', {skipLocationChange: true}).then(() => {
            this.router.navigate(['/billdetails']);
          });
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
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
    } else {
      this.validateOtp(this.otp);
    }
  }

  onChangeNumber(event) {
    let number = event.target.value;
    if (number?.length === 10) {
      this.showOtpBtn = true;
    } else {
      this.showOtpBtn = false;
    }
  }
}
