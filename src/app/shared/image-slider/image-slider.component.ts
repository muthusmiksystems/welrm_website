import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss']
})
export class ImageSliderComponent implements OnInit {

  @Input() imageG: Array<Object>;
  @Input() heightV: number=0;
  styleS=''
  

  imageObject:any[] = [];


  constructor() {

 this.imageG=[]

   }

  ngOnInit(): void {
 
  this.styleS= "{width: '100%', height:" +this.heightV+"}";
    this.imageG.forEach(ele=>{
      this.imageObject.push({'image': ele, 'thumbImage': ele, 'title':''})

    })
  }

}
