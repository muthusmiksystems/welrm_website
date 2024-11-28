import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators, } from "@angular/forms";
import { HomeService } from './home.service';
import { SearchService } from 'src/app/shared/hotel-search/search.service';
import { DomSanitizer, Meta, MetaDefinition } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, interval, Subscription } from 'rxjs';
import { DataMessageService } from 'src/app/message.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlogService } from '../blog/blog.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Carousel } from 'primeng/carousel';
import _ from 'lodash';
import { WishlistServiceService } from '../wishlist/wishlist.service';
import { AuthService } from 'src/app/auth.service';
import { MessageService } from 'primeng/api';
import {IMAGES} from '../../../shared/constants/images.constant';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {
  public image = IMAGES;
  personCountV: boolean= false;
  adults=2;
  childs=0;
  room=1;
  minimumDate = new Date();
  minimumDatecIn = new Date();
  date: Date | undefined;
  responsiveOptions: any[] | undefined;
  city_responsive = [
  {
    breakpoint: '1199px',
    numVisible: 5,
    numScroll: 1
  },
  {
      breakpoint: '991px',
      numVisible: 3,
      numScroll: 1
  },
  {
      breakpoint: '767px',
      numVisible: 3,
      numScroll: 1
  },
  {
    breakpoint: '575px',
    numVisible: 2,
    numScroll: 1
  },
  // {
  //   breakpoint: '399px',
  //   numVisible: 1,
  //   numScroll: 1
  // }
  ];
  top_Properties_responsive = [
    {
        breakpoint: '1199px',
        numVisible: 4,
        numScroll: 1
    },
    {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
    },
    {
      breakpoint: '575px',
      numVisible: 1.4,
      numScroll: 1
    },
    {
      breakpoint: '399px',
      numVisible: 1.2,
      numScroll: 1
    }
  ];
 
  images = [{
    itemImageSrc: '../../../../assets/images/banner-image.png',
    thumbnailImageSrc: '../../../../assets/images/banner-image.png',
    alt: 'Description for Image 1',
    title: 'Title 1'
  },
  {
    itemImageSrc: 'https://images.pexels.com/photos/1480783/pexels-photo-1480783.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    thumbnailImageSrc: 'https://images.pexels.com/photos/1480783/pexels-photo-1480783.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Description for Image 1',
    title: 'Title 1'
  }, {
    itemImageSrc: 'https://images.pexels.com/photos/4971733/pexels-photo-4971733.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    thumbnailImageSrc: 'https://images.pexels.com/photos/4971733/pexels-photo-4971733.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Description for Image 1',
    title: 'Title 1'
  }
  ];
  top_destinations: any = [
    {
      "name": "Beaches",
      "image_url": this.image.GOA,
      "address": 'Goa',
      "rating": "4.9"
    },
    {
      "name": "Dream City",
      "image_url": this.image.MUMBAI,
      "address": 'Mumbai',
      "rating": "4.9"
    },
    {
      "name": "Mountains and Snow",
      "image_url": this.image.MANALI,
      "address": 'Manali',
      "rating": "4.9"
    },
    {
      "name": "Religious Places",
      "image_url": this.image.PUNJAB,
      "address": 'Punjab',
      "rating": "4.9"
    },
    {
      "name": "Desert Safari",
      "image_url": this.image.JAISALMER,
      "address": 'Jaisalmer',
      "rating": "4.9"
    },
    {
      "name": "Pink City",
      "image_url": this.image.JAIPUR,
      "address": 'Jaipur',
      "rating": "4.9"
    },
  ];

  top_Properties: any = [
    {
      "name": "Diamond Palace",
      "image_url": "../../../../assets/images/top-properties01.png",
      "location": "Hyderabad"
    },
    {
      "name": "Diamond Palace",
      "image_url": "../../../../assets/images/top-properties02.png",
      "location": "Kolkata"
    },
    {
      "name": "Diamond Palace",
      "image_url": "../../../../assets/images/top-properties03.png",
      "location": "Goa"
    },
    {
      "name": "Diamond Palace",
      "image_url": "../../../../assets/images/top-properties04.png",
      "location": "Mumbai"
    },
    {
      "name": "Diamond Palace",
      "image_url": "../../../../assets/images/top-properties05.png",
      "location": "Bangalore"
    },
    {
      "name": "Diamond Palace",
      "image_url": "../../../../assets/images/top-properties01.png",
      "location": "Hyderabad"
    },
    {
      "name": "Diamond Palace",
      "image_url": "../../../../assets/images/top-properties02.png",
      "location": "Chennai"
    },
    {
      "name": "Diamond Palace",
      "image_url": "../../../../assets/images/top-properties03.png",
      "location": "New Delhi"
    },

  ];

  top_testimonial: any = [
    {
      "name": "Aman Gupta",
      "image_url": this.image.TESTIMONIAL_IMAGE01,
      "testimonal": "I have used several hotel booking apps in the past, but WELRM is by far the best one I've used. Not only did I find great hotels within my budget, but the app also provided detailed information about each hotel, including photos and reviews from other travelers.",
      "date": new Date('2017-01-03'),
    },
    {
      "name": "Amit Singh",
      "image_url": this.image.TESTIMONIAL_IMAGE02,
      "testimonal": "I recently used the WELRM Hotel Booking app for a trip and variety of hotels available within my budget. The app was easy to use and allowed me to filter my search to find the perfect hotel for my needs.",
      "date": new Date('2017-01-03'),
    },
    {
      "name": "Manoj Singh",
      "image_url": this.image.TESTIMONIAL_IMAGE03,
      "testimonal": "The hotel I booked exceeded my expectations and I had a wonderful stay. I highly recommend this app to anyone looking for affordable and reliable hotel options.",
      "date": new Date('2017-01-03'),
    },
    {
      "name": "Srinivas Thadaka",
      "image_url": this.image.TESTIMONIAL_IMAGE04,
      "testimonal": "WELRM Hotel Booking app is a game-changer for budget travelers like myself. The app is user-friendly and allows me to easily search for hotels within my budget range. The app also provided accurate information about each hotel, which helped me make an informed decision.",
      "date": new Date('2017-01-03'),
    },
    {
      "name": "Aman Gupta",
      "image_url": this.image.TESTIMONIAL_IMAGE01,
      "testimonal": "I have used several hotel booking apps in the past, but WELRM is by far the best one I've used. Not only did I find great hotels within my budget, but the app also provided detailed information about each hotel, including photos and reviews from other travelers.",
      "date": new Date('2017-01-03'),
    },
    {
      "name": "Amit Singh",
      "image_url": this.image.TESTIMONIAL_IMAGE02,
      "testimonal": "I recently used the WELRM Hotel Booking app for a trip and variety of hotels available within my budget. The app was easy to use and allowed me to filter my search to find the perfect hotel for my needs.",
      "date": new Date('2017-01-03'),
    },
    {
      "name": "Manoj Singh",
      "image_url": this.image.TESTIMONIAL_IMAGE03,
      "testimonal": "The hotel I booked exceeded my expectations and I had a wonderful stay. I highly recommend this app to anyone looking for affordable and reliable hotel options.",
      "date": new Date('2017-01-03'),
    },
    {
      "name": "Srinivas Thadaka",
      "image_url": this.image.TESTIMONIAL_IMAGE04,
      "testimonal": "WELRM Hotel Booking app is a game-changer for budget travelers like myself. The app is user-friendly and allows me to easily search for hotels within my budget range. The app also provided accurate information about each hotel, which helped me make an informed decision.",
      "date": new Date('2017-01-03'),
    },

  ];
  top_cities: any = [];
  top_Rated_Properties: any = [];

  homedata: any[] = [];
  results: any[] = [];
  slideIndex = 0;
  currentPage: number = 1;
  totalPages = 1;
  totalRecords = 0;
  private interval: any;
  cityQuery: string = '';
  searchQuery: string = '';
  searchResults: string[] = [];
  value: number | undefined;
  valueName: any | undefined;
  
  filterItems = [
    { label: 'Hightest Rating', value: 'Hightest Rating', subValue: 1 },
    { label: 'High to low price', value: 'High to low price', subValue: 2 },
    { label: 'Low to high price', value: 'Low to high price', subValue: 3 },
  ];
  selectedCity: string | undefined;

  checkInDate: any;
  checkOutDate: any;
  searchForm: boolean= false;

  form = new FormGroup({
    cityOrhotelOrneighborhood: new FormControl("",  [Validators.required]),
    checkInDate: new FormControl("",  [Validators.required]),
    checkOutDate: new FormControl("",  [Validators.required]),
  });
  
  offers: any = [];
  offers_responsive = [
    {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '991px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible:3,
        numScroll: 1
    },
    {
      breakpoint: '575px',
      numVisible: 2.4,
      numScroll: 1
    }
  ];
  best_deals: any = [];
  accordionItems = [
    {
      title: 'How can I become a WELRM member?',
      content: 'To select "Hotel Owner" from the application and complete a Registration flow and wait for the Admin approval',
      isOpen: false
    },
    {
      title: 'How much is the membership fees?',
      content: 'Initially WELRM provided 2 months listing free and will charge from 3rd month. Basic 1 month membership fee starts from 1,500/- Indian rupees.',
    },
    {
      title: 'How to contact WELRM team?',
      content: 'You can fill the contact us form from the site or check the contact us or support page from the application.',
    },
    {
      title: 'How to pay monthly membership fees?',
      content: 'From Subscription tab, you can see the valid plans, and the user can choose a plan and select the pay button and then choose any payment method from the list.',
    },
  ];
  footerTabs = [
    {id: 'TopCities', title: 'Top Cities', content: []},
    {id: 'TopHotels', title: 'Top Hotels', content: []},
    {id: 'PopularDestinations', title: 'Popular Destinations', content: []},
    {id: 'PopularHotels', title: 'Popular Hotels', content: []},
  ];
  ourVideos: any = {
    mainView: this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/vBzBfJhczrg?si=HEO2gUr6tHwitp-8'),
    columnView1: this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/4d_rtPIefSM?si=Y6p3YPH66wzloUfY'),
    columnView2: this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/rI-BzNxaFI4?si=qJRPkRmQHbY-2nGg'),
  };
  blogs: any = [];
  userId: any;

  private countdownInterval: any;
  isMobileView = true;
  lastDate: Date;
  countdown: string;
  private countdownSubscription: Subscription;
  days: any;
  hours: any;
  minutes: any;
  seconds: any;
  allCity: any;

  constructor(
    private homeService: HomeService,
    private el: ElementRef,
    private apiService: SearchService,
    private metaService: Meta,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: DataMessageService,
    private _sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private blogservice: BlogService,
    private breakpointObserver: BreakpointObserver,
    private wishlistService: WishlistServiceService,
    private authService: AuthService,
    private messageService1: MessageService
  ) {
    Carousel.prototype.onTouchMove = () => { };
    let userData = this.authService.getUserData();
    if (userData) {
      this.userId = userData?.data?.user?.id;
    }
  }

  get f() {
    return this.form.controls;
  }

  booking(id: any, name: any) {
    this.onSetSearch(name);
    this.router.navigate(['room-details','getroom'], { queryParams: { hotelId: id, hotelName:name }})
  }

  addTag() {
    this.metaService.addTag({ name: 'description', content: 'Article Description' });
    this.metaService.addTag({ name: 'robots', content: 'index,follow' });
    this.metaService.addTag({ property: 'og:title', content: 'Content Title for social media' });
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 767px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isMobileView = false;
        } else {
          this.isMobileView = true;
        }
    });
    // this.route.queryParams.subscribe(qParams => {
    //   if (qParams && qParams['city']) {
    //     this.cityQuery = qParams['city'];
    //     this.showMore();
    //   }
    // });
    this.showMore();
    this.getOfferData();
    this.getData();
    this.getBlogs();
    this.getDealData();
    // this.getTestimonial();
    this.lastDate = this.getLastDate();
    this.startCountdown();
  }

  getTestimonial() {
    this.homeService.getOurTestimonial().subscribe((data: any) => {
      this.top_testimonial=data.data
    });
  }

  getData() {
    this.homeService
      .getHomePageData()
      .pipe(
        catchError((error) => {
          console.error('Booking Home ts error:', error);
          // You can return a fallback value or re-throw the error as needed
          // return [];
          throw error;
        }),
        finalize(() => {
          // This block will run after both API calls complete (success or error)
          // You can add finalization logic here
        })
      )
      .subscribe(([allCities, allTopRatedProperities]) => {
        if (allCities.success) {
          this.allCity = allCities.cityCount;
          this.top_cities = allCities.data;
        }
        if (allTopRatedProperities.success) {
          console.log('rating-',allTopRatedProperities.data.result)
          this.top_Rated_Properties = allTopRatedProperities.data.result;
          this.top_Rated_Properties?.forEach(el => {
            el.newPrice = _.ceil(el.price - (el.price * el.discount) / 100);
          });
        }
      });
  }
  onCitySelected(cityName: string) {

  }
  ChangeSortOrder(value: any, name: any) {
    this.value = value;
    this.valueName = name;
    this.showMore();
  }
  showMore(page = 1) {
    let query = 'page=' + this.currentPage;
    this.currentPage = page;
    if (this.value) {
      query += '&';
      if (this.value === 1) {
        query += 'sort=desc&col=rating'
      }
      if (this.value === 2) {
        query += 'sort=desc&col=price'
      }
      if (this.value === 3) {
        query += 'sort=asc&col=price'
      }
    }
    if (this.cityQuery) {
      query += '&city=' + this.cityQuery;
    }
    this.homeService.getHotelLists(query, this.currentPage).subscribe((data: any) => {
      this.homedata = data;
      this.results = data.data.result;
      this.results.forEach((element: any, index: number) => {
        element['slug'] = this.convertToSlug(`${element['hotelName']}`);
      })
      this.totalRecords = data.data.total;
      this.totalPages = Math.ceil(data?.data?.total / 10);

    });
  }
  onCityChange(city: string) {
    // alert(0)
    this.onSetSearch(city);
    this.router.navigate([`list`, `hotels-in-${city}`], {
      queryParams: {
        city: city
      }
    })
  }
  onSearchQueryChange(query: string) {
    this.searchQuery = query;
    if (query) {
      this.apiService.searchData(query).subscribe((data: any) => {
        this.results = data.data.result;
        this.results.forEach((element: any, index: number) => {
          element['slug'] = this.convertToSlug(`${element['hotelName']}`);
        })
      });
    } else {
      this.results = [];
    }

  }

  moveSlider(index: number, direction: number) {
    const slider = document.querySelectorAll<HTMLElement>('.slider')[index];
    this.slideIndex = (this.slideIndex + direction + slider.children.length) % slider.children.length;
    this.results[index].slideIndex = this.slideIndex;
    const translateValue = -this.slideIndex * 100;
    slider.style.transform = `translateX(${translateValue}%)`;
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.cityQuery = '';
    this.searchQuery = '';
    this.valueName = '';
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  convertToSlug(txt: string) {
    return txt.toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  openNew(url: any) {
    window.open(url, '_blank')
  }

  onChangeVideo(key: string) {
    let oldView = this.ourVideos.mainView;
    this.ourVideos.mainView = this.ourVideos[key];
    this.ourVideos[key] = oldView;
  }

  getBlogs() {
    let page = 1;
    this.blogservice.getBlogLists(page).subscribe((data: any) => {
      if (data.code == 200) {
        let blogs = data.data.rows;
        this.blogs = blogs.reverse();
      }
    });
  }

  navigateToBlogDetails(slug: string): void {
    if (slug != null && slug.length > 0) {
      this.router.navigate(['blog', slug]);
    }
  }

  scrollTop() {
    window.scroll(0, 0);
  }
  
  open(content: any) {
    this.modalService.open(content, { windowClass:'hostmodal'});
  }

  gotoNext(route: any) {
    this.router.navigate([`/${route}`]);
  }

  onSetSearch(city) {
    let paramiterForhotelSearch: any = localStorage.getItem('paramiterForhotelSearch');
    if (paramiterForhotelSearch) {
      const index = paramiterForhotelSearch.indexOf('@#$&');
      if (index !== -1) {
        const restOfString = paramiterForhotelSearch.substring(index);
        paramiterForhotelSearch = city + restOfString;

        localStorage.setItem('paramiterForhotelSearch', paramiterForhotelSearch);
      }
    } else {
      const today = new Date(); // get today's date
			const tomorrow = new Date(today);
      paramiterForhotelSearch = city+'@#$&'+this.formatDate(today)+'@#$&'+this.formatDate(tomorrow.setDate(tomorrow.getDate() + 1))+'@#$&'+this.adults+'@#$&'+this.childs+'@#$&'+this.room;
      localStorage.setItem('paramiterForhotelSearch', paramiterForhotelSearch);
    }
  }

  formatDate(date:any) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
	
		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;
	
		return [year, month, day].join('-');
	}

 getLastDate(): Date {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    let futureDate = new Date(year, month + 1, 0);
    futureDate.setHours(23);
    futureDate.setMinutes(59);
    futureDate.setSeconds(59);
    futureDate.setMilliseconds(999);
    return futureDate;
  }

  startCountdown(): void {
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.updateCountdown();
    });
  }

  updateCountdown(): void {
    const now = new Date();
    const timeDiff = this.lastDate.getTime() - now.getTime();

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    this.days = `${days}`;
    this.hours = `${hours}`;
    this.minutes = `${minutes}`;
    this.seconds = `${seconds}`;
  }

  getCeilPrice(price) {
    return _.ceil(price);
  }

  postHotelData(result) {
    console.log('result==',result)
    let payload = {
      user_id : this.userId,
      hotel_id : result.hotelId,
      room_id : result.roomId
    };
    if (!this.userId) {
      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Please login'});
      return;
    }
    if (result?.inWishlist) {
      result.isLoading = true;
      this.wishlistService.removeToWishlist(payload)
      .pipe(
        finalize(() => {
          result.isLoading = false;
        })
      )
      .subscribe((response: any) => {
        if (response?.success) {
          result.inWishlist = false;
          this.messageService1.add({ severity: 'error', summary: 'Success', detail: response?.message});
        } else {
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: response?.message});
        }
      });
    } else {
      result.isLoading = true;
      this.wishlistService.addToWishlist(payload)
      .pipe(
        finalize(() => {
          result.isLoading = false;
        })
      )
      .subscribe((response: any) => {
        if (response?.success) {
          result.inWishlist = true;
          this.messageService1.add({ severity: 'success', summary: 'Success', detail: response?.message});
        } else {
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: response?.message});
        }
      });
    }
  }


  getOfferData() {
    this.homeService.getOffers().subscribe((data: any) => {
      console.log('off-',data.data)
      this.offers = data.data;
    });
  }

  getDealData() {
    this.homeService.getDeals().subscribe((data: any) => {
      this.best_deals = data.data;
    });
  }
}
