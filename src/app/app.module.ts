import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgOptimizedImage } from '@angular/common'
import { BrowserModule, Meta } from '@angular/platform-browser';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './user/views/home/home.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HotelSearchComponent } from './shared/hotel-search/hotel-search.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoadingInterceptor } from './loading.interceptor';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './shared/login/login.component';
import { HoteldetailsComponent } from './user/views/hoteldetails/hoteldetails.component';
import { GetroomComponent } from './user/views/getroom/getroom.component';
import { AuthService } from './auth.service';
import { BilldetailsComponent } from './user/views/billdetails/billdetails.component';
import { BookingsComponent } from './user/views/bookings/bookings.component';
import { ThankyouComponent } from './user/views/thankyou/thankyou.component';
import { NotficationComponent } from './user/views/notfication/notfication.component';
import { MyprofileComponent } from './user/views/myprofile/myprofile.component';
import { RatingComponent } from './user/views/rating/rating.component';
import { ChangepasswordComponent } from './user/views/changepassword/changepassword.component';
import { ToastComponent } from './shared/toast/toast.component';
import { PrivacyPolicyComponent } from './user/views/privacy-policy/privacy-policy.component';
import { HelpAndSupportComponent } from './user/views/help-and-support/help-and-support.component';
import { TermsConditionsComponent } from './user/views/terms-conditions/terms-conditions.component';
import { ContactUsComponent } from './user/views/contact-us/contact-us.component';
import { SocialLoginModule, SocialAuthServiceConfig,GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { NgOtpInputModule } from 'ng-otp-input';
import { GalleriaModule } from 'primeng/galleria';
import {CarouselModule} from 'primeng/carousel';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';

import {
  GoogleLoginProvider
} from '@abacritt/angularx-social-login';
import { HotelListingComponent } from './user/views/hotel-listing/hotel-listing.component';
import { DataMessageService } from 'src/app/message.service';
import { ImageSliderComponent } from './shared/image-slider/image-slider.component'
import { NgImageSliderModule } from 'ng-image-slider';
import {ImageModule} from 'primeng/image';
import { RippleModule } from 'primeng/ripple'; 
import {CheckboxModule} from 'primeng/checkbox';
import {RadioButtonModule} from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RefundPolicyComponent } from './user/views/refund-policy/refund-policy.component';
import { DeleteAccountComponent } from './shared/delete-account/delete-account.component';
import { BlogComponent } from './user/views/blog/blog.component';
import { BolgDetailsComponent } from './user/views/bolg-details/bolg-details.component';
import { NotFoundComponent } from './user/views/not-found/not-found.component';
import { TabViewModule } from 'primeng/tabview';
import { SignupComponent } from './shared/signup/signup.component';
import { SetPasswordComponent } from './shared/set-password/set-password.component';
import { FiltersComponent } from './shared/filters/filters.component';
import { StepperModule } from 'primeng/stepper';
import { DropdownModule } from 'primeng/dropdown';
import { ProfileComponent } from './user/views/profile/profile.component';
import { PrSidebarComponent } from './shared/pr-sidebar/pr-sidebar.component';
import { SettingsComponent } from './user/views/settings/settings.component';
import { WishlistComponent } from './user/views/wishlist/wishlist.component';
import { SignoutComponent } from './user/views/signout/signout.component';
import { TestimonialComponent } from './shared/testimonial/testimonial.component';
import { PasswordStrengthComponent } from './shared/password-strength/password-strength.component';
import { ForgotPasswordComponent } from './shared/forgot-password/forgot-password.component';
import { RegisterComponent } from './user/views/billdetails/register/register.component';
import { AboutUsComponent } from './user/views/about-us/about-us.component';
import { HotelPartnerComponent } from './user/views/hotel-partner/hotel-partner.component';
import { OffersComponent } from './user/views/offers/offers.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ResSidebarService } from './res-sidebar.service';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    HotelSearchComponent,
    SpinnerComponent,
    LoginComponent,
    HoteldetailsComponent,
    GetroomComponent,
    BilldetailsComponent,
    BookingsComponent,
    ThankyouComponent,
    NotficationComponent,
    MyprofileComponent,
    RatingComponent,
    ChangepasswordComponent,
    ToastComponent,
    PrivacyPolicyComponent,
    HelpAndSupportComponent,
    TermsConditionsComponent,
    ContactUsComponent,
    HotelListingComponent,
    ImageSliderComponent,
    RefundPolicyComponent,
    DeleteAccountComponent,
    BlogComponent,
    BolgDetailsComponent,
    NotFoundComponent,
    SignupComponent, 
    SetPasswordComponent,
    FiltersComponent,
    ProfileComponent,
    PrSidebarComponent,
    SettingsComponent,
    WishlistComponent,
    SignoutComponent,
    TestimonialComponent,
    PasswordStrengthComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    AboutUsComponent,
    HotelPartnerComponent,
    OffersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgOptimizedImage,
    NgOtpInputModule,
    GalleriaModule,
    CarouselModule,
    CalendarModule,
    SliderModule,
    RatingModule,
    NgImageSliderModule,
    ImageModule,
    RippleModule,
    CheckboxModule,
    RadioButtonModule,
    ToastModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    TabViewModule,
    StepperModule,
    DropdownModule,
    SelectButtonModule,
    TooltipModule,
    DragDropModule,
    NgxSliderModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '677374753323-i5rjhihra4vfl8ejvaiomg8m2es4r05m.apps.googleusercontent.com'
            )
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    AuthService,
    NgbActiveModal,
    Meta,
    DataMessageService,
    MessageService,
    ResSidebarService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA ],

  bootstrap: [AppComponent],
})
export class AppModule { }
