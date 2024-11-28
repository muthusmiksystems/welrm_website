import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetroomService } from './getroom.service';
import { AuthService } from 'src/app/auth.service';
import { RatingModule } from 'primeng/rating';
import { HoteldetailsService } from '../hoteldetails/hoteldetails.service';
import { PrimeNGConfig } from 'primeng/api';
import { DataMessageService } from 'src/app/message.service'
import { MessageService } from 'primeng/api';
import _ from 'lodash';


import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { WishlistServiceService } from '../wishlist/wishlist.service';
import { finalize } from 'rxjs';
import { BookinghistoryService } from '../bookings/bookinghistory.service';
import {IMAGES} from '../../../shared/constants/images.constant'

@Component({
  selector: 'app-getroom',
  templateUrl: './getroom.component.html',
  styleUrls: ['./getroom.component.scss'],

})
export class GetroomComponent implements OnInit {
  public images=IMAGES;
  private tokenKey = 'access_token';
  private userKey = 'user_data';
  roomFilterData: any[] = [];
  roomImages: any[] = [];
  roomDeatils: any = [];
  defaultrating = 3;
  roomDeatilsInner: any = [];
  isScrolled = false;
  sroomImages: Array<Object> = [];
  userRating: number = 0;
  productReview: string = '';
  recommendProduct: boolean = false;
  roomComplementarities: any[] = [];
  Amenities: boolean = false;

  currentImageIndex: number = 0;
  isFacilityVisible = true;
  isDatePickerVisible = false;
  guestCapacity: any = null;
  discount: any = null;
  numOfAvailableRooms: any = null;
  roomTypeId: number | undefined;

  PProomTypeId: number | undefined;

  error: boolean = false;
  isChecked: boolean = false;
  //booking var
  fromDate: string = ''; // get from input
  toDate: string = ''; // get from input
  breakFastPrice: any = 200; // get from api --Done
  daily: any = null; // -- Done from dailySlotPrice api data
  holdingHour: any = null; // Done
  hotelId: number | undefined; // Done get from api
  hotelName: any; // Done
  isBreakfastIncludes: boolean | undefined; // done from api
  is_paid: any = null; // no need now ---for payment gateway
  numberOfDays: number = 0; // input Done
  roomId: any | null; // data exist on api but i assign from params
  roomPrice: any = null; // Done from api
  roomQuantity: number = 1; // input
  roomType: any | null; //api
  discountValue: any = null; // get user data
  userId: any = null;
  userFullName: any = null;
  userType: any = null;
  userEmail: any = null;
  commision_percent: number | null;
  confirmation_code: number = Math.floor(100000 + Math.random() * 900000); // random 6 dight code
  bookingStatus: any = 0; //always zero if hotel owner accept then it 1
  price: any | null; //will assign in next page

  checkInOut: boolean = false;

  paramiterForhotelSearch: any;
  cityOrhotelOrneighborhood: any = '';
  checkInDate: any = '';
  checkOutDate: any = '';
  adults: any = 1;
  childs: any = 0;
  room: any = 1;
  night: any = 0;

  minimumDate = new Date();
  minimumDatecIn = new Date();
  roomTypes: any[] = [];
  address: any = ''
  city_responsive = [
    {
      breakpoint: '1199px',
      numVisible: 4,
      numScroll: 1
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  selectRoom: any = 0;
  selectRoomTypeId: any = 0;

  form = new FormGroup({
    checkInDate: new FormControl("", [Validators.required]),
    checkOutDate: new FormControl("", [Validators.required]),
    isCheckedB: new FormControl(false, [Validators.required]),
  });

  originalPrice = 0;

  roomAvailability: boolean = false;

  highlight = [
    { icon: this.images.FREEWIFI, title: 'Free Wifi', name: 'WiFi' },
    { icon: this.images.HYGIENEPLUS, title: 'Hygiene Plus', name: 'Sanitizer' },
    { icon: this.images.HOUSEKEEPING, title: 'Daily housekeeping', name: 'HouseKeeping' },
    { icon: this.images.BREAKFAST, title: 'Breakfast', name: 'In-room Dining' },
    { icon: this.images.AC, title: 'AC', name: 'AC' },
    { icon: this.images.POWERBACKUP, title: 'Power Backup', name: 'Power Backup' },
  ]
  policyList = [
    { policyHead: 'Welcome to Welrm', policyDisc: 'Couples are not only welcome but encouraged to indulge in romantic getaways at our stunning retreat.' },
    { policyHead: 'Furry Friends Stay at Home', policyDisc: 'Couples are not only welcome but encouraged to indulge in romantic getaways at our stunning retreat.' },
    { policyHead: 'Connect with Ease', policyDisc: 'Embrace the digital age with complimentary Wi-Fi access throughout your stay, ensuring seamless connectivity.' },
    { policyHead: 'Serenity Hours', policyDisc: 'From 10:00 PM to 7:00 AM, immerse yourself in a world of tranquility as we ensure uninterrupted rest for our cherished guests.' },
  ]
  closeResult: string | undefined;

  blogImages: any = {
    list: []
  };
  isMobileView = false;
  cancelFromDate: Date;

  constructor(
    private route: ActivatedRoute,
    private hotelfilter: GetroomService,
    private router: Router,
    private homedetailsService: HoteldetailsService,
    private primengConfig: PrimeNGConfig,
    private messageService: DataMessageService,
    private messageService1: MessageService,
    private modalService: NgbModal,
    private breakpointObserver: BreakpointObserver,
    private wishlistService: WishlistServiceService,
    private book_history: BookinghistoryService,
  ) {

    this.paramiterForhotelSearch = localStorage.getItem('paramiterForhotelSearch');
    if (this.paramiterForhotelSearch != null) {

      const paramiterForhotelSearchArray = this.paramiterForhotelSearch.split("@#$&");
      this.cityOrhotelOrneighborhood = paramiterForhotelSearchArray[0]
      this.fromDate = paramiterForhotelSearchArray[1]
      this.toDate = paramiterForhotelSearchArray[2]
      this.adults = paramiterForhotelSearchArray[3]
      this.childs = paramiterForhotelSearchArray[4]
      this.room = paramiterForhotelSearchArray[5]

      this.form.patchValue({
        checkInDate: this.fromDate,
        checkOutDate: this.toDate
      });
    }

    this.messageService.getMessage().subscribe(message => {
      if (message.event == 'paramiterForhotelSearchh') {
        this.paramiterForhotelSearch = message.data;

        const paramiterForhotelSearchArray = this.paramiterForhotelSearch.split("@#$&");
        this.cityOrhotelOrneighborhood = paramiterForhotelSearchArray[0]
        this.checkInDate = paramiterForhotelSearchArray[1]
        this.checkOutDate = paramiterForhotelSearchArray[2]
        this.adults = paramiterForhotelSearchArray[3]
        this.childs = paramiterForhotelSearchArray[4]
        this.room = paramiterForhotelSearchArray[5]

        this.form.patchValue({
          checkInDate: this.checkInDate,
          checkOutDate: this.checkOutDate
        });
      }
    })

    if (this.form.value.checkInDate && this.form.value.checkOutDate) {
      let checkIn = this.formatDate(this.form.value.checkInDate)
      let checkOut = this.formatDate(this.form.value.checkOutDate)
      setTimeout(() => {
        this.numberOfDays = this.datediff(checkIn, checkOut)
      }, 1000);
    }
  }



  selectCheckIndate(v: any) {
    this.minimumDatecIn = v;

    this.form.patchValue({
      checkOutDate: ''
    });
    this.numberOfDays = 0

    this.checkInOut = false;

  }

  daysCount(e: any) {
    let checkOut = this.formatDate(this.form.value.checkOutDate)

    if (this.form.value.checkInDate == checkOut) {
      this.checkInOut = true
      //alert('CheckIn and CheckOut date can not be same')
      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'CheckIn and CheckOut date can not be same' });

    } else {
      this.checkInOut = false
      setTimeout(() => {
        this.numberOfDays = this.datediff(this.form.value.checkInDate, checkOut)

      }, 1000);
    }




  }

  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }


  submit(item:any) {
    if (this.selectRoomTypeId == 0) {
      //alert("Please select Room type")
      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Please select Room type' });

    }
    else if (this.form.controls.checkInDate.status == 'INVALID') {
      //alert('Check In field is required')
      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Check In field is required' });

    } else if (this.form.controls.checkOutDate.status == 'INVALID') {
      //alert('Check Out field is required')
      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Check Out field is required' });

    } else if (this.checkInOut) {
      //alert('CheckIn and CheckOut date can not be same')
      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'CheckIn and CheckOut date can not be same' });

    } else {

      if (this.roomAvailability) {
        console.log("yuva");
        this.goToSecondPage(item)
      } else {
        //alert(this.roomDeatilsInner.hotelName+" Room is not available")
        this.messageService1.add({ severity: 'error', summary: 'Error', detail: this.roomDeatilsInner.hotelName + " Room is not available" });


      }

    }
  }

  selectRoomF(originalPrice: any, includeDiscountroomPrice: any, name: any, id: any, roomComplementarities: any, PProomTypeId: any) {
    this.roomAvailability = false;
    this.roomDeatilsInner.hotelName = name;

    this.onGethotelFilter(this.hotelId, this.PProomTypeId);
    setTimeout(() => {

      if (this.roomAvailability) {
        this.roomComplementarities = [];
        this.PProomTypeId = PProomTypeId;
        this.selectRoomTypeId = id;
        this.roomId = id;
        this.roomDeatilsInner.hotelName = name;
        this.roomPrice = includeDiscountroomPrice;
        this.originalPrice = originalPrice;
        this.discountValue = originalPrice - includeDiscountroomPrice;

        this.roomComplementarities = roomComplementarities.roomComplementaries;
        if (this.roomComplementarities.length == 0) {
          this.Amenities = false;
        } else if (this.roomComplementarities.length > 0)
          this.Amenities = true;

      } else {
        //alert(this.roomDeatilsInner.hotelName+" Room is not available")
        this.messageService1.add({ severity: 'error', summary: 'Error', detail: this.roomDeatilsInner.hotelName + " Room is not available" });

      }

    }, 2000);


  }

  parseDate(str: any) {
    var mdy = str.split('-');
    return new Date(mdy[2], mdy[0] - 1, mdy[1]);
  }

  datediff(first: any, second: any) {


    let date1 = new Date(first);
    let date2 = new Date(second);

    let Difference_In_Time = date2.getTime() - date1.getTime();
    let Difference_In_Days
    return Difference_In_Days = Math.round
      (Difference_In_Time / (1000 * 3600 * 24));



  }


  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 767px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isMobileView = true;

        } else {
          this.isMobileView = false;
        }
      });
    let user = this.getUserData();
    if (user) {
      this.userId = user.data?.user?.id;
      this.userFullName = user.data?.user?.fullName;
      this.userType = user.data?.user?.userType;
      this.userEmail = user.data?.user?.email;
      this.commision_percent = user.data?.commission_percentage;
    }

    this.primengConfig.ripple = true;
    this.route.queryParams.subscribe(qParams => {
      const hotelId = qParams['hotelId'];
      //  const roomTypeId = qParams['roomTypeId'];


      //this.roomId = Number(roomTypeId);


      //this.roomType = qParams['roomType'];
      this.hotelName = qParams['hotelName'];

      // this.onGethotelFilter(hotelId, roomTypeId);

      this.onGetdetails(hotelId);
    });
    let checkin: any = this.form.value.checkInDate;
    if (checkin) {
      this.cancelFromDate = new Date(new Date(checkin).getTime() - (24 * 60 * 60 * 1000));
    }
  }


  adultIncreseF() {
    this.adults = this.adults * 1 + 1;
  }

  adultDeceaseF() {
    if (this.adults > 1) {
      this.adults = this.adults - 1;
    } else {
      this.adults = 1
    }

  }

  childIncreseF() {
    this.childs = this.childs * 1 + 1;

  }

  childDeceaseF() {
    if (this.childs > 0) {
      this.childs = this.childs - 1;
    } else {
      this.childs = 0
    }
  }


  roomIncreseF() {

    this.roomAvailability = false;
    this.room = this.room * 1 + 1;

    this.onGethotelFilter(this.hotelId, this.PProomTypeId);

    setTimeout(() => {

      if (this.roomAvailability) {

      } else {
        //alert(this.roomDeatilsInner.hotelName+" Room is not available")
        this.messageService1.add({ severity: 'error', summary: 'Error', detail: this.roomDeatilsInner.hotelName + " Room is not available" });

      }

    }, 1000);

  }

  roomDeceaseF() {

    if (this.room > 1) {
      this.room = this.room - 1;
    } else {
      this.room = 1
    }

    this.roomAvailability = false;
    this.onGethotelFilter(this.hotelId, this.PProomTypeId);

    setTimeout(() => {

      if (this.roomAvailability) {

      } else {
        //alert(this.roomDeatilsInner.hotelName+" Room is not available")
        this.messageService1.add({ severity: 'error', summary: 'Error', detail: this.roomDeatilsInner.hotelName + " Room is not available" });

      }

    }, 1000);


  }


  onGetdetails(id: any) {
    if (id) {
      this.homedetailsService.getHotelDetails(id).subscribe((data: any) => {

        this.hotelId = data.data.rows[0].id;
        this.roomDeatils = data.data;
        this.roomDeatilsInner = data.data.rows[0];
        //this.roomId = data.data.result[0].id;

        let priceSetArray: any[] = []

        this.roomDeatilsInner.hotelRooms.forEach((ele: any, ind: any) => {
          ele.newPrice = _.ceil(ele.hour24Price - (ele.hour24Price * ele.discount) / 100);
          ele.tax = _.ceil((ele.newPrice / 100) * 12);
          priceSetArray.push(ele.hour24Price);
        });


        setTimeout(() => {
          let min = priceSetArray.reduce((a, b) => Math.min(a, b))
          this.roomDeatilsInner.hotelRooms.forEach((ele: any, ind: any) => {
            if (min == ele.hour24Price) {

              this.PProomTypeId = ele.roomType.id
              this.onGethotelFilter(this.hotelId, this.PProomTypeId);


              setTimeout(() => {

                if (this.roomAvailability) {
                  this.originalPrice = min
                  this.roomPrice = min - (min * ele.discount) / 100;
                  this.discount = ele.discount;
                  this.selectRoomTypeId = ele.roomId
                  this.roomId = ele.roomId;
                  this.selectRoom = ele;
                  // this.selectRoom = {
                  //   ...ele,
                  //   checkIn: this.formatTime(ele.checkIn)
                  // };
                  console.log('ele', ele)
                  this.selectRoom.checkIn = this.formatTime(this.selectRoom.checkIn)
                  this.selectRoom.checkOut = this.formatTime(this.selectRoom.checkOut)
                  this.selectRoom.groupRoomComplementaries = this.groupByType();
                  this.roomComplementarities = ele.roomComplementaries;
                  if (this.roomComplementarities.length == 0) {
                    this.Amenities = false;
                  } else if (this.roomComplementarities.length > 0)
                    this.Amenities = true;
                } else {
                  //alert(ele.roomType.name+" Room is not available")
                  this.messageService1.add({ severity: 'error', summary: 'Error', detail: ele.roomType.name + " Room is not available" });
                }
              }, 1000);
            }
          });
        }, 1000);
        this.roomTypes = data.data.room_types;
        this.address = data.data.rows[0].address;

        this.roomImages = data.data.rows[0].images.map((item: { url: any }) => item.url
        );
      });
    } else {
    }
  }

  formatTime(timeString: any): string {
    if (typeof timeString === 'string' && timeString.includes(':')) {
      // If timeString is just a time (e.g., "12:00:00")
      const [hours, minutes] = timeString.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    }

    // Otherwise, if it's a full date string or timestamp
    const date = new Date(timeString);
    if (isNaN(date.getTime())) {
      // If date is invalid, handle the error
      console.error('Invalid date:', timeString);
      return 'Invalid Time';
    }

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  getUserData() {
    const response = localStorage.getItem(this.userKey);
    return response ? JSON.parse(response) : null;
  }
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  formvalidation() {
    if (this.fromDate.length < 2) {
      //alert('Please Select Booking Start Date');
      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Please Select Booking Start Date' });

      return false;
    }
    if (this.toDate.length < 2) {
      //alert('Please Select Booking End Date');
      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Please Select Booking End Date' });

      return false;
    }
    if (this.error) {
      //alert('End date must be after start date.');
      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'End date must be after start date' });

      return false;
    } else {
      return true;
    }
  }


  onGethotelFilter(hotelId: any, roomTypeId: any) {
    if (hotelId && roomTypeId) {
      this.hotelfilter
        .getHotelFilter(hotelId, roomTypeId)
        .subscribe((data: any) => {

          let numOfBookedRooms = data.data.result[0].numOfBookedRooms;
          let totalNumOfRooms = data.data.result[0].totalNumOfRooms;
          let availableRoom = totalNumOfRooms * 1 - numOfBookedRooms * 1;
          if (availableRoom >= this.room) {
            this.roomAvailability = true;
          } else {
            this.roomAvailability = false;
          }


        });
    }
  }


  goToSecondPage(item:any) {
    console.log("itemsss",item)

    var price = this.roomPrice * this.room * this.night;
    if (this.form.value.isCheckedB == true) {
      this.price = (price * 1) * 1 + (this.breakFastPrice * this.room) * 1
    } else {
      this.price = price
    }

    // const dataToSend = {
    //   bookingFromDate: this.form.value.checkInDate,
    //   bookingToDate: this.form.value.checkOutDate,
    //   breakFastPrice: this.breakFastPrice,
    //   daily: null,
    //   holdingHour: null,
    //   hotelId: this.hotelId,
    //   hotelName: this.hotelName,
    //   isBreakfastIncludes: this.form.value.isCheckedB,
    //   is_paid: null,
    //   numberOfDays: this.numberOfDays,
    //   roomId: this.roomDeatilsInner.hotelRooms.roomId,
    //   roomPrice: this.roomPrice,
    //   roomQuantity: this.room,
    //   roomType: this.roomDeatilsInner.hotelName,
    //   discountValue: this.discountValue,
    //   userId: this.userId,
    //   userFullName: this.userFullName,
    //   userEmail: this.userEmail,
    //   userType: this.userType,
    //   confirmation_code: this.confirmation_code,
    //   commision_percent: this.commision_percent,
    //   bookingStatus: "0",
    //   price: this.price
    // };
    const dataToSend = {
      bookingFromDate: this.form.value.checkInDate,
      bookingToDate: this.form.value.checkOutDate,
      breakFastPrice: this.breakFastPrice,
      daily: null,
      holdingHour: null,
      hotelId: this.hotelId,
      hotelName: this.hotelName,
      isBreakfastIncludes: this.form.value.isCheckedB,
      is_paid: null,
      numberOfDays: this.numberOfDays,
      roomId: this.roomId,
      roomPrice: this.roomPrice,
      roomQuantity: this.room,
      // roomType: this.roomDeatilsInner.hotelName,
      discountValue: this.discountValue,
      userId: this.userId,
      userFullName: this.userFullName,
      userEmail: this.userEmail,
      userType: this.userType,
      confirmation_code: this.confirmation_code,
      commision_percent: this.commision_percent,
      bookingStatus: "0",
      price: this.price,


      rating: this.roomDeatils.rating,
      address: this.address,
      roomType: item?.roomType?.name,
      adults: this.adults,
      childs: this.childs,
      room: this.room,
      checkIn: item.checkIn,
      checkOut: item.checkOut,
      originalPrice: this.originalPrice,
      discount: this.discount,
      roomImages: item?.imageUrls,
      lat: this.roomDeatilsInner?.lat,
      log: this.roomDeatilsInner?.log,
    };
    console.log("dataToSenddataToSend",dataToSend);
    this.hotelfilter.setApiData(dataToSend);
    this.router.navigate(['/billdetails']);

  }

  moveSlider(indexChange: number) {
    const newIndex = this.currentImageIndex + indexChange;
    // Ensure the newIndex is within bounds
    if (newIndex >= 0 && newIndex < this.roomImages.length) {
      this.currentImageIndex = newIndex;
    }
  }
  hideFacility() {
    if (this.numOfAvailableRooms > 0) {
      this.isFacilityVisible = false;
      this.isDatePickerVisible = true;
    } else {
      //alert('Rooms Not Available');
      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Rooms Not Available' });

    }

  }
  showFacility() {
    this.isFacilityVisible = true;
    this.isDatePickerVisible = false;
  }

  increaseRoomQuantity() {
    if (this.roomQuantity < this.numOfAvailableRooms) {
      this.roomQuantity++;
    } else {
      // alert('Only' +' ' +this.roomQuantity +' ' +'Rooms Available For This Hotel');
      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Only' + ' ' + this.roomQuantity + ' ' + 'Rooms Available For This Hotel' });

    }
  }

  decreaseRoomQuantity() {
    if (this.roomQuantity > 1) {
      this.roomQuantity--;
    }
  }
  validateDateRange() {
    const fromDateObj = new Date(this.fromDate);
    const toDateObj = new Date(this.toDate);

    if (fromDateObj >= toDateObj) {
      this.error = true;
      this.numberOfDays = 0;
    } else {
      this.error = false;
      const timeDiff = toDateObj.getTime() - fromDateObj.getTime();
      this.numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
  }

  openModal(content: any, imgs: any) {
    this.blogImages.vindex = 0;
    this.blogImages.list = imgs;
    this.modalService.open(content, { windowClass: 'blogimage-modal' })
      .result.then(
        (result: any) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
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

  scrollToSection(dynamicKey) {
    const element: any = document.getElementById(dynamicKey);
    if (element) {
      const headerOffset = this.isMobileView ? 54 : 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }

  isComplementaries(name): boolean {
    return this.selectRoom?.roomComplementaries?.some(s => s.name === name);
  }

  onSearchQueryChange(event) {
    setTimeout(() => {
      this.router.navigateByUrl('/list', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/room-details/getroom'], { queryParams: { hotelId: this.hotelId, hotelName: this.hotelName } });
      })
    }, 1200);
  }

  groupByType() {
    const grouped = this.selectRoom?.roomComplementaries.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {});

    return Object.keys(grouped).map(type => ({
      type,
      child: grouped[type]
    }));
  }

  getCeilPrice(price) {
    return _.ceil(price);
  }

  postHotelData(result) {
    let payload = {
      user_id: this.userId,
      hotel_id: this.hotelId,
      room_id: result.roomId
    };
    if (!this.userId) {
      // this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Please login'});
      return;
    }
    if (result?.inWishlist) {
      result.isLoading = true;
      this.wishlistService.removeToWishlist(payload)
        .pipe(
          finalize(() => {
            result.isLoading = false;
          })
        )
        .subscribe((response: any) => {
          if (response?.success) {
            result.inWishlist = false;
            this.messageService1.add({ severity: 'error', summary: 'Success', detail: response?.message });
          } else {
            this.messageService1.add({ severity: 'error', summary: 'Error', detail: response?.message });
          }
        });
    } else {
      result.isLoading = true;
      this.wishlistService.addToWishlist(payload)
        .pipe(
          finalize(() => {
            result.isLoading = false;
          })
        )
        .subscribe((response: any) => {
          if (response?.success) {
            result.inWishlist = true;
            this.messageService1.add({ severity: 'success', summary: 'Success', detail: response?.message });
          } else {
            this.messageService1.add({ severity: 'error', summary: 'Error', detail: response?.message });
          }
        });
    }
  }

  gotoLocation() {
    if (this.roomDeatilsInner?.lat && this.roomDeatilsInner?.log) {
      let url = `http://google.com/maps/place/${this.roomDeatilsInner.lat},${this.roomDeatilsInner.log}`;
      window.open(url, '_blank');
    }
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    // Update isScrolled based on scroll position
    this.isScrolled = scrollTop >= 10 ? true : false;
  }
  submitReview() {
    const review = document.getElementById("productReview")
    this.book_history
      .rateHotel(
        this.hotelId,
        this.userRating,
        this.recommendProduct,
        this.productReview
      )
      // .pipe(
      //   catchError((error) => {
      //     // Handle errors if any of the API calls fail
      //     console.error('Rate Hotel API Error:', error);
      //     // You can return a fallback value or re-throw the error as needed
      //     // return [];
      //     throw error;
      //   }),
      //   finalize(() => {
      //     // This block will run after both API calls complete (success or error)
      //     // You can add finalization logic here
      //   })
      // )
      .subscribe((response: any) => {
        // Handle the data from all three APIs
        if (response.success) {
          this.modalService.dismissAll();
          this.messageService1.add({ severity: 'success', summary: 'Success', detail: response.message });
        } else {
          console.log('review submitted error ', response);
        }
      });
  }
  rating(event:any){
    console.log('event----',event)
    this.userRating=event.value
  }
  onReviewChange(event: any) {
    console.log('Review on change:', event.target.value); // Logs the final value after the change event
    this.productReview = event.target.value; // Optionally update the value manually
  }
}