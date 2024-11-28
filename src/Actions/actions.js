import * as actionTypes from "./types";

// Auth

export const init_auth = () => ({
  type: actionTypes.INIT_STATE,
});

export const logout = () => ({
  type: actionTypes.LOGOUT,
});

export const auth_error = () => ({
  type: actionTypes.AUTH_ERROR,
});

export const login_failed = (payload) => ({
  type: actionTypes.LOGIN_FAIL,
  payload,
});
export const login_success = (payload) => ({
  type: actionTypes.LOGIN_SUCCESS,
  payload,
});
export const load_user = (payload) => ({
  type: actionTypes.USER_LOADED,
  payload,
});

// Booking Action

// Action to save booking history
export const getBookingSuccess = (bookingHistory) => ({
  type: actionTypes.GET_BOOKING_SUCCESS,
  payload: bookingHistory,
});

// Action to handle booking fetch failure
export const getBookingFailed = (error) => ({
  type: actionTypes.GET_BOOKING_FAILED,
  payload: error,
});

// Optionally, if you want to keep the BOOKING_HISTORY action, you can retain it.
export const setBookingHistory = (history) => ({
  type: actionTypes.BOOKING_HISTORY,
  payload: history,
});

// New Booking List

export const getNewBookingLists = (newBookingList) => ({
  type: actionTypes.NEW_BOOKING_LIST,
  payload: newBookingList,
});

export const saveNumber = (number) => ({
  type: actionTypes.SAVE_NUMBER,
  payload: number,
});


// Hotel Data


export const hotelData = (data) => ({
  type: actionTypes.HOTEL_DATA,
  payload: data
})

export const amenitiesData = (data) => ({
  type: actionTypes.AMENITIES_DATA,
  payload: data
})
export const subscriptiondata = (data) => ({
  type: actionTypes.SUBSCRIPTION_DATA,
  payload: data
})