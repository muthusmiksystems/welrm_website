// ../Reducers/Booking.js
import {
  BOOKING_HISTORY,
  GET_BOOKING_SUCCESS,
  GET_BOOKING_FAILED,
  NEW_BOOKING_LIST,
} from "../Actions/types";

const initialState = {
  bookingHistory: [],
  booking: [],
  error: null, // Optional: to store error messages
};

const Booking = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_BOOKING_SUCCESS:
      return {
        ...state,
        bookingHistory: payload,
        error: null, // Clear any previous error
      };

    case GET_BOOKING_FAILED:
      return {
        ...state,
        error: payload, // Store the error message
      };

    case BOOKING_HISTORY:
      return {
        ...state,
        bookingHistory: payload,
      };

    case NEW_BOOKING_LIST:
      return {
        ...state,
        booking: payload,
      };

    default:
      return state;
  }
};

export default Booking;
