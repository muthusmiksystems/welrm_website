import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs';
import { RatingService } from './rating.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth.service';
import {IMAGES} from '../../../shared/constants/images.constant'

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {
  public images=IMAGES;
  searchForm!: FormGroup;
  allRating: any[] = [];

  allReview: any[] = [
    {
      label: 'Last Month',
      list: [
        {
          img: 'assets/imgs/destination6.jpeg',
          hotelName: 'Hotel Luxury Villa Near Delhi Airport', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orcet, cons . . .',
          rating: '2.9',
          rStatus: 'Below Average',
          date: 'May 1, 2024'
        },
        {
          img: 'assets/imgs/destination6.jpeg',
          hotelName: 'Hotel Luxury Villa Near Delhi Airport', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orcet, cons . . .',
          rating: '2.9',
          rStatus: 'Below Average',
          date: 'May 1, 2024'
        },
        {
          img: 'assets/imgs/destination6.jpeg',
          hotelName: 'Hotel Luxury Villa Near Delhi Airport', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orcet, cons . . .',
          rating: '2.9',
          rStatus: 'Below Average',
          date: 'May 1, 2024'
        },
        {
          img: 'assets/imgs/destination6.jpeg',
          hotelName: 'Hotel Luxury Villa Near Delhi Airport', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orcet, cons . . .',
          rating: '2.9',
          rStatus: 'Below Average',
          date: 'May 1, 2024'
        },
      ]
    },
    {
      label: '1 Month ago',
      list: [
        {
          img: 'assets/imgs/destination6.jpeg',
          hotelName: 'Hotel Luxury Villa Near Delhi Airport', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orcet, cons . . .',
          rating: '2.9',
          rStatus: 'Below Average',
          date: 'May 1, 2024'
        },
        {
          img: 'assets/imgs/destination6.jpeg',
          hotelName: 'Hotel Luxury Villa Near Delhi Airport', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orcet, cons . . .',
          rating: '2.9',
          rStatus: 'Below Average',
          date: 'May 1, 2024'
        },
        {
          img: 'assets/imgs/destination6.jpeg',
          hotelName: 'Hotel Luxury Villa Near Delhi Airport', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orcet, cons . . .',
          rating: '2.9',
          rStatus: 'Below Average',
          date: 'May 1, 2024'
        },
        {
          img: 'assets/imgs/destination6.jpeg',
          hotelName: 'Hotel Luxury Villa Near Delhi Airport', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orcet, cons . . .',
          rating: '2.9',
          rStatus: 'Below Average',
          date: 'May 1, 2024'
        },
      ]
    }
  ];
  userData: any;

  constructor(
    private rating_service: RatingService,
    private formBuilder: FormBuilder,
    private messageService1: MessageService,
    private auth_service: AuthService,
  ) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      hotelname: ['', Validators.required],
    });
    this.getrating();
    this.userData = this.auth_service.getUserData();
  }
  getrating() {
    const { hotelname } = this.searchForm.value;
    this.rating_service
      .getAllRating(hotelname)
      .pipe(
        catchError((error: any) => {
          // Handle the error here, e.g., display an error message
          console.error('Error occurred:', error);
          //alert('Rating Error Chcek Console for details');
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Rating Error Chcek Console for details' });

          // You can also re-throw the error if needed
          // throw error;
          return []; // Return an empty array or a default value to handle the error gracefully
        })
      )
      .subscribe((data: any) => {
        if (data.success) {
          this.allRating = data.data;
        } else {
          //alert('Rating Response Error');
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Rating Response Error' });

        }
      });
  }

  searchrating() {
    if (this.searchForm.valid) {
      const { hotelname } = this.searchForm.value;
      this.rating_service
        .getAllRating(hotelname)
        .pipe(
          catchError((error: any) => {
            // Handle the error here, e.g., display an error message
            console.error('Error occurred:', error);
            //alert('Rating Error Chcek Console for details');
            this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Rating Error Chcek Console for details' });

            // You can also re-throw the error if needed
            // throw error;
            return []; // Return an empty array or a default value to handle the error gracefully
          })
        )
        .subscribe((data: any) => {
          if (data.success) {
            this.allRating = data.data;
          } else {
            //alert('Rating Response Error');
            this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Rating Response Error' });

          }
        });
    }
  }
}
