import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize } from 'rxjs';
import { HomeService } from '../home/home.service';
import { Carousel } from 'primeng/carousel';
import {IMAGES} from '../../../../app/shared/constants/images.constant'
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  public images=IMAGES;
  top_cities: any = [];
  top_Rated_Properties: any = [];
  cubeGrp = [
    { numberofCube:'3.5', label: 'Years Experience' },
    { numberofCube:'100+', label: 'Trusted Customers' },
    { numberofCube:'890+', label: 'Positive revives' },
    { numberofCube:'2000+', label: 'Our Explorers' },
    { numberofCube:'100+', label: 'Destinations' },
    { numberofCube:'10k+', label: 'Happy Customers' },
  ]
  accordItems = [
    {
      title: 'Innovative Platform', 
      content: 'Our cutting-edge technology ensures a smooth and user-friendly booking experience for all users.'
    },
    {
      title: 'Trusted Network', 
      content: 'We partner with reliable hotels and hosts, ensuring high standards and trustworthy accommodations.'
    },
    {
      title: 'Customer Focus', 
      content: 'Our priority is to provide exceptional service and cater to the unique needs of every traveler.'
    },
    {
      title: 'Diverse Options', 
      content: 'We offer a wide variety of destinations and accommodations to suit every travel preference.'
    },
    {
      title: 'Continuous Growth', 
      content: 'Committed to constant improvement, we expand our offerings and enhance our services regularly.'
    },
  ]
  meet_team = [
    {
      img: this.images.NO_IMAGE,
      name: 'Gurmukh Singh',
      post: 'Founder & Director'
    },    
    {
      img: this.images.NO_IMAGE,
      name: 'Arshpreet Kaur',
      post: 'Managing Director'
    },
    {
      img: this.images.NO_IMAGE,
      name: 'Jugjeet Singh',
      post: 'Director'
    },
    {
      img: this.images.NO_IMAGE,
      name: 'Harmeet Singh',
      post: 'Co-Founder'
    },
    {
      img: this.images.NO_IMAGE,
      name: 'Shahab Uddin',
      post: 'Graphic Designer'
    },
  ]
  meet_team_responsive = [
    {
        breakpoint: '991px',
        numVisible: 4,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible:2,
        numScroll: 1
    },
  ];
  footerTabs = [
    {id: 'TopCities', title: 'Top Cities', content: []},
    {id: 'TopHotels', title: 'Top Hotels', content: []},
    {id: 'PopularDestinations', title: 'Popular Destinations', content: []},
    {id: 'PopularHotels', title: 'Popular Hotels', content: []},
  ];
  top_destinations: any = [
    {
      "name": "Beaches",
      "image_url": this.images.DESTINATION1,
      "address": 'Goa',
      "rating": "4.9"
    },
    {
      "name": "Dream City",
      "image_url": this.images.DESTINATION2,
      "address": 'Mumbai',
      "rating": "4.9"
    },
    {
      "name": "Mountains and Snow",
      "image_url": this.images.DESTINATION3,
      "address": 'Manali',
      "rating": "4.9"
    },
    {
      "name": "Religious Places",
      "image_url": this.images.DESTINATION4,
      "address": 'Punjab',
      "rating": "4.9"
    },
    {
      "name": "Desert Safari",
      "image_url": this.images.DESTINATION5,
      "address": 'Jaisalmer',
      "rating": "4.9"
    },
    {
      "name": "Pink City",
      "image_url": this.images.DESTINATION5,
      "address": 'Jaipur',
      "rating": "4.9"
    },
  ];

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) {
    Carousel.prototype.onTouchMove = () => { };
  }

  ngOnInit(): void {
    this.getData();
  }

  scrollTop() {
    window.scroll(0, 0);
  }

  onCityChange(city: string) {
    this.router.navigate([`list`, `hotels-in-${city}`], {
      queryParams: {
        city: city
      }
    })
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
          this.top_cities = allCities.data;
        }
        if (allTopRatedProperities.success) {
          this.top_Rated_Properties = allTopRatedProperities.data.result;
        }
      });
  }

  booking(id: any, name: any) {
    this.router.navigate(['room-details','getroom'], { queryParams: { hotelId: id, hotelName:name }})
  }

}
