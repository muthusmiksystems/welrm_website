import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth.service';
import { WishlistServiceService } from './wishlist.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import _ from 'lodash';
import { Router } from '@angular/router';
import {IMAGES} from '../../../shared/constants/images.constant';
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  public images=IMAGES;
  results: any = [];
  blogImages: any = {
    list: []
  };
  userData: any;
  adults=2;
  childs=0;
  room=1;

  constructor(
    private modalService: NgbModal,
    private auth_service: AuthService,
    private wishlistService: WishlistServiceService,
    private messageService1: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userData = this.auth_service.getUserData();
    this.getWishlist();
  }
  
  booking(id: any, name: any) {
    this.onSetSearch(name);
    this.router.navigate(['room-details', 'getroom'], {
      queryParams: {
        hotelId: id,
        hotelName: name
      }
    })
  }

  openModal(content: any, imgs: any) {
    this.blogImages.vindex = 0;
    this.blogImages.list = imgs;
    this.modalService.open(content, { windowClass: 'blogimage-modal' });
  }

  getWishlist() {
    let userId = this.userData?.data?.user?.id;
    this.wishlistService.getAllWishlist(userId).subscribe((form: any) => {
      if (form.success) {
        this.results = form.data.result;
        this.results.forEach((element: any, index: number) => {
          element.newPrice = _.ceil(element.price - (element.price * element.discount) / 100);
          element.tax =  _.ceil((element.newPrice / 100) * 12);
        });
      } else {
        this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'test' });
      }
      });
  }
  
  gotoLocation(result) {
    if (result?.lat && result?.log) {
      let url = `http://google.com/maps/place/${result.lat},${result.log}`;
      window.open(url, '_blank');
    }
  }

  postHotelData(result) {
    let payload = {
      user_id : this.userData?.data?.user?.id,
      hotel_id : result.hotelId,
      room_id : result.roomId
    };
    result.isLoading = true;
    this.wishlistService.removeToWishlist(payload)
    .pipe(
      finalize(() => {
        result.isLoading = false;
      })
    )
    .subscribe((response: any) => {
      if (response?.success) {
        let index = this.results?.findIndex(f => f.hotelId === result.hotelId && f.roomId === result.roomId);
        if (index !== -1) {
          this.results.splice(index, 1);
        }
        this.messageService1.add({ severity: 'error', summary: 'Success', detail: response?.message});
      } else {
        this.messageService1.add({ severity: 'error', summary: 'Error', detail: response?.message});
      }
    });
  }

  onSetSearch(city) {
    let paramiterForhotelSearch: any = localStorage.getItem('paramiterForhotelSearch');
    if (paramiterForhotelSearch) {
      const index = paramiterForhotelSearch.indexOf('@#$&');
      if (index !== -1) {
        const restOfString = paramiterForhotelSearch.substring(index);
        paramiterForhotelSearch = city + restOfString;

        localStorage.setItem('paramiterForhotelSearch', paramiterForhotelSearch);
      }
    } else {
      const today = new Date(); // get today's date
			const tomorrow = new Date(today);
      paramiterForhotelSearch = city+'@#$&'+this.formatDate(today)+'@#$&'+this.formatDate(tomorrow.setDate(tomorrow.getDate() + 1))+'@#$&'+this.adults+'@#$&'+this.childs+'@#$&'+this.room;
      localStorage.setItem('paramiterForhotelSearch', paramiterForhotelSearch);
    }
  }

  formatDate(date:any) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
	
		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;
	
		return [year, month, day].join('-');
	}
}
