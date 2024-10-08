import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiCallerService } from 'src/app/utlis/api-caller.service';
import { Url } from 'src/app/utlis/url';
import { AuthService } from 'src/app/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HoteldetailsService {
  userId: any = 0;

  constructor(private http: HttpClient,private apiService: ApiCallerService, private authService: AuthService) {
    let userData = this.authService.getUserData();
    if (userData) {
      this.userId = userData?.data?.user?.id;
    }
  }

  getHotelDetails(id: any): Observable<any[]> {
    let url = `${Url.CUSTOMER_GET_HOTELS_DETAILS}${id}?userId=${this.userId}`;
    return this.apiService.callApi('GET',url, null, false, false);
  }
  
}
