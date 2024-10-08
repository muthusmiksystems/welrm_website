import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCallerService } from './utlis/api-caller.service';
import { Url } from './utlis/url';


@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(private http: HttpClient, private apiService: ApiCallerService) { }


  // getMetaData(query: any): Observable<any[]> {

  //   let url = `${Url.GET_META_TAGS}${query}`;
  //   return this.apiService.callApi('GET', url, null, false, false);


  // }
  getMetaData(query: any): Observable<any[]> {
    const slashIndex = query.indexOf('/');
    const updatedQuery = slashIndex !== -1 ? query.substring(slashIndex + 1) : query;
    const newurl = query.substring(0,slashIndex);
    let url = "";
    if(newurl === 'blog')
      url = `${Url.GET_META_BLOG_TAGS}${updatedQuery}`;
    else  
      url = `${Url.GET_META_TAGS}${updatedQuery}`;
    
    return this.apiService.callApi('GET', url, null, false, false);
}


}
