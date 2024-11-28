import { Component, OnInit } from '@angular/core';
import { Carousel } from 'primeng/carousel';
import { HomeService } from 'src/app/user/views/home/home.service';
import { IMAGES } from '../constants/images.constant';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss']
})
export class TestimonialComponent implements OnInit {
  public images=IMAGES;
  top_testimonial: any = [
    {
      "name": "Aman Gupta",
      "image_url": this.images.TESTIMONIAL_IMAGE01,
      "testimonal": "I have used several hotel booking apps in the past, but WELRM is by far the best one I've used. Not only did I find great hotels within my budget, but the app also provided detailed information about each hotel, including photos and reviews from other travelers.",
      "date": new Date('2017-01-03'),
    },
    {
      "name": "Amit Singh",
      "image_url": this.images.TESTIMONIAL_IMAGE02,
      "testimonal": "I recently used the WELRM Hotel Booking app for a trip and variety of hotels available within my budget. The app was easy to use and allowed me to filter my search to find the perfect hotel for my needs.",
      "date": new Date('2017-01-03'),
    },
    {
      "name": "Manoj Singh",
      "image_url": this.images.TESTIMONIAL_IMAGE03,
      "testimonal": "The hotel I booked exceeded my expectations and I had a wonderful stay. I highly recommend this app to anyone looking for affordable and reliable hotel options.",
      "date": new Date('2017-01-03'),
    },
    {
      "name": "Srinivas Thadaka",
      "image_url": this.images.TESTIMONIAL_IMAGE04,
      "testimonal": "WELRM Hotel Booking app is a game-changer for budget travelers like myself. The app is user-friendly and allows me to easily search for hotels within my budget range. The app also provided accurate information about each hotel, which helped me make an informed decision.",
      "date": new Date('2017-01-03'),
    },
    {
      "name": "Aman Gupta",
      "image_url": this.images.TESTIMONIAL_IMAGE01,
      "testimonal": "I have used several hotel booking apps in the past, but WELRM is by far the best one I've used. Not only did I find great hotels within my budget, but the app also provided detailed information about each hotel, including photos and reviews from other travelers.",
      "date": new Date('2017-01-03'),
    },
    {
      "name": "Amit Singh",
      "image_url": this.images.TESTIMONIAL_IMAGE02,
      "testimonal": "I recently used the WELRM Hotel Booking app for a trip and variety of hotels available within my budget. The app was easy to use and allowed me to filter my search to find the perfect hotel for my needs.",
      "date": new Date('2017-01-03'),
    },
    {
      "name": "Manoj Singh",
      "image_url": this.images.TESTIMONIAL_IMAGE03,
      "testimonal": "The hotel I booked exceeded my expectations and I had a wonderful stay. I highly recommend this app to anyone looking for affordable and reliable hotel options.",
      "date": new Date('2017-01-03'),
    },
    {
      "name": "Srinivas Thadaka",
      "image_url": this.images.TESTIMONIAL_IMAGE04,
      "testimonal": "WELRM Hotel Booking app is a game-changer for budget travelers like myself. The app is user-friendly and allows me to easily search for hotels within my budget range. The app also provided accurate information about each hotel, which helped me make an informed decision.",
      "date": new Date('2017-01-03'),
    },

  ];
  constructor(
    private homeService: HomeService,
  ) {
    Carousel.prototype.onTouchMove = () => { };
   }

  ngOnInit(): void {
    this.getTestimonial();
  }

  getTestimonial() {
    this.homeService.getOurTestimonial().subscribe((data: any) => {
      this.top_testimonial=data.data
    });
  }

}
