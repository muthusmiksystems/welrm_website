import { Component, OnInit } from '@angular/core';
import { BlogService } from './blog.service';
import { Router } from '@angular/router';
import { Carousel } from 'primeng/carousel';
import _ from 'lodash';
import {IMAGES} from '../../../shared/constants/images.constant'

BlogService

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
public images=IMAGES;
  currentPage: number = 1;
  totalRecords: number = 0;
  blogs: any;
  allBlogs: any;
  totalPages: number = 0;
  searchResults: any;
  showSearch: boolean = false;
  showText: boolean =true
  responsiveOptions: any[] | undefined;

  blog_responsive = [
    {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 1,
      circular: false
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 1,
      circular: false
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1,
      circular: true
    },
  ];

  constructor(private blogservice: BlogService, private router: Router) {
    Carousel.prototype.onTouchMove = () => { };
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    // Perform actions to load data for the selected page
  }

  ngOnInit(): void {
    this.getBlogs();
  }

  navigateToBlogDetails(slug: string): void {
    if (slug != null && slug.length > 0) {
      this.router.navigate(['blog', slug]);
    }

  }

  removeHtmlTags(input: string): string {
    const htmlTagRegex = /<[^>]*>/g;
    return input.replace(htmlTagRegex, '');
  }

  getBlogs(showMore?) {
    this.blogservice.getBlogLists(this.currentPage).subscribe((response: any) => {
      if (response.success) {
        let hotelRes = response.data;

        if (showMore) {
          this.allBlogs = [...this.allBlogs, ...hotelRes.rows];
          this.blogs = [...this.blogs, ...hotelRes.rows];
        } else {
          this.allBlogs = _.cloneDeep(hotelRes.rows);
          this.blogs = _.cloneDeep(hotelRes.rows);
          this.totalRecords = response.data.count;
          this.totalPages = _.ceil(this.totalRecords / 9);
        }
      }
    });
  }

  showMore(page = 1) {
    this.currentPage = page;
    this.getBlogs(true);
  }

  getPublish(post: any) {
    const postDate = new Date(post);
    const today = new Date();
    const differenceInMillis = today.getTime() - postDate.getTime();
    return Math.floor(differenceInMillis / (1000 * 60 * 60 * 24));
  }
  search(event: any) {
    const inputValue = event.target.value; // Get the input value from the event object
    console.log('Input Value:', this.blogs);
    if (inputValue) {
      // Filter blogs based on whether inputValue is present in meta_keywords
      this.searchResults = this.blogs.filter(blog =>
        blog.meta_keywords.toLowerCase().includes(inputValue)
      );
      // if (this.searchResults > 0) {
      this.showText=false
        this.showSearch = true;
      // }
    } else {
      // Clear search results if input is empty
      this.searchResults = [];
      this.showText=true;
      this.showSearch = false;
    }
    console.log('Filtered Results:', this.searchResults);
  }

}
