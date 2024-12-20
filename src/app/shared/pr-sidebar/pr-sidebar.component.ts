import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, tap } from 'rxjs';
import { ResSidebarService } from 'src/app/res-sidebar.service';
import {IMAGES} from '../constants/images.constant';
@Component({
  selector: 'app-pr-sidebar',
  templateUrl: './pr-sidebar.component.html',
  styleUrls: ['./pr-sidebar.component.scss']
})
export class PrSidebarComponent implements OnInit {
  public images=IMAGES;
  sidebar: any = [
    { id: '1', img: this.images.PROFILE, name: 'My Profile', slug: 'MyProfile', size: '0px 0px', hSize: '0px -50px'},
    { id: '2', img: this.images.PROFILE, name: 'My Bookings', slug: 'MyBookings', size: '-50px 0px', hSize: '-50px -50px' },
    { id: '3', img: this.images.PROFILE, name: 'Notifications', slug: 'Notifications', size: '-100px 0px', hSize: '-100px -50px' },
    { id: '4', img: this.images.PROFILE, name: 'My Reviews', slug: 'MyReviews', size: '-150px 0px', hSize: '-150px -50px' },
    { id: '5', img: this.images.PROFILE, name: 'Wish List', slug: 'WishList', size: '-200px 0px', hSize: '-200px -50px' },
    { id: '6', img: this.images.PROFILE, name: 'Change Password', slug: 'ChangePassword', size: '-250px 0px', hSize: '-250px -50px' },
    { id: '7', img: this.images.PROFILE, name: 'Settings', slug: 'Settings', size: '-300px 0px', hSize: '-300px -50px' },
    { id: '8', img: this.images.PROFILE, name: 'Sign Out', slug: 'SignOut', size: '-400px 0px', hSize: '-400px -50px' },
  ];
  activeTab: any;
  isMobileView = false;
  sidebarOpen = false;
  readonly breakpoint$ = this.breakpointObserver
  .observe([
    '(min-width: 992px)',
    '(min-width: 0px)',
  ])
  .pipe(
    tap((value) => console.log(value)),
    distinctUntilChanged()
  );
  
  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    public resSidebarService: ResSidebarService,
  ) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url?.includes('/profile')) {
          this.activeTab = this.route.snapshot.queryParams['active'];
          if (!this.activeTab) this.activeTab = 'MyProfile';
          this.swichTabs(this.activeTab);
        }
      }
    });
  }

  ngOnInit(): void {
    this.breakpoint$.subscribe(() => this.breakpointChanged());
    this.resSidebarService.getSidebar().subscribe(open => {
      this.sidebarOpen = open;
    });

    this.breakpointObserver
    .observe(['(max-width: 767px)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobileView = true;
      } else {
        this.isMobileView = false;
      }
    });
  }

  swichTabs(currentTab: any) {
    this.sidebar = this.sidebar.map(d => {
      if (currentTab === d.slug && !d.active) {
        d.active = true;
        this.router.navigate(['/profile'], { queryParams: { active: currentTab }, queryParamsHandling: 'merge' });
        this.toggleSidebar(false);
      } else if (currentTab !== d.slug) {
        d.active = false
      }
      return d;
    });
  }

  toggleSidebar(isOpen) {
    this.resSidebarService.setSidebar(isOpen);

    let body = document.body;
    if (isOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'auto';
    }
  }

  private breakpointChanged() {
    if (this.breakpointObserver.isMatched('(min-width: 992px)')) {
      this.sidebar[0].size = '0px 0px';
      this.sidebar[0].hSize = '0px -50px';
      this.sidebar[1].size = '-50px 0px';
      this.sidebar[1].hSize = '-50px -50px';
      this.sidebar[2].size = '-100px 0px';
      this.sidebar[2].hSize = '-100px -50px';
      this.sidebar[3].size = '-150px 0px';
      this.sidebar[3].hSize = '-150px -50px';
      this.sidebar[4].size = '-200px 0px';
      this.sidebar[4].hSize = '-200px -50px';
      this.sidebar[5].size = '-250px 0px';
      this.sidebar[5].hSize = '-250px -50px';
      this.sidebar[6].size = '-300px 0px';
      this.sidebar[6].hSize = '-300px -50px';
      this.sidebar[7].size = '-350px 0px';
      this.sidebar[7].hSize = '-350px -50px';
    } else if (this.breakpointObserver.isMatched('(min-width: 0px)')) {
      this.sidebar[0].size = '-5px -5px';
      this.sidebar[0].hSize = '-5px -55px';
      this.sidebar[1].size = '-55px -5px';
      this.sidebar[1].hSize = '-55px -55px';
      this.sidebar[2].size = '-105px -5px';
      this.sidebar[2].hSize = '-105px -55px';
      this.sidebar[3].size = '-155px -5px';
      this.sidebar[3].hSize = '-155px -55px';
      this.sidebar[4].size = '-205px -5px';
      this.sidebar[4].hSize = '-205px -55px';
      this.sidebar[5].size = '-255px -5px';
      this.sidebar[5].hSize = '-255px -55px';
      this.sidebar[6].size = '-305px -5px';
      this.sidebar[6].hSize = '-305px -55px';
      this.sidebar[7].size = '-355px -5px';
      this.sidebar[7].hSize = '-355px -55px';
    }
  }
}