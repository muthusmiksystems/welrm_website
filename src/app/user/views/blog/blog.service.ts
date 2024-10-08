import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiCallerService } from 'src/app/utlis/api-caller.service';
import { Url } from 'src/app/utlis/url';


@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private apiService: ApiCallerService) { }

  getBlogLists(page: number | null): Observable<any[]> {
    let url = Url.CUSTOMER_GET_BLOG_LIST;
    if (page !== null) {
      url += `?page=${page}`;
    }
    return this.apiService.callApi('GET', url, null, false, false);
  }
}
