import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HoteldetailsService } from './hoteldetails.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-hoteldetails',
  templateUrl: './hoteldetails.component.html',
  styleUrls: ['./hoteldetails.component.scss'],
})
export class HoteldetailsComponent implements OnInit {
  currentImageIndex: number = 0;
  hotelId: any;
  hotelData: any[] = []; // You might want to define a specific type instead of 'any[]'
  rating: any;
  name: any;
  address: any;
  roomTypes: any[] = [];
  roomImages: any[] = [];
  selectedRoomTypeId: any | null;

  
  constructor(
    private homedetailsService: HoteldetailsService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService1: MessageService
  ) {}

  ngOnInit(): void {
    // this.route.paramMap.subscribe((params) => {
    //   const itemId = params.get('id');
    //   this.onGetdetails(itemId);
    // });
    this.route.queryParams.subscribe(qParams => {
      const itemId = qParams['id'];
      this.onGetdetails(itemId);
    });
  }

  
  onGetdetails(id: any) {
    if (id) {
      this.homedetailsService.getHotelDetails(id).subscribe((data: any) => {
        this.hotelData = data.data.rows; // Assuming 'data' is a single object, wrap it in an array or adjust accordingly
        this.name = data.data.rows[0].hotelName;
        this.address = data.data.rows[0].address;
        this.rating = data.data.rating;
        this.roomTypes = data.data.room_types;
        this.hotelId = data.data.rows[0].id;
        this.roomImages = data.data.rows[0].images.map(
          (item: { url: any }) => item.url
        );
      });
    } else {
      this.hotelData = [];
    }
  }

  moveSlider(indexChange: number) {
    const newIndex = this.currentImageIndex + indexChange;
    // Ensure the newIndex is within bounds
    if (newIndex >= 0 && newIndex < this.roomImages.length) {
      this.currentImageIndex = newIndex;
    }
  }
  getRoomNameById(id: any) {
    const room = this.roomTypes.find((room) => room.id == id);
    return room ? room.name : null;
  }

  navigateToSecondPage() {
    if (this.selectedRoomTypeId == null) {
      //alert('Please select a room type.'); // Show alert message
      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Please select a room type' });

    } else {
      const roomTypeId = this.selectedRoomTypeId.toString();
      const roomName = this.getRoomNameById(roomTypeId);

      // Navigate to the second page if selectedRoomTypeId is not null
      // this.router.navigate([
      //   '/getroom',
      //   this.hotelId,
      //   this.selectedRoomTypeId,
      //   roomName,
      //   this.name
      // ]);
      
      this.router.navigate(['room-details','getroom'], { queryParams: {
        hotelId: this.hotelId, 
        roomTypeId: this.selectedRoomTypeId,
        roomType:roomName,
        hotelName:this.name
      }})
    }
  }
}
