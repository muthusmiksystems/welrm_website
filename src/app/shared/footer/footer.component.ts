import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IMAGES } from '../constants/images.constant';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public images=IMAGES;
  email = new FormControl('', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],)
  currentYear = (new Date()).getFullYear()

  constructor() { }
  ngOnInit() {
  }

  openNew(url: any) {
    if (url) {
      window.open(url, '_blank')
    }
  }

  sendNewsletter() {
    console.log('this.email: ', this.email);
  }
}
