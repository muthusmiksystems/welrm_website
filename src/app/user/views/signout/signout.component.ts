import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss']
})
export class SignoutComponent implements OnInit {

  constructor(
    private auth_service: AuthService,
  ) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.auth_service.logout().subscribe(() => {
      // Handle successful logout redirection or other logic
    });
  }

}
