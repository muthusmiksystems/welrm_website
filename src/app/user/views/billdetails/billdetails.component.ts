import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetroomService } from '../getroom/getroom.service';
import { BilldetailsService } from './billdetails.service';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import _ from 'lodash';

declare var Razorpay: any;


@Component({
  selector: 'app-billdetails',
  templateUrl: './billdetails.component.html',
  styleUrls: ['./billdetails.component.scss'],
})
export class BilldetailsComponent implements OnInit {
  @ViewChild('myInput') myInput: ElementRef | any;
  receivedData: any;
  bookingFromDate: Date;
  bookingToDate: Date;
  bookingStatus: any = "0";
  breakFastPrice: any | null;
  commision_percent: any | null;
  confirmation_code: any | null;
  daily: any | null;
  discountValue: any | null;
  holdingHour: any | null;
  hotelId: any | null;
  hotelName: any | null;
  isBreakfastIncludes: any | null;
  is_paid: any | null;
  numberOfDays: any | null;
  price: any | null;
  roomId: number | undefined;
  roomPrice: any | null;
  roomQuantity: number = 1;
  roomType: any | null;
  userId: any | null;
  userFullName: any | null;
  userType: any | null;
  userEmail: any | null;
  couponValue: string = '';
  couponValidationError: string = '';
  isCouponAplied: boolean = false;
  totalPrice: any | null;
  selectedPaymentTypeId: any = '';
  
  paymentTypes: any = [];
  isLoggedIn = false;

  selectedBed: any = [
    { id: 'largeBed', name: 'Large Bed', value: 'largeBed'},
    { id: 'twinBed', name: 'Twin Bed', value: 'twinBed'},
    { id: 'onHighFloor', name: 'Room on a High Floor', value: 'onHighFloor'},
    { id: 'hotelTransfer', name: 'Hotel Transfer', value: 'hotelTransfer'},
    { id: 'smokingRoom', name: 'Smoking Room', value: 'smokingRoom'},
  ]
  paymentMode = 'creditdebit';
  payment = [
    { id: 1, option: 'visa', value: 'visa' },
    { id: 2, option: 'master card', value: 'master-card' },
    { id: 3, option: 'american express', value: 'american-express' },
    { id: 4, option: 'jcb', value: 'jcb' },
    { id: 5, option: 'Paypal', value: 'Paypal' },
  ]
  selectedPayment = '';
  stepper: any = [
    {step: 1, label: 'Customer information', progress: '0%', active: true, complete: true},
    {step: 2, label: 'Payment information', progress: '50%', active: false, complete: false},
    {step: 3, label: 'Booking is confirmed!', progress: '100%', active: false, complete: false},
  ];
  activeStep = 0;
  userData: any;
  userForm: FormGroup;
  bookingSuccess: any;
  isChecked: boolean = false;
  additionalRequest: any = new FormControl('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: GetroomService,
    private billservice: BilldetailsService,
    private cd: ChangeDetectorRef,
    private messageService1: MessageService,
    private modalService: NgbModal,
    private auth_service: AuthService,
    private formBuilder: FormBuilder,
  ) {
    this.auth_service.isLoggedIn().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    
    this.paymentTypes = [
      { name: "Pay At Hotel", id: 'cod' },
      { name: "Pay Full Amount", id: 'online-payment' }
    ];

    this.userForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userData = this.auth_service.getUserData();
    if (this.userData?.data?.user) {
      this.userForm.patchValue(this.userData.data.user);
    }
    this.dataService.getApiData().subscribe((data) => {
      if (data != null) {
        this.bookingFromDate = data.bookingFromDate;
        this.bookingToDate = data.bookingToDate;
        this.breakFastPrice = data.breakFastPrice;
        this.daily = data.daily;
        this.holdingHour = data.holdingHour;
        this.hotelId = data.hotelId;
        this.hotelName = data.hotelName;
        this.isBreakfastIncludes = data.isBreakfastIncludes ? 1 : 0;
        this.is_paid = 'no';
        this.numberOfDays = data.numberOfDays;
        this.price = this.getTotal();
        this.roomId = data.roomId;
        this.roomPrice = _.ceil(data.roomPrice);
        this.roomQuantity = Number(data.roomQuantity);
        this.roomType = data.roomType;
        this.discountValue = this.getDiscount();
        this.userId = data.userId;
        this.userFullName = data.userFullName;
        this.userEmail = data.userEmail;
        this.userType = data.userType;
        this.confirmation_code = data.confirmation_code;
        this.commision_percent = data.commision_percent;

        this.receivedData = data;
        this.receivedData.guest = parseInt(this.receivedData.adults) + parseInt(this.receivedData.childs);

        let checkin = new Date(data.bookingFromDate);
        this.receivedData.cancelFromDate = new Date(checkin.getTime() - (24*60*60*1000));
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  getDiscount() {
    let price = this.totalPrice;
    if (this.isCouponAplied) {
      return _.ceil((price * 20) / 100);
    }
    return 0;
  }
  getSubtotal() {
    let price = 0;
    price += this.roomPrice * this.roomQuantity * this.numberOfDays;
    if (this.isBreakfastIncludes) {
      price += this.breakFastPrice * this.roomQuantity * this.numberOfDays;
    }
    if (this.isCouponAplied) {
      price -= this.getDiscount();
    }
    this.totalPrice = price;
    return _.ceil(price);
  }
  getTotal() {
    let price = 0;
    price += this.roomPrice * this.roomQuantity * this.numberOfDays;
    if (this.isBreakfastIncludes) {
      price += this.breakFastPrice * this.roomQuantity * this.numberOfDays;
    }
    if (this.isCouponAplied) {
      price -= this.getDiscount();
    }
    price += this.getTax();
    this.totalPrice = price;
    return _.ceil(price);
  }
  getTax() {
    let price = 0;
    price += this.roomPrice * this.roomQuantity * this.numberOfDays;
    if (this.isCouponAplied) {
      price -= this.getDiscount();
    }
    let tax = (price / 100) * 12;
    return _.ceil(tax);
  }

  checkCoupon() {
    this.couponValue = this.myInput.nativeElement.value;
    if (this.couponValue.length === 6) {
      this.couponValidationError = '';
      this.billservice
        .CouponCheck(this.couponValue)
        .subscribe((response: any) => {
          if (response.code == '200') {
            if (!response.success) {
              this.couponValidationError = response.message;
              // this.messageService1.add({ severity: 'error', summary: 'Error', detail: response.message });

            } else {
              this.isCouponAplied = true;
            }
          } else if (response.code == '500') {
            if (response.message) {
              this.couponValidationError = response.message;
              // this.messageService1.add({ severity: 'error', summary: 'Error', detail: response.message });

            } else {
              this.couponValidationError = 'Something went wrong!';
              // this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
            }
          } else {
            this.couponValidationError = 'Something went wrong!';
            // this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
          }
        });
    } else {
      this.couponValidationError = 'Please enter a valid 6-digit code.';
    //  this.messageService1.add({ severity: 'error', summary: 'Error', detail: this.couponValidationError });

    }
  }
  couponUsed(code: any) {
    if (this.isCouponAplied) {
      this.billservice.CouponApply(code).subscribe((response: any) => {
        if (response.code == '200') {
          if (!response.success) {
            //alert(response.message);
            this.messageService1.add({ severity: 'error', summary: 'Error', detail: response.message });

          } else {
            this.isCouponAplied = true;
          }
        } else if (response.code == '500') {
          if (response.message) {
           // alert(response.message);
           this.messageService1.add({ severity: 'error', summary: 'Error', detail: response.message });

          } else {
           // alert('Something went wrong!');
           this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });

          }
        } else {
          //alert('Something went wrong!');
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });

        }
      });
    } else {
    }
  }

  book() {
    if (this.userType == 'owner') {
      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'You are Logged in with hotel owner so you can not book' });
    } else {
      if (this.userEmail == null && this.userFullName == null) {
        this.router.navigate(['/profile'], { queryParams: { active: 'MyProfile' } })
      } else {
        if (this.selectedPaymentTypeId == '') {
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Please select at least one payment type' });
        } else {
          if (this.selectedPaymentTypeId == 'cod') {
            this.billservice
              .BookingHotelRoom(
                this.bookingFromDate,
                this.bookingToDate,
                this.breakFastPrice,
                this.daily,
                this.holdingHour,
                this.hotelId,
                this.hotelName,
                this.isBreakfastIncludes,
                this.is_paid,
                this.numberOfDays,
                this.getTotal(),
                this.roomId,
                this.roomPrice,
                this.roomQuantity,
                this.roomType,
                this.getDiscount(),
                this.userId,
                this.confirmation_code,
                this.commision_percent,
                this.bookingStatus,
                null
              )
              .pipe(
                catchError((error: any) => {
                  // Handle the error here, e.g., display an error message
                  console.error('Error occurred:', error);
                  this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Booking Error Check Console for details' });

                  // throw error;
                  return []; // Return an empty array or a default value to handle the error gracefully
                })
              )
              .subscribe((response: any) => {
                if (response.success) {
                  window.scroll(0, 0);
                  this.bookingSuccess = response.data;
                  this.nextStepper(2, true);
                  setTimeout(() => {
                    this.router.navigate(['/profile'], { queryParams: { active: 'MyBookings' }, replaceUrl: true });
                  }, 7000);
                  // this.router.navigate(['/booksuccess'], { state: { data: response } });
                } else {
                  this.messageService1.add({ severity: 'error', summary: 'Error', detail: response.message });
                }
              });
          } else if (this.selectedPaymentTypeId == 'online-payment') {
            var RazorPayOption: any;
            RazorPayOption = {
              description: this.hotelName,
              currency: 'INR',
              amount: this.getTotal() * 100, // 2000 paise = INR 20
              key: "rzp_live_WqbUf1Fe9qGtNX",
              name: this.hotelName,
              image: "../../../assets/imgs/logo2.png",
              prefill: {
                name: this.userFullName,
                email: this.userEmail,

              },
              notes: {
              },
              theme: {
                color: "#006a4e"
              },
              modal: {
                ondismiss: () => {
                  const body = document.getElementsByTagName('body')[0];
                  body.style.overflow = "auto";
                  this.backStep(0);
                }
              }
            }

            RazorPayOption['handler'] = this.razorPaySuccessHandler.bind(this);
            const successCallback = (paymentId: any) => {
              console.log('paymentId: ', paymentId);
              //alert (paymentId);
            }
            const faliurCallback = (error: any) => {
              console.log('error: ', error);
              //alert(error);
            }
            Razorpay.open(RazorPayOption, successCallback, faliurCallback)
          }
        }
      }
    }
  }

  razorPaySuccessHandler(response: any) {
    // alert(response.razorpay_payment_id);
    this.cd.detectChanges();
    if (response.razorpay_payment_id != '' || response.razorpay_payment_id != null || response.razorpay_payment_id != 'null') {
      this.billservice
        .BookingHotelRoom(
          this.bookingFromDate,
          this.bookingToDate,
          this.breakFastPrice,
          this.daily,
          this.holdingHour,
          this.hotelId,
          this.hotelName,
          this.isBreakfastIncludes,
          //this.is_paid,
          true,
          this.numberOfDays,
          this.getTotal(),
          this.roomId,
          this.roomPrice,
          this.roomQuantity,
          this.roomType,
          this.getDiscount(),
          this.userId,
          this.confirmation_code,
          this.commision_percent.toString(),
          this.bookingStatus,
          response.razorpay_payment_id
        )
        .pipe(
          catchError((error: any) => {
            // Handle the error here, e.g., display an error message
            console.error('Error occurred:', error);
            this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Booking Error Chcek Console for details' });

            // You can also re-throw the error if needed
            // throw error;
            return []; // Return an empty array or a default value to handle the error gracefully
          })
        )
        .subscribe((response: any) => {
          if (response.success) {
            window.scroll(0, 0);
            this.bookingSuccess = response.data;
            this.nextStepper(2, true);
            setTimeout(() => {
              this.router.navigate(['/profile'], { queryParams: { active: 'MyBookings' }, replaceUrl: true });
            }, 7000);
            // this.router.navigate(['/booksuccess'], { state: { data: response } });
          } else {
            this.messageService1.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        });
    }

  }

  // open(content: any) {
  //   this.modalService
  //   .open(content, { ariaLabelledBy: 'modal-basic-title' })
  //   .result.then(
  //     (result: any) => {
  //       this.closeResult = `Closed with: ${result}`;
  //     },
  //     (reason: any) => {
  //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //     }
  //   );
  // }
  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }

  nextStepper(index, islast?) {
    this.activeStep = index;
    this.stepper?.forEach((el, inx) => {
      if (islast) el.complete = true;
      if (index === inx && !el?.active) {
        el.active = true;
        el.complete = true;
      } else {
        el.active = false;
      }
      return el;
    });
  }

  backStep(index) {
    this.activeStep = index;
    this.stepper[index + 1].active = false;
    this.stepper[index + 1].complete = false;
    this.stepper[index].active = true;
  }

  gotoedit() { 
    this.router.navigate(['room-details', 'getroom'], { queryParams: { hotelId: this.hotelId, hotelName: this.hotelName }})
  }

  openPayHotel(content: any) {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
    } else {
      this.modalService.open(content, { windowClass: 'pay-hotel-modal' }).result.then(
        (result: any) => {
        },
        (reason: any) => {
          if (reason === 'PayHotel') {
            this.setBookingKey(this.paymentTypes[0].id);
          }
        }
      );
    }
  }

  openPayNow(content: any) {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
    } else {
      this.modalService.open(content, { windowClass: 'pay-now-modal', backdrop: 'static' }).result.then(
        (result: any) => {
        },
        (reason: any) => {
          if (reason === 'PayNow') {
            this.setBookingKey(this.paymentTypes[1].id);
          }
        }
      );
      
      setTimeout(() => {
        this.modalService.dismissAll('PayNow');
        this.nextStepper(1);
      }, 5000);
    }
  }

  setBookingKey(key) {
    this.selectedPaymentTypeId = key;
    this.book();
  }

  openLogin() {
    this.receivedData.commision_percent = null;
    this.receivedData.userId = null;
    this.receivedData.userFullName = null;
    this.receivedData.userEmail = null;
    this.receivedData.userType = null;

    this.dataService.setApiData(this.receivedData);
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
  }

  gotoLocation() {
    if (this.receivedData?.lat && this.receivedData?.log) {
      let url = `http://google.com/maps/place/${this.receivedData.lat},${this.receivedData.log}`;
      window.open(url, '_blank');
    }
  }
}
