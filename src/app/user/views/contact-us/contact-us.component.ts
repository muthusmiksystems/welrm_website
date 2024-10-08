import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactUsService } from './contact-us.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-contact-us',
  // templateUrl: './contact-us.component.html',
  // styleUrls: ['./contact-us.component.scss']
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private contactUsService: ContactUsService,
    private messageService1: MessageService,
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }
  
  submit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
    } else {
      let payload = this.contactForm.value;
      
      this.contactUsService.contactUs(payload).subscribe((response: any) => {
        if (response.success) {
          this.contactForm.reset();
          this.messageService1.add({ severity: 'success', summary: 'Success', detail: response.message });
        }
      });
    }
  }

}
