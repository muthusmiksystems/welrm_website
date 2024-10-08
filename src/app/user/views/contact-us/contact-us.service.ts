import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { ApiCallerService } from 'src/app/utlis/api-caller.service';
import { Url } from 'src/app/utlis/url';



@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(private apiService: ApiCallerService) { }

  contactUs(form: any): Observable<any[]> {
    let url = Url.CONTACTUS;
    const body = form;
    return this.apiService.callApi('POST', url, body, false, false);
  }

}
