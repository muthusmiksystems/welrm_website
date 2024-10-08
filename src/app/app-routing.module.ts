import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './user/views/home/home.component';
import { LoginComponent } from './shared/login/login.component';
import { HoteldetailsComponent } from './user/views/hoteldetails/hoteldetails.component';
import { GetroomComponent } from './user/views/getroom/getroom.component';
import { BilldetailsComponent } from './user/views/billdetails/billdetails.component';
import { AuthGuard } from './auth.guard';
import { ThankyouComponent } from './user/views/thankyou/thankyou.component';
import { PrivacyPolicyComponent } from './user/views/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './user/views/terms-conditions/terms-conditions.component';
import { HelpAndSupportComponent } from './user/views/help-and-support/help-and-support.component';
import { ContactUsComponent } from './user/views/contact-us/contact-us.component';
import { HotelListingComponent } from './user/views/hotel-listing/hotel-listing.component';
import { RefundPolicyComponent } from './user/views/refund-policy/refund-policy.component';
import { BlogComponent } from './user/views/blog/blog.component';
import { BolgDetailsComponent } from './user/views/bolg-details/bolg-details.component';
import { NotFoundComponent } from './user/views/not-found/not-found.component';
import { SignupComponent } from './shared/signup/signup.component';
import { SetPasswordComponent } from './shared/set-password/set-password.component';
import { ProfileComponent } from './user/views/profile/profile.component';
import { ForgotPasswordComponent } from './shared/forgot-password/forgot-password.component';
import { AboutUsComponent } from './user/views/about-us/about-us.component';
import { HotelPartnerComponent } from './user/views/hotel-partner/hotel-partner.component';
import { OffersComponent } from './user/views/offers/offers.component';

const routes: Routes = [
  { path: '', component: HomeComponent, },
  { path: 'list/:locationSpecificHotel', component: HotelListingComponent, },
  { path: 'login', component: LoginComponent },
  { path: 'hotel-details/:hotelInfoSlug', component: HoteldetailsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-conditions', component: TermsConditionsComponent },
  { path: 'help-support', component: HelpAndSupportComponent },
  { path: 'refund-policy', component: RefundPolicyComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:slug', component: BolgDetailsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'list', component: HotelListingComponent },
  { path: 'room-details/getroom', component: GetroomComponent },
  { path: 'billdetails', component: BilldetailsComponent },
  { path: 'booksuccess', component: ThankyouComponent, canActivate: [AuthGuard], },
  { path: 'signup', component: SignupComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'setpassword', component: SetPasswordComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'hotel-partner', component: HotelPartnerComponent },
  { path: 'offers', component: OffersComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], },
  { path: '**', component:NotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
