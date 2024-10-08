import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCallerService } from 'src/app/utlis/api-caller.service';
import { Url } from 'src/app/utlis/url';


@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(private http: HttpClient,private apiService: ApiCallerService) {}

 
  getAllRating(hotelname: string | null): Observable<any[]> {
    let url = `${Url.CUSTOMER_RATING}`;
    if (hotelname !== null) {
          url += `?search=${hotelname}`;
        }
    return this.apiService.callApi('GET', url, null, true, false);

  }
}
