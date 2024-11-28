import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { catchError, finalize } from 'rxjs';
import { BookinghistoryService } from './bookinghistory.service';
import { forkJoin } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import _ from 'lodash';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {IMAGES} from '../../../shared/constants/images.constant'
@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent implements OnInit {
  public images=IMAGES;
  productReview: string = '';
  recommendProduct: boolean = false;
  userRating: number = 0;
  hotelName: any | null;
  bookingId: any | null;
  hotelDetail: any;

  activeTab = 0; // Initialize the active tab index
  tabs: any[] = [
    {
      label: 'Active Bookings',
      slug: 'activeBookings',
      content: [],
    },
    {
      label: 'Booking History',
      slug: 'bookingHistory',
      content: [],
    },
  ];

  selectedType: any = null;

  reasons = [
    { name: 'Change of plans looking for other destinations', key: 'change-plan' },
    { name: 'Want to change the date postpone/prepone acoordingly', key: 'postpone' },
    { name: 'Booking error, mistakes in reservation details, such as dates, room type etc.', key: 'booking-error' },
    { name: 'Weather conditions, Changing weather effecting travel plans', key: 'w-effect' },
    { name: 'Others ', key: 'others' }
  ];
  userData: any;
  isLoading = false;

  constructor(
    private book_history: BookinghistoryService,
    private modalService: NgbModal,
    private messageService1: MessageService,
    private router: Router,
    private auth_service: AuthService,
  ) {}

  ngOnInit(): void {
    this.userData = this.auth_service.getUserData();
    this.getData();
    this.selectedType = this.reasons[0];
  }

  submitReview(bookingId: any) {
    this.book_history
      .rateHotel(
        bookingId,
        this.userRating,
        this.recommendProduct,
        this.productReview
      )
      .pipe(
        catchError((error) => {
          // Handle errors if any of the API calls fail
          console.error('Rate Hotel API Error:', error);
          // You can return a fallback value or re-throw the error as needed
          // return [];
          throw error;
        }),
        finalize(() => {
          // This block will run after both API calls complete (success or error)
          // You can add finalization logic here
        })
      )
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

  getData() {
    this.isLoading = true;
    this.book_history
      .getAllApiData()
      .pipe(
        catchError((error) => {
          // Handle errors if any of the API calls fail
          console.error('Booking History API Error:', error);
          // You can return a fallback value or re-throw the error as needed
          // return [];
          throw error;
        }),
        finalize(() => {
          this.isLoading = false;
          // This block will run after both API calls complete (success or error)
          // You can add finalization logic here
        })
      )
      .subscribe(([activeBookingData, bookingHistoryData]) => {
        // Handle the data from all three APIs
        this.tabs[0].content = activeBookingData.data.hotels.rows;
        this.tabs[1].content = bookingHistoryData.data.hotels.rows;
      });
  }

  toggleTab(tabIndex: number) {
    this.activeTab = tabIndex;
  }

  BookingCancel(hotelId: any, roomId: any) {
    this.book_history
      .cancelBooking(hotelId, roomId)
      .subscribe((response: any) => {
        if (response.success) {
          this.modalService.dismissAll();
          this.messageService1.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.getData();
        } else {
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Cancel Booking error' });
        }
      });
  }

  openModal(content: any, key: any, item: any) {
    this.selectedType = null;
    this.hotelDetail = item;
    if (content === 'ratingmodal') {
      this.hotelName = this.hotelDetail.hotelDetail.hotelName;
      this.bookingId = this.hotelDetail.id;
    }
    this.modalService.open(content, { windowClass: key === 'cancelmodal' ? 'bcancelation-modal' : 'brating-modal' });
  }

  gotoedit(item) {
    this.router.navigate(['room-details', 'getroom'], { queryParams: { hotelId: item?.hotelId, hotelName: item?.hotelDetail?.hotelName } })
  }

  getCeilPrice(price) {
    return _.ceil(price);
  }

  printInvoice(item) {
    const invoiceHtml: any = `<div class="invoice" id="invoice" style=" padding: 40px 50px 50px; min-width: 700px; background-color: #FFFFFF; margin:0 auto">
    <div class="in-logo" style="text-align: center; margin-bottom: 28px;">
        <img [src]="images.RED_LOGO" alt="">
    </div>
    <h1 style="font-family: 'Mona-Sans Bold'; font-size: 22px; font-weight: normal; line-height: 26px; text-align: center; margin-bottom: 28px;">Lorium Ipsum text Lorium Ipsum text Lorium Ipsum text</h1>
    <div class="in-boxs" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px;">
        <div class="boxs-inner" style="width: calc(50% - 17.5px); height: 184px; border-radius: 20px; background-color: #F1F5F999; display: flex; flex-direction: column;">
            <div class="box-total" style="padding: 20px; display: flex; flex-direction: column; border-bottom: 1px solid #0000001A; flex: 1;">
                <span style="font-family: 'Mona-Sans Regular'; font-size: 18px; line-height: 22px; color: #94A3B8; margin-bottom: 16px;">Grand Total</span>
                <label style="font-family: 'Mona-Sans Bold'; font-size: 18px; line-height: 32px; color: #4B5563;">${item?.price}</label>
            </div>
            <div class="pay-details" style="height: 52px; padding: 10px 20px;">
                <span style="font-family: 'Mona-Sans Regular'; font-size: 18px; line-height: 22px; color: #94A3B8;">Payment method :</span>
                <label style="font-family: 'Mona-Sans Bold'; font-size: 18px; line-height: 32px; color: #4B5563; margin-left: 10px;">${item?.is_paid === 'no' ? 'Pay At Hotel' : 'Razorpay'} </label>
            </div>
        </div>
        <div class="boxs-inner download-in" style="width: calc(50% - 17.5px); height: 184px; border-radius: 20px; background-color: #C42A250D; display: flex; flex-direction: column;">
            <div class="box-total" style="padding: 20px; display: flex; flex-direction: column; border-bottom: 1px solid #0000001A; flex: 1;">
                <label style="font-family: 'Mona-Sans Regular'; font-size: 18px; line-height: 22px; color: #94A3B8; margin-bottom: 16px;">Download</label>
                <label style="font-family: 'Mona-Sans Bold'; font-size: 18px; line-height: 32px; color: #4B5563;"><img [src]="images.DLINVOICE" alt="" style="margin-right: 12px">Invoice PDF</label>
            </div>
            <div class="pay-details" style="height: 52px; padding: 10px 20px;">
                <span style="font-family: 'Mona-Sans Regular'; font-size: 18px; line-height: 22px; color: #94A3B8;">Paid :</span>
                <label style=" font-family: 'Mona-Sans Bold'; font-size: 18px; line-height: 32px; color: #4B5563; margin-left: 10px;">July 1,2024</label>
            </div>
        </div>
    </div>
    <div class="in-htl-details" style="margin-bottom: 28px;">
        <h2 style="font-family: 'Mona-Sans SemiBold'; font-size: 18px; line-height: 22px; color: #4B5563; margin-bottom: 0;">${item.hotelDetail?.hotelName}</h2>
        <div class="in-address" style="margin-top: 15px; display: flex; align-items: flex-start;">
            <img [src]="images.LOCPIN_GREY" alt="" style="margin-right: 5px">
            <p style="font-family: 'Mona-Sans Regular'; font-size: 16px; line-height: 20px; color: #94A3B8; margin-bottom: 0;">${item.hotelDetail?.address}</p>
        </div>
    </div>
    <div class="in-details" style=" background-color: #F1F5F9; border: 1px solid #CBD5E1; border-radius: 20px;">
        <div class="details-head" style="display: flex; justify-content: center; align-items: center; padding: 12px 0 6px;">
            <h2 style="font-family: 'Mona-Sans SemiBold'; font-size: 18px; line-height: 22px; color: #4B5563; margin-bottom: 0;">Booking Details</h2>
        </div>
        <div class="customer-info" style="background-color: #FFFFFF; border-radius: 20px;">
            <ul style="padding: 0; margin: 0;">
                <li style="list-style: none; padding: 14px 30px; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; border-radius: 20px 20px 0 0; border-top: 1px solid #E2E8F0;">
                    <span style="font-family: 'Mona-Sans Medium'; font-size: 16px; line-height: 20px; color: #475569;">Guest Name</span>
                    <span style="font-family: 'Mona-Sans Medium'; font-size: 16px; line-height: 20px; color: #475569;">
                    ${item?.user?.fullName}</span>
                </li>
                <li style="list-style: none; padding: 14px 30px; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-family: 'Mona-Sans Medium'; font-size: 16px; line-height: 20px; color: #475569;">Contact Number</span>
                    <span style="font-family: 'Mona-Sans Medium'; font-size: 16px; line-height: 20px; color: #475569;">
                    ${item?.user?.mobile}</span>
                </li>
                <li style="list-style: none; padding: 14px 30px; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-family: 'Mona-Sans Medium'; font-size: 16px; line-height: 20px; color: #475569;">Email Address</span>
                    <span style="font-family: 'Mona-Sans Medium'; font-size: 16px; line-height: 20px; color: #475569;">
                    ${item?.user?.email}</span>
                </li>
                <li style="list-style: none; padding: 14px 30px; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-family: 'Mona-Sans Medium'; font-size: 16px; line-height: 20px; color: #475569;">Room Name</span>
                    <span style="font-family: 'Mona-Sans Medium'; font-size: 16px; line-height: 20px; color: #475569;">${item.roomDetail.roomType.name}</span>
                </li>
                <li style="list-style: none; padding: 14px 30px; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-family: 'Mona-Sans Medium'; font-size: 16px; line-height: 20px; color: #475569;">Duration</span>
                    <spanstyle="font-family: 'Mona-Sans Medium'; font-size: 16px; line-height: 20px; color: #475569;">${item.numberOfDays} ${item.numberOfDays > 1 ? 'Days' : 'Day'}</span>
                </li>
                <li style="list-style: none; padding: 14px 30px; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-family: 'Mona-Sans Medium'; font-size: 16px; line-height: 20px; color: #475569;">Breakfast</span>
                    <span style="font-family: 'Mona-Sans Medium'; font-size: 16px; line-height: 20px; color: #475569;">
                    ${item?.isBreakfastIncludesNo === 0 ? 'No' : 'Yes'}</span>
                </li>
                <li style="list-style: none; padding: 14px 30px; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-family: 'Mona-Sans Medium'; font-size: 16px; line-height: 20px; color: #475569;">Check-In</span>
                    <span style="font-family: 'Mona-Sans Medium'; font-size: 16px; line-height: 20px; color: #475569;">${item.bookingFromDate} <label style="font-family: 'Mona-Sans Regular'; font-size: 14px; line-height: 18px;">(${item.roomDetail.checkIn})</label></span>
                </li>
                <li class="color-red" style="list-style: none; padding: 14px 30px; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;  border-radius:  0 0 20px 20px; border-bottom: 0;  color:#C42A25;">
                    <span style="font-family: 'Mona-Sans Medium'; font-size: 16px; line-height: 20px; color: #475569;">Check-Out</span>
                    <span style="font-family: 'Mona-Sans Medium'; font-size: 16px; line-height: 20px; color: #475569;">${item.bookingToDate} <label style="font-family: 'Mona-Sans Regular'; font-size: 14px; line-height: 18px;">(${item.roomDetail.checkIn})</label></span>
                </li>
            </ul>
        </div>
    </div>
</div>`;
    
    const invoiceElement = document.createElement('div');
    invoiceElement.innerHTML = invoiceHtml;
    document.body.appendChild(invoiceElement);

    if (invoiceElement) {
      html2canvas(invoiceElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('invoice.pdf');
      });
    }
  }
}