import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogDetailsService } from './blog-details.service';

interface Category {
  id:string;
  name: string;
  checked: boolean;
  value:string;
}

@Component({
  selector: 'app-bolg-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BolgDetailsComponent implements OnInit {

  value: any;
  blogDetails: any;
  categories: Category[] = [
    { id: 'lifestyle', name: 'Life Style', checked: true, value: 'lifestyle'},
    { id: 'travel', name: 'Travel', checked: false, value: 'travel'},
    { id: 'digitalmarketing', name: 'Digital Marketing', checked: false, value: 'digitalmarketing'},
    { id: 'Selfemployment', name: 'Self Employment', checked: false, value: 'Selfemployment'},
    { id: 'world', name: 'World', checked: false, value: 'world'},
    { id: 'art', name: 'Art', checked: false, value: 'art'},
    { id: 'business', name: 'Business', checked: false, value: 'business'},
    { id: 'fashion', name: 'Fashion', checked: false, value: 'fashion'},
  ]
  ads = [
    {
      img: 'assets/imgs/blog4.jpeg',
      title: '5 famous Places to travel this Summer Recommended by Ads',
      disc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci. Lorem ipsum dolor',
    },
    {
      img: 'assets/imgs/blog4.jpeg',
      title: '5 famous Places to travel this Summer Recommended by Ads',
      disc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci. Lorem ipsum dolor',
    },
    {
      img: 'assets/imgs/blog4.jpeg',
      title: '5 famous Places to travel this Summer Recommended by Ads',
      disc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci. Lorem ipsum dolor',
    },
    {
      img: 'assets/imgs/blog4.jpeg',
      title: '5 famous Places to travel this Summer Recommended by Ads',
      disc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae consequat orci. Lorem ipsum dolor',
    },
  ]
  blogImages: any = {
    list: [
      'assets/imgs/destination1.jpeg',
      'assets/imgs/destination2.jpeg',
      'assets/imgs/destination3.jpeg',
      'assets/imgs/destination4.jpeg',
      'assets/imgs/destination5.jpeg',
    ]
  };
  explore_responsive = [
    {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
    }
  ];

  constructor(private route: ActivatedRoute,private blogdetailsservice: BlogDetailsService) { 
    this.route.paramMap.subscribe(params => {
      this.value = params.get('slug');
    });
  }

  ngOnInit(): void {
    this.getBlogDetails(this.value);
  }

  getBlogDetails(slug: any) {
    this.blogdetailsservice.getBlogDetails(slug).subscribe((data: any) => {
      if (data.code == 200) {
        this.blogDetails = data.data[0];
        console.log("blog details",this.blogDetails);
      }
    });
  }

  toggleRadio(item: any): void {
    this.categories.forEach(option => {
      if (option.id === item.id) {
        option.checked = true;
      } else {
        option.checked = false;
      }
      return option;
    });
  }

}
