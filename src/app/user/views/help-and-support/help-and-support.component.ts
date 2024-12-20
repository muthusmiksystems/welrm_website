import { Component, OnInit } from '@angular/core';
import {IMAGES} from '../../../shared/constants/images.constant'
@Component({
  selector: 'app-help-and-support',
  templateUrl: './help-and-support.component.html',
  styleUrls: ['./help-and-support.component.scss']
})
export class HelpAndSupportComponent implements OnInit {
  public images=IMAGES;
  accordionItems = [
    {
      title: 'How can I become a WELRM member?',
      content: 'To select "Hotel Owner" from the application and complete a Registration flow and wait for the Admin approval',
      isOpen: true
    },
    {
      title: 'How much is the membership fees?',
      content: 'there is no cost to list your property with Welrm.',
      
    },
    {
      title: 'How to contact WELRM team?',
      content: 'You can fill the contact us form from the site or check the contact us or support page from the application.',
      
    },
    // {
    //   title: 'How to pay monthly membership fees?',
    //   content: 'From Subscription tab, you can see the valid plans, and the user can choose a plan and select the pay button and then choose any payment method from the list.',
      
    // },
    {
      title: 'Can I change the price of a Room?',
      content: 'Yes, Hotel partners can edit any room price, images, discounts from the Edit room option.',
      
    },
    {
      title: 'How can I change the availability of rooms on the application?',
      content: 'From Total Rooms tab, the user can see all added rooms, and for each room, there is an edit button. The user can edit room availability from there.',
      
    },
    {
      title: 'Can I register on WELRM platform if I have less than 10 rooms?',
      content: 'Yes, Hotel partners can register with us even if they have fewer than 10 rooms.',
      
    },
    {
      title: 'Is there any commission charges that I have to pay to WELRM?',
      content: 'Yes, WelRM is charging minimal cost i.e. 15% commission per booking.',
      
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
  
 

}
