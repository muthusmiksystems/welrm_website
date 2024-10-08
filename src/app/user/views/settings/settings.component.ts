import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings = [
    {
      id: 'setting1',
      name:'Reservation Emails',
      disc: 'Emails you receive after making a reservation. This includes invitations to review  the properties you stayed in.',
    },
    {
      id: 'setting2',
      name:'Upcoming Bookings',
      disc: 'Emails that remind you of your upcoming booking with all details. ',
    },
    {
      id: 'setting3',
      name:'Review Invites',
      disc: 'Emails inviting you to leave a review on the property you stayed at.',
    },
    {
      id: 'setting4',
      name:'Offers & Confirmation Emails',
      disc: 'Other product deals and upgrades in your confirmation emails.',
    },
    {
      id: 'setting5',
      name:'Confirmation Emails',
      disc: 'You are not able to unsubscribe from booking confirmation emails',
    },
    {
      id: 'setting6',
      name:'Promotion & Deals',
      disc: 'These Emails includes promotions, deals, products, travel experience, loyalty programs and other newsletters and services',
    },
  ];
  constructor(
    private modalService: NgbModal,
    private messageService1: MessageService,
    private auth_service: AuthService
  ) { }

  ngOnInit(): void {
  }

  deleteAccount(): void {
    this.auth_service.accountDelete().subscribe((response:any) => {
      if (response.success) {
        if (response.code === 200) {
          this.messageService1.add({ severity: 'success', summary: 'Success', detail: response.message });
        } else {
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'success 200 but code error' });
        }
        this.modalService.dismissAll();
      } else {
        this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Success Error' });
        this.modalService.dismissAll();
      }
    })
  }

  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'delete-ac-modal' })
  }
}
