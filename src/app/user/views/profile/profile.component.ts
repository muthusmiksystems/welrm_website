import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  activeTab: any;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
  ) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.activeTab = this.route.snapshot.queryParams['active'];
      }
    });
  }

  ngOnInit() {
    this.activeTab = this.route.snapshot.queryParams['active'];
  }

}
