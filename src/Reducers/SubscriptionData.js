// ../Reducers/Booking.js
import { SUBSCRIPTION_DATA } from "../Actions/types";

const initialState = {
  hotelData: []
};

const SubscriptionData = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SUBSCRIPTION_DATA:
      return {
        ...state,
        SubscriptionData: payload,
      };

    default:
      return state;
  }
};

export default SubscriptionData;
