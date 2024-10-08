import { Component, OnInit, EventEmitter, Output, Input, ViewChild, HostListener } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { HeaderService } from './header.service';
import { GlobalConstants } from 'src/app/constants/common.constant';
import { MessageService } from 'primeng/api';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ResSidebarService } from 'src/app/res-sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  showHotelSearch = false;
  currentRoute = '';
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: number | undefined;
  @ViewChild('otpModal') otpModal: any;
  @ViewChild('otpConfirmModal') otpConfirmModal: any;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',

  };

  otp: number | undefined;
  loginForm!: FormGroup;
  SignUpForm!: FormGroup;
  MobileForm!: FormGroup;
  result: any;
  UserName!: string | null;
  token: any;
  isLoggedIn = false;
  userData: any;
  selectedCity: string = '';
  mobile: any;
  fullName: any;
  email: any;
  countryCode: number = 91;
  userType: any = 'customer';
  display: any;
  resendOtp: boolean = false;
  displayTimer: boolean = false;
  notification: any = GlobalConstants.notification;

  @Input() wrapperClasses: string[] = []

  @Output() selectedCityChange = new EventEmitter<string>();

  CITIES = [
    {
      id: 1,
      name: 'Delhi'
    },
    {
      id: 2,
      name: 'Shimla'
    },
    {
      id: 3,
      name: 'Punjab'
    },
    {
      id: 4,
      name: 'Jaipur'
    },
    {
      id: 5,
      name: 'Manali'
    },
    {
      id: 6,
      name: 'Sikkim'
    },
    {
      id: 7,
      name: 'udaipur'
    }, {
      id: 8,
      name: 'Jaisalmer'
    },
    {
      id: 9,
      name: 'amritsar'
    }
  ];
  isMobileView = false;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth_service: AuthService,
    private authService: SocialAuthService,
    private headrerService: HeaderService,
    private messageService1: MessageService,
    private breakpointObserver: BreakpointObserver,
    public resSidebarService: ResSidebarService,
  ) {

    this.authService.authState.subscribe((user) => {
      if (user) {
        // console.log('Console log social google response -------->>>>>>>', user);
      }
    });
    this.auth_service.isLoggedIn().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

  }

  ngOnInit(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.userData = this.auth_service.getUserData();
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.SignUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      fullname: ['', Validators.required],
    });
    this.MobileForm = this.formBuilder.group({
      mobile: ['', Validators.required],
    });

    this.breakpointObserver
      .observe(['(max-width: 767px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isMobileView = true;
        } else {
          this.isMobileView = false;
        }
      });
    this.router.events.subscribe((event: any) => {
      console.log('event-', event)
      if (event.routerEvent.url && event.routerEvent.url.includes('list')) {
        this.showHotelSearch = false;
        this.currentRoute = '/list';
      } else {
        this.showHotelSearch = false;
        this.currentRoute = '';
      }
    });
  }

  closeResult: string | undefined;

  signInWithGoogle(): void {
    this.authService.signIn('google').then((user) => {
      console.log('google data', user);
    });
  }


  onCitySelected(cityName: string) {
    this.selectedCityChange.emit(cityName);
  }

  open(content: any) {
    this.modalService.open(content, { windowClass: 'hostmodal' });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
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
  signUp(): void {
    if (this.SignUpForm.valid) {
      const { email, fullname } = this.SignUpForm.value;
      this.email = email;
      this.fullName = fullname;
      this.modalService.open(this.otpModal, { centered: true });
    } else {
      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Please Enter Your Full Name & Valid Email Id' });

      //alert('Please Enter Your Full Name & Valid Email Id')
    }
  }
  sendOtp() {
    if (this.MobileForm.valid) {
      const { mobile } = this.MobileForm.value;
      this.mobile = mobile;
      this.auth_service.sendOtp(this.countryCode, this.mobile, this.email, this.fullName, this.userType).subscribe(
        (response: any) => {
          if (response.success) {
            this.modalService.open(this.otpConfirmModal, { centered: true });
            this.start(1);
          } else {
            //alert(response.message);
            this.messageService1.add({ severity: 'error', summary: 'Error', detail: response.message });

          }
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );

    } else {
      //alert('Please Enter Mobile Number')
      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Please Enter Mobile Number' });

    }
  }
  validateOtp(otp: any) {
    this.otp = otp;
    if (otp.length == 6) {
      this.auth_service.validateOtp(this.countryCode, this.mobile, otp).subscribe((response: any) => {
        if (response.success) {
          this.modalService.dismissAll('Success Login');
          this.router.navigate(['/changepassword']);
        }
      })
    }
  }

  login(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.auth_service
        .login(username, password, this.calculateExpirationTimeUntilMidnight())
        .subscribe((data) => {
          if (data.success == true && data.data.user.userType == 'customer') {
            this.modalService.dismissAll('Success Login');
            this.userData = data;
            if (this.isLoggedIn) {
              this.auth_service.userCount().subscribe((response: any) => {
                if (response.success) {
                  GlobalConstants.notification = response.data.notifications;
                  this.notification = response.data.notifications;
                  // console.log('Noti call--', GlobalConstants.notification)
                }
              })
            }
          }
          // Handle successful login redirection or other logic
          //console.log('new login data', data);
        });
    }
  }
  logout(): void {
    this.auth_service.logout().subscribe(() => {
      // Handle successful logout redirection or other logic
    });
  }
  redirectPage(data: any) {
    const dynamicRoute = `/${data}`;
    this.router.navigate([dynamicRoute]);
  }
  onOtpChange(otp: any) {
    this.otp = otp;
  }

  getLastFourDigits(): string {
    let number = this.mobile.toString();
    return `******${number.slice(-4)}`;
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

  openLogin() {
    this.router.navigate(['/login']);
  }

  gotoNext(key?) {
    if (this.isMobileView) {
      this.toggleSidebar(true);
    } else {
      this.router.navigate(['/profile'], { queryParams: { active: key ? key : 'MyProfile' } });
    }
  }

  toggleSidebar(isOpen) {
    this.resSidebarService.setSidebar(isOpen);

    let body = document.body;
    if (isOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'auto';
    }
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.currentRoute === '/list') {  // Check if the current route is '/list'
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

      // Check if the user has scrolled down more than 50 pixels
      if (scrollTop > 10) {
        this.isScrolled = true;  // Hide the header when scrolled
      } else {
        this.isScrolled = false;  // Show the header when not scrolled

        // Reset the hotel search component when scrolling to the top
        if (this.showHotelSearch) {
          this.showHotelSearch = false;
        }
      }
    }
  }

  onSearchChange(event) {
    if (event) {
      setTimeout(() => {
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });
      }, 0);
    }
  }
  toggleHotelSearch() {
    this.showHotelSearch = !this.showHotelSearch;
  }
}
