import axios from "axios";
import * as actions from "../Actions/actions";
import { apiUrl } from "../Shared/shared";
import toast from "react-hot-toast";

export const HotelData = (data) => {
  return (dispatch) => {
    dispatch(actions.hotelData(data));
  };
};
export const Amenities = () => (dispatch) => {
 

  // Display a loading toast
  const token = localStorage?.getItem("token");
  const config = {
    headers: {
      "oauth-token": token, // Send the token with the oauth-token key
    },
  };

  axios
    .get(`${apiUrl}/hotel/amenities`, config) // Replace with your actual endpoint
    .then((res) => {
      dispatch(actions.amenitiesData(res.data));
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      console.log("Finished fetching bookings");
    });
}
