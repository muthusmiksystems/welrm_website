import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiCallerService } from 'src/app/utlis/api-caller.service';
import { Url } from 'src/app/utlis/url';
import { AuthService } from 'src/app/auth.service';



@Injectable({
  providedIn: 'root',
})
export class HomeService {
  userId: any = 0;

  constructor(private http: HttpClient, private apiService: ApiCallerService, private authService: AuthService) {
    let userData = this.authService.getUserData();
    if (userData) {
      this.userId = userData?.data?.user?.id;
    }
  }

  getHotelLists(query: any | null, page: number): Observable<any[]> {
    let url = Url.CUSTOMER_GET_HOTELS + '?page=' + page + '&userId=' + this.userId;
    //let url = this.apiUrl + this.get_hotels + '?page=' + page;
    if (query !== null) {
      url += `&?search=${query}`;
    }
    return this.apiService.callApi('GET', url, null, false, false);
  }
  getAllCities(): Observable<any[]> {
    return this.apiService.callApi('GET', Url.ALL_CITIES, null, false, false);
  }

  getOurTestimonial(): Observable<any[]> {
    return this.apiService.callApi('GET', Url.OUR_TESTIMONIALS, null, false, false);
  }


  getTopRatedHotels(): Observable<any[]> {
    let url = Url.CUSTOMER_GET_TOP_RATED_HOTELS + '?userId=' + this.userId;
    return this.apiService.callApi('GET', url, null, false, false);
  }

  getHomePageData(): Observable<any[]> {
    return forkJoin([this.getAllCities(),this.getTopRatedHotels()]);
  }

  getOffers(): Observable<any[]> {
    return this.apiService.callApi('GET', Url.GET_OFFER+'?sort=asc', null, false, false);
  }

  getDeals(): Observable<any[]> {
    return this.apiService.callApi('GET', Url.GET_DEAL+'?sort=asc', null, false, false);
  }
}
