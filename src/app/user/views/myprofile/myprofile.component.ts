import { Component, OnInit } from '@angular/core';
import { MyprofileService } from './myprofile.service';
import { catchError } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { MessageService } from 'primeng/api';
import {IMAGES} from "../../../shared/constants/images.constant";

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss'],
})
export class MyprofileComponent implements OnInit {
  public images=IMAGES;
  profileData: any[] = [];
  fullName: string | undefined;
  email: string | undefined;
  mobile: any | null;
  countryCode: any | null;
  userImg = null;

  constructor(private messageService1: MessageService, private myprofile_service: MyprofileService,private auth_service:AuthService) {}

  ngOnInit(): void {
    this.getprofile();
  }

  getprofile() {
    this.myprofile_service
      .getProfileData()
      .pipe(
        catchError((error: any) => {
          // Handle the error here, e.g., display an error message
          console.error('Error occurred:', error);
          //alert('Owner Profile Error Chcek Console for details');
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Owner Profile Error Chcek Console for details' });

          // You can also re-throw the error if needed
          // throw error;
          return []; // Return an empty array or a default value to handle the error gracefully
        })
      )
      .subscribe((data: any) => {
        if (data.success) {
          // this.auth_service.storeUserData(data);
          this.profileData = data.data.user;
          this.fullName = data.data.user.fullName;
          this.email = data.data.user.email;
          this.mobile = data.data.user.mobile;
          this.countryCode = data.data.user.countryCode;
        } else {
          //alert('Owner Profile Response Error');
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Owner Profile Response Error' });
        }
      });
  }
  updateCustomerProfile() {
    const email = this.email;
    const name  = this.fullName;
    this.myprofile_service
      .updateProfile(name,email)
      .pipe(
        catchError((error: any) => {
          // Handle the error here, e.g., display an error message
          console.error('Error occurred:', error);
          //alert('Owner Profile Update Error Chcek Console for details');
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Owner Profile Update Error Chcek Console for details' });

          // You can also re-throw the error if needed
          // throw error;
          return []; // Return an empty array or a default value to handle the error gracefully
        })
      )
      .subscribe((data: any) => {
        if (data.success) {
          //alert(data.message);
          this.messageService1.add({ severity: 'success', summary: 'Success', detail: data.message });

          this.getprofile();
        } else {
          //alert('Owner Profile Update Response Error');
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Owner Profile Update Response Error' });

        }
      });
  }

  fileUpload(event: any) {
    let file = event.target.files[0];

    if (file && file.type) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.userImg = e.target.result;
      }
    }
  }
}
