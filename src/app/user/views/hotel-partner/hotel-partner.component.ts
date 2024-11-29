import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hotel-partner',
  templateUrl: './hotel-partner.component.html',
  styleUrls: ['./hotel-partner.component.scss']
})
export class HotelPartnerComponent implements OnInit {
  registerCard = [
    {
      img: 'assets/imgs/profile-manage.svg',
      title: 'Profile Management',
      desc: 'Easy Profile Management: Update your hotel’s profile details with ease. Add photos, descriptions, and amenities to attract more guests.',
    },
    {
      img: 'assets/imgs/flexible-pricing.svg',
      title: 'Flexible Pricing',
      desc: 'Set and adjust your hotel prices whenever you want. Respond to market changes quickly and efficiently.',
    },
    {
      img: 'assets/imgs/room-manage.svg',
      title: 'Room Management',
      desc: 'Keep your room availability up to date. Add or remove room details and ensure your guests have the most accurate information.',
    },
    {
      img: 'assets/imgs/booking-manage.svg',
      title: 'Booking Management',
      desc: 'Accept and confirm bookings directly through the app. Stay organized and provide a seamless experience for your guests.',
    },
    {
      img: 'assets/imgs/earnings.svg',
      title: 'Earnings Overview',
      desc: 'Monitor your daily, weekly, and monthly earnings at a glance. Track your revenue and identify trends to optimize your business strategy.',
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
