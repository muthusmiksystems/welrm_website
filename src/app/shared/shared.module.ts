import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSliderComponent } from './image-slider/image-slider.component'
import { ToastComponent } from './toast/toast.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HotelSearchComponent } from './hotel-search/hotel-search.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { NgOptimizedImage } from '@angular/common'
import { BrowserModule, Meta } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FiltersComponent } from './filters/filters.component';
import { SignupComponent } from './signup/signup.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { PrSidebarComponent } from './pr-sidebar/pr-sidebar.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { CarouselModule } from 'primeng/carousel';
import { PasswordStrengthComponent } from './password-strength/password-strength.component';


@NgModule({
 
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule, ToastrModule,   CalendarModule, NgOptimizedImage, BrowserModule, CarouselModule

  ],
  exports: [ ImageSliderComponent, ToastComponent, HeaderComponent, FooterComponent, HotelSearchComponent, LoginComponent, PrSidebarComponent],
  declarations: [
     ImageSliderComponent, ToastComponent, HeaderComponent, FooterComponent, HotelSearchComponent, LoginComponent, FiltersComponent, SignupComponent, SetPasswordComponent, PrSidebarComponent, TestimonialComponent, PasswordStrengthComponent ],
})
export class SharedModule { }
