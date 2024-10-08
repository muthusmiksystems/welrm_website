import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { ApiCallerService } from 'src/app/utlis/api-caller.service';
import { Url } from 'src/app/utlis/url';


@Injectable({
  providedIn: 'root',
})
export class BookinghistoryService {
  constructor(private http: HttpClient, private apiService: ApiCallerService) { }

  getBookingHistory(): Observable<any[]> {
    return this.apiService.callApi('GET', Url.CUSTOMER_BOOK_HISTORY, null, true, false);
  }
  getActiveBooking(): Observable<any[]> {
    return this.apiService.callApi('GET', Url.CUSTOMER_BOOK_LIST, null, true, false);
  }
  getAllApiData(): Observable<any[]> {
    return forkJoin([this.getActiveBooking(), this.getBookingHistory()]);
  }

  cancelBooking(roomId: any, bookingId: any): Observable<any[]> {
    const url = `${Url.CUSTOMER_BOOK_CANCEL}/${roomId}/${bookingId}`;
    return this.apiService.callApi('PUT', url, null, true, false);
  }

  rateHotel(
    bookingId: number,
    userRating: number,
    recommendProduct: boolean,
    productReview: string
  ) {
    const body = {
      bookingId: bookingId,
      rating: userRating,
      recommend: recommendProduct ? 1 : 0,
      review: productReview,
    };
    return this.apiService.callApi('POST', Url.CUSTOMER_RATING, body, true, false);
  }
}
