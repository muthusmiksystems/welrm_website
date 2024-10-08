import { Component, HostListener, OnInit } from '@angular/core';
import { DataMessageService } from 'src/app/message.service'
import { HotelListingService } from './hotel-listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize } from 'rxjs';
import { HomeService } from '../home/home.service';
import _ from 'lodash';
import { WishlistServiceService } from '../wishlist/wishlist.service';
import { AuthService } from 'src/app/auth.service';
import { MessageService } from 'primeng/api';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';


@Component({
  selector: 'app-hotel-listing',
  templateUrl: './hotel-listing.component.html',
  styleUrls: ['./hotel-listing.component.scss']
})
export class HotelListingComponent implements OnInit {
  isScrolled = false;
  defaultrating = 3;
  currentRoute: string;
  homedata: any[] = [];
  rangeValues: any;
  results: any[] = [];
  resultsCopy: any[] = [];

  slideIndex = 0;
  currentPage: number = 1;
  totalPages = 1;
  totalRecords = 0;
  value: number | undefined;
  valueName: any | undefined;
  private interval: any;
  filterItems = [
    { label: 'Hightest Rating', value: 'Hightest Rating', subValue: 1, key: 'desc', type: 'rating' },
    { label: 'High to low price', value: 'High to low price', subValue: 2, key: 'desc', type: 'price' },
    { label: 'Low to high price', value: 'Low to high price', subValue: 3, key: 'asc', type: 'price' },
  ];
  selectedFilter: any;
  selectedCity: string | undefined;
  cityQuery: string = '';
  paramiterForhotelSearch: any = '';
  cityOrhotelOrneighborhood: any = '';
  checkInDate: any = '';
  checkOutDate: any = '';
  adults: any = 1;
  childs: any = 0;
  room: any = 1;
  isChecked: boolean = false;
  fromHomePageSearch: boolean = false;
  closeResult: string | undefined;
  blogImages: any = {
    list: []
  };
  isLoading = false;
  footerTabs = [
    { id: 'TopCities', title: 'Top Cities', content: [] },
    { id: 'TopHotels', title: 'Top Hotels', content: [] },
    { id: 'PopularDestinations', title: 'Popular Destinations', content: [] },
    { id: 'PopularHotels', title: 'Popular Hotels', content: [] },
  ];
  top_destinations: any = [
    {
      "name": "Beaches",
      "image_url": "assets/imgs/destination1.jpeg",
      "address": 'Goa',
      "rating": "4.9",
      "count": "4"
    },
    {
      "name": "Dream City",
      "image_url": "assets/imgs/destination2.jpeg",
      "address": 'Mumbai',
      "rating": "4.9",
      "count": "4"
    },
    {
      "name": "Mountains and Snow",
      "image_url": "assets/imgs/destination3.jpeg",
      "address": 'Manali',
      "rating": "4.9",
      "count": "4"
    },
    {
      "name": "Religious Places",
      "image_url": "assets/imgs/destination4.jpeg",
      "address": 'Punjab',
      "rating": "4.9",
      "count": "4"
    },
    {
      "name": "Desert Safari",
      "image_url": "assets/imgs/destination5.jpeg",
      "address": 'Jaisalmer',
      "rating": "4.9",
      "count": "4"
    },
    {
      "name": "Pink City",
      "image_url": "assets/imgs/destination6.jpeg",
      "address": 'Jaipur',
      "rating": "4.9",
      "count": "4"
    },
  ];
  top_Rated_Properties: any = [];
  top_cities: any = [];
  userId: any;
  isMobileView = false;
  chips = [
    { name: 'Popular' },
    { name: 'Spa' },
    { name: '5 Star' },
    { name: 'Hot tub' },
    { name: 'Beach Front' },
    { name: 'Golden Temple' },
  ];

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private messageService: DataMessageService,
    private listingService: HotelListingService,
    private router: Router,
    private homeService: HomeService,
    private wishlistService: WishlistServiceService,
    private authService: AuthService,
    private messageService1: MessageService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url; // Get the current route
    });

    this.selectedFilter = this.filterItems[0];
    this.messageService.getMessage().subscribe(message => {
      if (message.event == 'paramiterForhotelSearch') {

        this.paramiterForhotelSearch = message.data;
        this.fromHomePageSearch = true;
        const paramiterForhotelSearchArray = this.paramiterForhotelSearch.split("@#$&");
        this.cityOrhotelOrneighborhood = paramiterForhotelSearchArray[0]
        this.checkInDate = paramiterForhotelSearchArray[1]
        this.checkOutDate = paramiterForhotelSearchArray[2]
        this.adults = paramiterForhotelSearchArray[3]
        this.childs = paramiterForhotelSearchArray[4]
        this.room = paramiterForhotelSearchArray[5]
      }
      if (message.event == 'hotelSearchApicall') {
        this.isLoading = true;
        setTimeout(() => {
          this.getData();
        }, 1000);
      }
    });

    this.paramiterForhotelSearch = localStorage.getItem('paramiterForhotelSearch');
    if (this.paramiterForhotelSearch != null) {

      const paramiterForhotelSearchArray = this.paramiterForhotelSearch.split("@#$&");
      this.cityOrhotelOrneighborhood = paramiterForhotelSearchArray[0]
      this.checkInDate = paramiterForhotelSearchArray[1]
      this.checkOutDate = paramiterForhotelSearchArray[2]
      this.adults = paramiterForhotelSearchArray[3]
      this.childs = paramiterForhotelSearchArray[4]
      this.room = paramiterForhotelSearchArray[5]

      this.isLoading = true;
      setTimeout(() => {
        this.getData();
      }, 1000)

    }

    this.route.queryParams.subscribe(qParams => {
      if (qParams && qParams['city']) {
        this.cityQuery = qParams['city'];
        let formdata = localStorage.getItem("paramiterForhotelSearch");
        if (formdata) {
          const paramiterForhotelSearchArray = formdata.split("@#$&");
          paramiterForhotelSearchArray[0] = this.cityQuery;
          const updatedFormdata = paramiterForhotelSearchArray.join("@#$&");
          localStorage.setItem("paramiterForhotelSearch", updatedFormdata);
          this.cityQuery = this.cityQuery;
          this.cityOrhotelOrneighborhood = this.cityQuery;
        } else {
          console.warn("No formdata found in localStorage.");
        }
        console.log("Updated formdata:", localStorage.getItem("paramiterForhotelSearch"));
        this.currentPage = 1;
        this.listingService.getHotelListsByCity(this.cityQuery, this.currentPage).subscribe((response: any) => {
          if (response.success) {
            // this.results = response.data.result;
            // this.resultsCopy = response.data.result;

            // this.results.forEach((element: any, index: number) => {
            //   element['slug'] = this.convertToSlug(`${element['hotelName']}`);
            // })

            // this.resultsCopy.forEach((element: any, index: number) => {
            //   element['slug'] = this.convertToSlug(`${element['hotelName']}`);
            // })
            let hotelRes = response.data;
            hotelRes?.result.forEach((element: any, index: number) => {
              element.newPrice = _.ceil(element.price - (element.price * element.discount) / 100);
              element.tax = _.ceil((element.newPrice / 100) * 12);
              element['slug'] = this.convertToSlug(`${element['hotelName']}`);
            });
            let isChangeRange = this.rangeValues ? this.rangeValues.value !== 500 || this.rangeValues.highValue !== 25000 : false;
            let showMore = false;
            if (showMore) {
              this.resultsCopy = [...this.resultsCopy, ...hotelRes.result];
              this.results = isChangeRange ? this.filterCity() : [...this.results, ...hotelRes.result];
            } else {
              this.resultsCopy = _.cloneDeep(hotelRes.result);
              this.results = isChangeRange ? this.filterCity() : _.cloneDeep(hotelRes.result);
              this.totalRecords = response.data.total;
              this.totalPages = _.ceil(this.totalRecords / 10);
            }

          }
        })
        // this.showMore();
      } else {
        this.isLoading = true;
        setTimeout(() => {
          this.getData();
        }, 1000);
      }
    });

    let userData = this.authService.getUserData();
    if (userData) {
      this.userId = userData?.data?.user?.id;
    }
  }
  ngOnInit(): void {
    console.log("hotellisting test")
    this.getHuntHotelData()
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

  handleChange(event: any) {
    this.rangeValues = event;
    console.log('rangeValues', this.rangeValues)
    setTimeout(() => {
      this.results = this.filterCity();
    }, 200);
  }

  checkRatingFilterValue(e: any, val: any) {
    // if (this.rangeValues == 0) {
    this.results = [];

    if (e.currentTarget.checked && val == 5) {
      this.filterPushF(5)

    } else if (e.currentTarget.checked == false && val == 5) {

      this.filterPapF(5)
    }

    if (e.currentTarget.checked && val == 4) {
      this.filterPushF(4)

    } else if (e.currentTarget.checked == false && val == 4) {

      this.filterPapF(4)
    }


    if (e.currentTarget.checked && val == 3) {
      this.filterPushF(3)

    } else if (e.currentTarget.checked == false && val == 3) {

      this.filterPapF(3)
    }


    if (e.currentTarget.checked && val == 2) {
      this.filterPushF(2)

    } else if (e.currentTarget.checked == false && val == 2) {

      this.filterPapF(2)
    }


    if (e.currentTarget.checked && val == 1) {
      this.filterPushF(1)

    } else if (e.currentTarget.checked == false && val == 1) {

      this.filterPapF(1)
    }



    if (e.currentTarget.checked && val == 0) {
      this.filterPushF(0)

    } else if (e.currentTarget.checked == false && val == 0) {

      this.filterPapF(0)
    }



    // } else {


    // }



  }

  filterPushF(val: any) {
    this.resultsCopy.forEach(e => {
      if (e.rating == val) {
        this.results.push(e)
      }
    })
  }

  filterPapF(val: any) {
    this.results.forEach((e, index) => {
      if (e.rating == val) {
        if (index > -1) {
          this.results.splice(index, 1);
        }
      }
    })
  }

  filterCity() {
    this.results = [];
    // this.resultsCopy.forEach(e => {
    //   if (e.newPrice <= this.rangeValues) {
    //     this.results.push(e);
    //   }
    // });
    return this.resultsCopy.filter(hotel => {
      const newPrice = hotel.newPrice;
      return newPrice >= this.rangeValues.value && newPrice <= this.rangeValues.highValue;
    });
  }

  // moveSlider(index: number, direction: number) {
  //   const slider = document.querySelectorAll<HTMLElement>('.slider')[index];
  //   this.slideIndex = (this.slideIndex + direction + slider.children.length) % slider.children.length;
  //   this.results[index].slideIndex = this.slideIndex;
  //   const translateValue = -this.slideIndex * 100;
  //   slider.style.transform = `translateX(${translateValue}%)`;
  // }

  getData(showMore?) {
    console.log("getData");
    this.listingService.getHotelListsBySearch(this.cityOrhotelOrneighborhood, this.checkInDate, this.checkOutDate, this.adults, this.selectedFilter, this.currentPage)
      .pipe(finalize(() => {
        this.isLoading = false;
      })
      ).subscribe((response: any) => {
        if (response.success) {
          console.log("hotelsearchlisting")
          let hotelRes = response.data;
          hotelRes?.result.forEach((element: any, index: number) => {
            element.newPrice = _.ceil(element.price - (element.price * element.discount) / 100);
            element.tax = _.ceil((element.newPrice / 100) * 12);
            element['slug'] = this.convertToSlug(`${element['hotelName']}`);
          });
          let isChangeRange = this.rangeValues ? this.rangeValues.value !== 500 || this.rangeValues.highValue !== 25000 : false;

          if (showMore) {
            this.resultsCopy = [...this.resultsCopy, ...hotelRes.result];
            this.results = isChangeRange ? this.filterCity() : [...this.results, ...hotelRes.result];
          } else {
            this.resultsCopy = _.cloneDeep(hotelRes.result);
            this.results = isChangeRange ? this.filterCity() : _.cloneDeep(hotelRes.result);
            this.totalRecords = response.data.total;
            this.totalPages = _.ceil(this.totalRecords / 10);
          }
        }
      })
  }

  convertToSlug(txt: string) {
    return txt.toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  showMore(page = 1) {
    this.currentPage = page;
    this.getData(true);
    // let query = 'page=' + this.currentPage;
    // if (this.value) {
    //   query += '&';
    //   if (this.value === 1) {
    //     query += 'sort=desc&col=rating'
    //   }
    //   if (this.value === 2) {
    //     query += 'sort=desc&col=price'
    //   }
    //   if (this.value === 3) {
    //     query += 'sort=asc&col=price'
    //   }
    // }
  }

  ChangeSortOrder(item: any) {
    if (this.selectedFilter?.value !== item?.value) {
      // this.value = value;
      this.selectedFilter = item;
      this.isLoading = true;
      this.currentPage = 1;
      setTimeout(() => {
        this.getData();
      }, 200);
      // this.showMore();
    }
  }

  ngOnDestroy() {
    this.results = [];
  }

  booking(id: any, name: any) {
    if (this.fromHomePageSearch) {
      setTimeout(() => {
        this.messageService.sendMessage('paramiterForhotelSearchh', this.paramiterForhotelSearch);
      }, 1000);
    }
    this.router.navigate(['room-details', 'getroom'], {
      queryParams: {
        hotelId: id,
        hotelName: name
      }
    })
    // this.router.navigate([`list`]);
  }

  openModal(content: any, imgs: any) {
    this.blogImages.vindex = 0;
    this.blogImages.list = imgs;
    this.modalService
      .open(content, { windowClass: 'blogimage-modal' })
      .result.then(
        (result: any) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  open(content: any) {
    this.modalService.open(content, { windowClass: 'filterModal' });
  }

  onCityChange(city: string) {
    // console.log()

    console.log('city---', city)
    this.router.navigate([`list`, `hotels-in-${city}`], {
      queryParams: {
        city: city
      }
    })

  }

  getHuntHotelData() {
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
          console.log('allCities--', allCities.data)
          this.top_cities = allCities.data;
        }
        if (allTopRatedProperities.success) {
          console.log('allTopRatedProperities--', allTopRatedProperities.data)
          this.top_Rated_Properties = allTopRatedProperities.data.result;
        }
      });
  }

  getCeilPrice(price) {
    return _.ceil(price);
  }

  postHotelData(result) {
    let payload = {
      user_id: this.userId,
      hotel_id: result.hotelId,
      room_id: result.roomId
    };
    if (!this.userId) {
      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Please login' });
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
            this.messageService1.add({ severity: 'error', summary: 'Success', detail: response?.message });
          } else {
            this.messageService1.add({ severity: 'error', summary: 'Error', detail: response?.message });
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
            this.messageService1.add({ severity: 'success', summary: 'Success', detail: response?.message });
          } else {
            this.messageService1.add({ severity: 'error', summary: 'Error', detail: response?.message });
          }
        });
    }
  }

  gotoLocation(result) {
    if (result?.lat && result?.log) {
      let url = `http://google.com/maps/place/${result.lat},${result.log}`;
      window.open(url, '_blank');
    }
  }

  onSearchChange(event) {
    if (event) {
      setTimeout(() => {
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });
      }, 0);
    }
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    // Update isScrolled based on scroll position
    this.isScrolled = scrollTop >= 10 ? true : false;
  }
}
