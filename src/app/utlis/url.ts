export class Url {
    //public static BASE_URL= 'https://stage-api.welrm.com/api/';
    // public static BASE_URL= 'https://api.welrm.com/api/';
    public static BASE_URL = 'http://localhost:5001/api/'
    public static COUNT= 'user/count';
    public static SEND_OTP= 'user/send-otp/owner';
    public static OWNER_SEND_OTP= 'user/send-otp/owner';
    public static VERIFY_OTP= 'user/verify-otp';
    public static LOGIN= 'login';
    public static LOGOUT= 'logout';
    public static CHANGE_PASSWORD= 'user/change-password';
    public static OWNER_ROOM= 'owner/rooms';
    public static GET_PROFILE= 'user/profile';
    public static GET_OWNER_PROFILE= 'owner/profile';
    public static UPDATE_OWNER_PROFILE= 'customer/owner-profile';
    public static DELETE_HOTEL_IMAGE= 'hotel/img/';
    public static DELETE_HOTEL_ROOM= 'hotel/room/';
    public static REGISTER_HOTEL= 'hotel/';
    public static REGISTER_HOTEL_WITHOUT_TOKEN= 'hotel/mupdate';
    public static COMPLEMENTRY_SERVICE= 'hotel/amenities';
    public static GET_ROOM_TYPE= 'option/room_type';
    public static ADD_ROOM= 'hotel/room';
    public static UPDATE_ROOM= 'hotel/room/';
    public static UPDATE_ROOM_IMAGE= 'hotel/room-img/';
    public static DELETE_ROOM_IMAGE= 'hotel/room-img/';
    public static DASHBOARD= 'owner/dashboard';
    public static ADD_ROOM_TYPE= 'option/room-type';
    public static VERIFY_EMAIL= 'user/verify-email/';
    public static FORGOT_PASSWORD= 'forgot-password';
    public static FORGOT_PASSWORD_VERIFY_OTP= 'forgot-password/otp-verify';
    public static RESET_PASSWORD= 'reset-password';
    public static SEND_MOBILE_OTP= 'user/send-mobile-otp';
    public static VERIFY_MOBILE_OTP= 'user/verify-mobile-otp';
    public static USER_RESET_PASSWORD= 'user/reset-password';
    public static SOCIAL_AUTH= 'social-auth';
    public static USER_NOTIFICATION= 'user/notifications';
    public static USER_NOTIFICATION_CLEAR= 'user/notifications/clear';
    public static USER_NOTIFICATION_SEEN= 'user/notifications/seen';
    public static GET_CUSTOMER_PROFILE= 'customer/profile';
    public static CUSTOMER_PROFILE_UPDATE= 'customer/profile';
    public static CUSTOMER_GET_HOTELS= 'customer/hotels';
    public static CUSTOMER_GET_BLOG_LIST= 'post';
    public static CUSTOMER_GET_BLOG_DETAILS= 'post/details/';
    public static CUSTOMER_GET_HOTELS_DETAILS= 'customer/hotel/';
    public static CUSTOMER_ROOMS= 'hotel/room/filter/';
    public static CUSTOMER_BOOK= 'booking/room/book';
    public static CUSTOMER_BOOK_LIST= 'booking/list';
    public static CUSTOMER_BOOK_HISTORY= 'booking/history';
    public static CUSTOMER_BOOK_CANCEL= 'booking/cancel';
    public static CUSTOMER_RATING= 'booking/rating';
    public static CUSTOMER_COUPON= 'user/coupon';
    public static CUSTOMER_COUPON_APPLY= 'user/couponUsed';
    public static CUSTOMER_ROOM_SOLD_DATE= 'hotel/getSoldOut';
    public static OWNER_BOOK_LIST= 'owner/get-pending-bookings';
    public static OWNER_BOOKED_LIST= 'owner/get-confirmed-bookings';
    public static OWNER_CANCELED_BOOKING_LIST= 'owner/get-cancelled-bookings';
    public static OWNER_CHECKOUT_BOOKING_LIST= 'owner/get-checkout-bookings';
    public static OWNER_BOOK_APPROVE= 'booking/confirm/';
    public static OWNER_BOOK_EXTEND= 'booking/extend/';
    public static OWNER_BOOK_CHECKOUT= 'owner/checkout-booking';
    public static OWNER_SUBSCRIPTIONS= 'subscription';
    public static OWNER_PURCHASE_SUBSCRIPTIONS= 'subscription/purchase';
    public static OWNER_ROOM_SOLD_OUT= 'hotel/soldOut';
    public static GET_META_TAGS= 'pages/';
    public static GET_META_BLOG_TAGS= 'post/details/';
    public static ALL_CITIES= 'city/';
    public static CUSTOMER_GET_TOP_RATED_HOTELS= 'customer/top-rated-hotels';
    public static  OUR_TESTIMONIALS= 'rating/';
    public static DEACTIVE = 'user/delete';
    public static CONTACTUS = 'other/contact_us';
    public static ADD_TO_WISHLIST = 'other/add_to_cart';
    public static REMOVE_TO_WISHLIST = 'other/remove_to_cart';
    public static GET_TO_WISHLIST = 'other/get_to_cart';
    public static GET_OFFER = 'admin/list_offer';
    public static GET_DEAL = 'admin/list_deal';
    public static SEARCH_REASULTS = 'hotel/search';
}



