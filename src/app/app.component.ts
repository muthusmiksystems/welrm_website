import { Component, Injectable, Inject, HostListener } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router';
import { MetaService } from './meta.service';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ResSidebarService } from './res-sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLoggedIn!: boolean;
  title = 'welrm_web';
  metaTags: any = [];
  userData: any;
  windowScrolled = false;
  isShow: boolean;
  public dragging: boolean;
  isMobileView = false;
  footerItems: any = [
    { icon: 'assets/imgs/home-white.svg', name: 'Home', route: '/' },
    { icon: 'assets/imgs/bell.svg', name: 'Notifications', route: '/profile', slug:'Notifications' },
    { icon: 'assets/imgs/booking.svg', name: 'Bookings', route: '/profile', slug:'MyBookings' },
    { icon: 'assets/imgs/heart-white.svg', name: 'My Wish', route: '/profile', slug:'WishList' },
    { icon: 'assets/imgs/user.svg', name: 'Profile', route: '/profile', slug:'MyProfile' },
  ]

  constructor(
    @Inject(DOCUMENT) private dom: any,
    private titleService: Title,
    private authService: AuthService,
    private metaService: MetaService,
    private router: Router,
    private meta: Meta,
    private breakpointObserver: BreakpointObserver,
    public resSidebarService: ResSidebarService,
  ) {
    this.router.events.subscribe(event => {
      // Check if the event is a NavigationEnd event
      if (event instanceof NavigationEnd) {
        // Call your function here
        this.onRouteChange(event);
      }
    });
  }

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollPosition >= 400) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  onRouteChange(event: any) {
    console.log("event triggers");
    let url = event.url;
    let params = url.substring(1);
    this.metaService.getMetaData(params.length > 0 ? params : 'home').subscribe((response: any) => {
      console.log("response.......",response);
      if (response.success) {
        this.metaTags = response.data instanceof Array ?response.data[0]:response.data;
        this.addTag();
      }
    })

  }

  addTag() {
    const existingTitle = this.titleService.getTitle();
    console.log("keys ....................",this.metaTags);
    Object.keys(this.metaTags).forEach(key => {
    
      if (key.startsWith("meta_")) {
        // Extract the meta tag name (after "meta_") and convert it to lowercase
        const metaTagName = key.substring(5).toLowerCase();
        const existingMetaTag = this.meta.getTag(`name="${metaTagName}"`);
        // console.log(`metatags name---${this.metaTags[key]},--existing tag--${existingMetaTag}`)
        if (existingMetaTag) {
          existingMetaTag.setAttribute('content', this.metaTags[key]);
        }
        else {
          this.meta.addTag({ name: metaTagName, content: this.metaTags[key] });

        }
      }
      if (key.startsWith("content")) {
        // Extract the meta tag name (after "meta_") and convert it to lowercase
        const metaTagName = key.toLowerCase();
        const existingMetaTag = this.meta.getTag(`name="${metaTagName}"`);
        if (existingMetaTag) {
          existingMetaTag.setAttribute('content', this.metaTags[key]);
        } else {
          this.meta.addTag({ name: metaTagName, content: this.metaTags[key] });
        }
      }
      if (key.startsWith("robots")) {
        // Extract the meta tag name (after "meta_") and convert it to lowercase
        const metaTagName = key.toLowerCase();
        const existingMetaTag = this.meta.getTag(`name="${metaTagName}"`);
        if (existingMetaTag) {
          existingMetaTag.setAttribute('content', this.metaTags[key]);
        } else {
          this.meta.addTag({ name: metaTagName, content: this.metaTags[key] });
        }
      }
      if (key.startsWith("canonical")) {
        const existingCanonicalLink = this.dom.head.querySelector('link[rel="canonical"]');
        if (existingCanonicalLink) {
          existingCanonicalLink.setAttribute('href', this.metaTags['canonical']); // Replace the href attribute
        } else {
          const link: HTMLLinkElement = this.dom.createElement('link');
          link.setAttribute('rel', 'canonical');
          link.setAttribute('href', this.metaTags['canonical']);
          this.dom.head.appendChild(link);
        }
      }
      if (key.startsWith("meta_title")) {
        console.log("meta keys",this,this.metaTags);
        this.titleService.setTitle(this.metaTags[key]);
      }

    })

  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
      window.onbeforeunload = () => {
        window.scrollTo(0, 0);
      }
    });


    this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;

      if (this.isLoggedIn) {
        this.userData = this.authService.getUserData();
        // if (this.userData.data.user.userType == 'owner') {

        // } else {
        //   //this.isCustomerLoggedIn=true;
        // }
      }
    });

    if (this.authService.isTokenValidUntilMidnight()) {

    } else {
      // localStorage.clear();
    }

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

  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  openWhatsapp() {
    let url = "https://wa.me/919584290842";
    window.open(url, "_blank");
  }

  public handleDragStart(event: CdkDragStart): void {
    this.dragging = true;
  }

  public handleClick(event: MouseEvent): void {
    if (this.dragging) {
      this.dragging = false;
      return
    }
    this.openWhatsapp();
  }

  gotoRoute(item) {
    if (item?.slug) {
      this.router.navigate([item.route], { queryParams: { active: item.slug } });
    } else {
      this.router.navigate([item.route]);
    }
  }

  closeSidebar() {
    this.resSidebarService.setSidebar(false);

    let body = document.body;
    body.style.overflow = 'auto';
  }
}
