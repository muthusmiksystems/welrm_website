import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,   private messageService1: MessageService) { }

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      map((loggedIn: boolean) => {
        if (!loggedIn) {
          //alert('Please Login ');
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Please Login' });
 
          
        }
        return loggedIn;
      })
    );
  }
}

