// ../Reducers/Booking.js
import { HOTEL_DATA } from "../Actions/types";

const initialState = {
hotelData:[]
};

const HotelData = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case HOTEL_DATA:
      return {
        ...state,
        hotelData: payload,
      };

    default:
      return state;
  }
};

export default HotelData;
