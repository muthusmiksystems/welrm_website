import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCallerService } from 'src/app/utlis/api-caller.service';
import { Url } from 'src/app/utlis/url';

@Injectable({
  providedIn: 'root'
})
export class WishlistServiceService {

  constructor(private apiService: ApiCallerService) { }

  addToWishlist(form: any): Observable<any[]> {
    let url = Url.ADD_TO_WISHLIST;
    const body = form;
    return this.apiService.callApi('POST', url, body, false, false);
  }

  removeToWishlist(form: any): Observable<any[]> {
    let url = `${Url.REMOVE_TO_WISHLIST}/${form.user_id}/${form.hotel_id}/${form.room_id}`;
    const body = form;
    return this.apiService.callApi('DELETE', url, null, false, false);
  }

  getAllWishlist(userId): Observable<any[]> {
    let url = `${Url.GET_TO_WISHLIST}/${userId}`;
    return this.apiService.callApi('GET', url, null, false, false);
  }
}
