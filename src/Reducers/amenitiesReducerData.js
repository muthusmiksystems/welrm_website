// ../Reducers/Booking.js
import { AMENITIES_DATA } from "../Actions/types";

const initialState = {
hotelData:[]
};

const AmenitiesData = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case AMENITIES_DATA:
      return {
        ...state,
        amenitiesData: payload,
      };

    default:
      return state;
  }
};

export default AmenitiesData;
