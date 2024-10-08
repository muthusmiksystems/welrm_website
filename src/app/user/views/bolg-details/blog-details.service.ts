import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiCallerService } from 'src/app/utlis/api-caller.service';
import { Url } from 'src/app/utlis/url';
import { Carousel } from 'primeng/carousel';

@Injectable({
  providedIn: 'root'
})
export class BlogDetailsService {

  constructor(private apiService: ApiCallerService) { 
    Carousel.prototype.onTouchMove = () => { };
   }

  getBlogDetails(slug:any): Observable<any[]> {
    let url = Url.CUSTOMER_GET_BLOG_DETAILS;
    if (slug !== null) {
      url += `${slug}`;
    }
    return this.apiService.callApi('GET', url, null, false, false);
  }
}
