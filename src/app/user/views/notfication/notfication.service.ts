import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCallerService } from 'src/app/utlis/api-caller.service';
import { Url } from 'src/app/utlis/url';


@Injectable({
  providedIn: 'root',
})
export class NotficationService {
  constructor(private apiService: ApiCallerService) {}

  getNotification(): Observable<any[]> {
    return this.apiService.callApi('GET', Url.USER_NOTIFICATION, null, true, false);
  }
}
