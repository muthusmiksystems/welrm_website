// ../Reducers/Booking.js
import { SAVE_NUMBER } from "../Actions/types";

const initialState = {
  mobile: "",
  countryCode: "91",
};

const SaveNumber = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SAVE_NUMBER:
      return {
        ...state,
        mobile: payload,
      };

    default:
      return state;
  }
};

export default SaveNumber;
