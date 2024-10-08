import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
 
@Injectable({ providedIn: 'root' })
export class ResSidebarService {
    private isSidebar = new Subject<any>();

    setSidebar(isOpen: boolean) {
        this.isSidebar.next(isOpen);
    }

    getSidebar(): Observable<any> {
        return this.isSidebar.asObservable();
    }

    clearSidebar(isOpen: boolean) {
        this.isSidebar.next(isOpen);
    }
}
