import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiCallerService } from 'src/app/utlis/api-caller.service';
import { Url } from 'src/app/utlis/url';
import { AuthService } from 'src/app/auth.service';


@Injectable({
  providedIn: 'root'
})
export class SearchService {
  userId: any = 0;
  
  constructor(private http: HttpClient,private apiService: ApiCallerService, private authService: AuthService) {
    let userData = this.authService.getUserData();
    if (userData) {
      this.userId = userData?.data?.user?.id;
    }
  }

  searchData(query: string): Observable<any[]> {
    const url = `${Url.CUSTOMER_GET_HOTELS}?search=${query}&userId=${this.userId}`;
    return this.apiService.callApi('GET', url, null, false, false);
  }
  searchFilterData(query: string, fromDate:any, toDate:any,guestCapacity:any): Observable<any[]> {
    const url = `${Url.CUSTOMER_GET_HOTELS}?search=${query}&userId=${this.userId}&searchFromDate=${fromDate}&searchToDate=${toDate}&guestCapacity=${guestCapacity}`;
    return this.apiService.callApi('GET', url, null, false, false);
  }

}
