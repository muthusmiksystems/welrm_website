import { Component, OnInit } from '@angular/core';
import {IMAGES} from '../../../../app/shared/constants/images.constant'
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  public images=IMAGES;
  constructor() { }

  ngOnInit(): void {
  }

}
