import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
 
@Injectable({ providedIn: 'root' })
export class DataMessageService {
    private subject = new Subject<any>();
	dayType:any;
    sendMessage(event: any, message: any) {
        this.subject.next({event: event, data: message });
    }
 
    clearMessage() {
        this.subject.next(true)
    }
 
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}


