import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Carousel } from 'primeng/carousel';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  our_deals = [
    {
      image: 'assets/imgs/aboutus1.jpeg',
      title: 'Limited-Time Hotel Deals!',
      desc: 'Save on your stay with our exclusive offers. Book now and enjoy premium accommodations at unbeatable prices. Hurry......',
    },
    {
      image: 'assets/imgs/aboutus3.jpeg',
      title: 'Limited-Time Hotel Deals!',
      desc: 'Enjoy up to 50% off select hotels! Limited-time discounts available - book now!',
    },
    {
      image: 'assets/imgs/aboutus1.jpeg',
      title: 'Limited-Time Hotel Deals!',
      desc: 'Save on your stay with our exclusive offers. Book now and enjoy premium accommodations at unbeatable prices. Hurry......',
    },
    {
      image: 'assets/imgs/aboutus3.jpeg',
      title: 'Limited-Time Hotel Deals!',
      desc: 'Enjoy up to 50% off select hotels! Limited-time discounts available - book now!',
    },
    {
      image: 'assets/imgs/aboutus1.jpeg',
      title: 'Limited-Time Hotel Deals!',
      desc: 'Save on your stay with our exclusive offers. Book now and enjoy premium accommodations at unbeatable prices. Hurry......',
    },
  ]
  our_deals_responsive = [
    {
      breakpoint: '1399px',
      numVisible: 1.4,
      numScroll: 1
    },
    {
        breakpoint: '991px',
        numVisible: 1.3,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 1.2,
        numScroll: 1
    },
    {
      breakpoint: '499px',
      numVisible: 1.1,
      numScroll: 1
    },
  ];
  giveway_deal_responsive = [
    {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
    }
  ];
  givewayDeal: any = [
    {
      "title": "Get 10% Extra on",
      "titleSpan": "Welrm top-up",
      "image_url": "assets/imgs/goa.jpg",
      "deals": "66 More Deals"
    },
    {
      "title": "Get 10% Extra on",
      "titleSpan": "Welrm top-up",
      "image_url": "assets/imgs/goa.jpg",
      "deals": "66 More Deals"
    },
    {
      "title": "Get 10% Extra on",
      "titleSpan": "Welrm top-up",
      "image_url": "assets/imgs/goa.jpg",
      "deals": "66 More Deals"
    },
  ];
  isMobileView = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) { 
    Carousel.prototype.onTouchMove = () => { };
  }

  ngOnInit(): void {
    this.breakpointObserver
    .observe(['(max-width: 991px)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobileView = true;
      } else {
        this.isMobileView = false;
      }
    });
  }

}
