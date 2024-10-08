import { Component, OnInit } from '@angular/core';
import { MetaService } from 'src/app/meta.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(private metaService: MetaService) {
  }

  ngOnInit(): void {
  }

}
