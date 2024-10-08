import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiCallerService } from 'src/app/utlis/api-caller.service';
import { Url } from 'src/app/utlis/url';

@Injectable({
  providedIn: 'root',
})
export class GetroomService {
  public sharedData = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient,private apiService: ApiCallerService) {
    // Retrieve data from Local Storage during service initialization
    const storedData = localStorage.getItem('bookingData');
    if (storedData) {
      this.sharedData.next(JSON.parse(storedData));
    }
  }

  
  getHotelFilter(hotelId: any, roomTypeId: any): Observable<any[]> {
    let url = `${Url.CUSTOMER_ROOMS}${hotelId}/${roomTypeId}`;
    return this.apiService.callApi('GET',url, null,false, false);
  }

  // Setter method
  setApiData(data: any) {
    this.sharedData.next(data);
    // Store the data in Local Storage
    localStorage.setItem('bookingData', JSON.stringify(data));
  }

  // Getter method
  getApiData() {
    return this.sharedData.asObservable();
  }
}
