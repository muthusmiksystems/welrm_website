import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { ApiCallerService } from 'src/app/utlis/api-caller.service';
import { Url } from 'src/app/utlis/url';



@Injectable({
  providedIn: 'root'
})
export class HotelListingService {
  userId: any = 0;

  constructor(private apiService: ApiCallerService, private authService: AuthService) {
    let userData = this.authService.getUserData();
    if (userData) {
      this.userId = userData?.data?.user?.id;
    }
  }

  getHotelListsBySearch(search: any, searchFromDate: any, searchToDate: any, guestCapacity: any, sort: any, page: any): Observable<any[]> {
    let url = Url.CUSTOMER_GET_HOTELS + `?search=${search}&searchFromDate=${searchFromDate}&searchToDate=${searchToDate}&guestCapacity=${guestCapacity}&sort=${sort.key}&col=${sort.type}&userId=${this.userId}&page=${page}`;
    // if (search !== null) {
    //   url += `&?search=${search}`;
    // }

    return this.apiService.callApi('GET', url, null, false, false);
  }
  getHotelListsByCity(query: any | null, page: any): Observable<any[]> {
    let url = Url.CUSTOMER_GET_HOTELS;
    if (query !== null) {
      url += `?search=${query}&userId=${this.userId}&page=${page}`;
    }
    return this.apiService.callApi('GET', url, null, false, false);
  }

}
