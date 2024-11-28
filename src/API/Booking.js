import { toast } from "react-hot-toast";
import axios from "axios";
import * as actions from "../Actions/actions";
import { apiUrl } from "../Shared/shared";

// Action to get booking information
export const getBookingHistory = () => (dispatch) => {

  // Display a loading toast
  const loadingToastId = toast.loading("Fetching bookings...");
  const token = localStorage?.getItem("token");
  const config = {
    headers: {
      "oauth-token": token, // Send the token with the oauth-token key
    },
  };

  axios
    .get(`${apiUrl}/booking/history`, config) // Replace with your actual endpoint
    .then((res) => {

      // Dispatch success action with booking data
      dispatch(actions.getBookingSuccess(res.data)); // Make sure to define this action

      // Update the loading toast to success
      toast.success("Booked fetched successfully!", { id: loadingToastId });
    })
    .catch((err) => {
      console.error(err);

      // Dispatch failure action if an error occurs
      if (err.response) {
        dispatch(actions.getBookingFailed(err.response.data.message)); // Make sure to define this action

        // Update the loading toast to an error message
        toast.error(err.response.data.message || "Failed to fetch bookings!", {
          id: loadingToastId,
        });
      } else {
        // If no response from server, show a generic error
        toast.error("Failed to fetch bookings! Please try again.", {
          id: loadingToastId,
        });
      }
    })
    .finally(() => {
      console.log("Finished fetching bookings");
    });
};

export const newBookingList = () => (dispatch) => {

  // Display a loading toast
  // const loadingToastId = toast.loading("Fetching bookings...");
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "oauth-token": token, // Send the token with the oauth-token key
    },
  };

  axios
    .get(`${apiUrl}/booking/list`, config) // Replace with your actual endpoint
    .then((res) => {

      // Dispatch success action with booking data
      dispatch(actions.getNewBookingLists(res.data)); // Make sure to define this action

      // Update the loading toast to success
      // toast.success("New Bookings  fetched successfully!", {
      //   id: loadingToastId,
      // });
      return ;
    })
    .catch((err) => {
      console.error(err);

      // Dispatch failure action if an error occurs
      if (err.response) {
        dispatch(actions.getBookingFailed(err.response.data.message)); // Make sure to define this action

        // Update the loading toast to an error message
        // toast.error(err.response.data.message || "Failed to fetch bookings!", {
        //   id: loadingToastId,
        // });
      } else {
        // If no response from server, show a generic error
        toast.error("Failed to fetch bookings! Please try again.");
      }
    })
    .finally(() => {
      console.log("Finished fetching bookings");
    });
};

export const acceptBooking = (data, setOpenDialog, status) => (dispatch) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "oauth-token": token, // Send the token with the oauth-token key
    },
  };
  const payload = {
    ...data,
    status: status,
  };

  // Return the axios promise so that it can be awaited or chained with `.then()`
  return axios
    .put(`${apiUrl}/booking/confirm/${data.roomId}/${data.id}`, payload, config)
    .then((res) => {
      dispatch(actions.getNewBookingLists(res.data)); // Dispatch success action
      toast.success(`Booking ${status} Successfully`);
      setOpenDialog(false); // Close the dialog
      dispatch(newBookingList());
    })
    .catch((err) => {
      console.error(err);
      setOpenDialog(false); // Close dialog on error
      if (err.response) {
        dispatch(actions.getBookingFailed(err.response.data.message)); // Dispatch failure action
      } else {
        toast.error("Failed to fetch bookings! Please try again.");
      }
    })
    .finally(() => {
      console.log("Finished fetching bookings");
    });
};

export const cancelBooking = (data) => (dispatch) => {
  // const navigate = useNavigate()

  // Display a loading toast
  // const loadingToastId = toast.loading("Fetching bookings...");
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "oauth-token": token, // Send the token with the oauth-token key
    },
  };

  axios
    .put(`${apiUrl}/booking/cancel/${data.roomId}/${data.id}`, data, config)
    // Replace with your actual endpoint
    .then((res) => {

      // Dispatch success action with booking data
      // dispatch(actions.getNewBookingLists(res.data)); // Make sure to define this action

      // Update the loading toast to success
      toast.success("Booking Cancelled Successfully");
      dispatch(newBookingList());

    })
    .catch((err) => {
      console.error(err);

      // Dispatch failure action if an error occurs
      if (err.response) {
        dispatch(actions.getBookingFailed(err.response.data.message)); // Make sure to define this action
        // navigate('NewBooking')
        // Update the loading toast to an error message
        // toast.error(err.response.data.message || "Failed to fetch bookings!", {
        //   id: loadingToastId,
        // });
      } else {
        // If no response from server, show a generic error
        toast.error("Failed to fetch bookings! Please try again.");
      }
    })
    .finally(() => {
      console.log("Finished fetching bookings");
    });
};