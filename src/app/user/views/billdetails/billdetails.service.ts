import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiCallerService } from 'src/app/utlis/api-caller.service';
import { Url } from 'src/app/utlis/url';


@Injectable({
  providedIn: 'root',
})
export class BilldetailsService {
  constructor(private http: HttpClient,private apiService: ApiCallerService) {}

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
  (
    bookingFromDate: any,
    bookingToDate: any,
    breakFastPrice: any,
    daily: any,
    holdingHour: any,
    hotelId: any,
    hotelName: any,
    isBreakfastIncludes: any,
    is_paid: any,
    numberOfDays: any,
    price: any,
    roomId: any,
    roomPrice: any,
    roomQuantity: any,
    roomType: any,
    discountValue: any,
    userId: any,
    confirmation_code: any,
    commision_percent: any,
    bookingStatus: any,
    razorpay_payment_id: any
  ): Observable<any[]> {
    const body = {
      bookingFromDate: bookingFromDate,
      bookingToDate: bookingToDate,
      breakFastPrice: breakFastPrice,
      daily: daily,
      holdingHour: holdingHour,
      hotelId: hotelId,
      hotelName: hotelName,
      isBreakfastIncludes: isBreakfastIncludes,
      is_paid: is_paid,
      numberOfDays: numberOfDays,
      price:price,
      roomId: roomId,
      roomPrice: roomPrice,
      roomQuantity: roomQuantity,
      discountValue: discountValue,
      userId: userId,
      confirmation_code: confirmation_code,
      commision_percent: commision_percent,
      bookingStatus: bookingStatus,
      payment_Id: razorpay_payment_id==null? null : razorpay_payment_id
    };
    return this.apiService.callApi('POST', Url.CUSTOMER_BOOK,body, true, false);
  }
  CouponCheck(code: any): Observable<any[]> {
    const body = { coupon: code };
    return this.apiService.callApi('POST', Url.CUSTOMER_COUPON,body, true, false);
  }
  
  CouponApply(code: any): Observable<any> {
    const body = { coupon: code };
    return this.apiService.callApi('POST', Url.CUSTOMER_COUPON_APPLY,body, true, false);
  }
}
