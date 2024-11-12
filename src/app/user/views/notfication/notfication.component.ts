import { Component, OnInit } from '@angular/core';
import { NotficationService } from './notfication.service';
import { catchError, finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-notfication',
  templateUrl: './notfication.component.html',
  styleUrls: ['./notfication.component.scss'],
})
export class NotficationComponent implements OnInit {
  notifications: any[] = [];
  activeTab = 0;
  tabs: any[] = [
    {
      label: 'Notifications',
      slug: 'Notifications',
      content: [],
    },
    {
      label: 'Offers',
      slug: 'Offers',
      content: [],
    },
    {
      label: 'History',
      slug: 'History',
      content: [],
    },
  ];
  allOffers = [
    {
      label: 'Today',
      child: [
        {
          img: 'assets/imgs/destination4.jpeg',
          title: 'Avail New Year discounts on Luxury Hotels upto 35%',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci',
        },
        {
          img: 'assets/imgs/destination4.jpeg',
          title: 'Avail New Year discounts on Luxury Hotels upto 35%',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci',
        },
      ]
    },
    {
      label: '1 week Ago',
      child: [
        {
          img: 'assets/imgs/destination4.jpeg',
          title: 'Avail New Year discounts on Luxury Hotels upto 35%',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci',
        },
      ]
    }
  ];
  isLoading = false;
  userData: any;

  constructor(
    private notificaton_service: NotficationService,
    private messageService1: MessageService,
    private auth_service: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userData = this.auth_service.getUserData();
    this.getNotifications();
  }

  getNotifications() {
    this.isLoading = true;
    this.notificaton_service
      .getNotification()
      .pipe(
        catchError((error: any) => {
          // Handle the error here, e.g., display an error message
          console.error('Error occurred:', error);
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Notification Error Chcek Console for details' });

          // You can also re-throw the error if needed
          // throw error;
          return []; // Return an empty array or a default value to handle the error gracefully
        }),
        finalize(() => {
          this.isLoading = false;
          // This block will run after both API calls complete (success or error)
          // You can add finalization logic here
        })
      )
      .subscribe((data: any) => {
        if (data.success) {
          this.notifications = data.data;
          this.tabs[0].content = this.notifications;
          this.tabs[1].content = this.allOffers;
          this.notifications.forEach(el => {
            if (el?.title.includes('Booking Confirmed')) {
              el.img = 'assets/imgs/booking-confirm.svg';
            } else if (el?.title.includes('Booking Cancelled')) {
              el.img = 'assets/imgs/cancellation-policy.svg';
            } else if (el?.title.includes('Password changed')) {
              el.img = 'assets/imgs/event.svg';
            } else if (el?.title.includes('Rating')) {
              el.img = 'assets/imgs/feedback-request.svg';
            }
          });
        }
        else {
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Notification Response Error' });
        }
      });
  }
  offer() {
    this.router.navigateByUrl('offers');
  }
  toggleTab(tabIndex: number) {
    this.activeTab = tabIndex;
  }
}
