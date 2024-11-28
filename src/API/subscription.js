import toast from "react-hot-toast";
import * as actions from "../Actions/actions";
import { apiUrl } from "../Shared/shared";
import axios from "axios";

const subscription = (payload,setFrom) => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Authentication token not found. Please log in again.");
    return;
  }



  // Set the request headers with the OAuth token
  const config = {
    headers: {
      "oauth-token": token, // Include token in headers
      "Content-Type": "application/json", // Ensure correct content-type header for JSON data
    },
  };

  // Send the form data to the API
  try {
    const response = await axios.post(`${apiUrl}/subscription/purchase`, payload, config);
    // localStorage.setItem("subscriptiondata", response.data)

    if (response.data.message === "Payment failed!") {
      toast.error(response.data.message)
    }
    else {
      dispatch(actions.subscriptiondata(response.data));
      toast.success(response.data.message)
      // if (response.data.data.success) {
      setFrom(4)
      // }

    }
  } catch (error) {
    console.error("Error in payment verification:", error);
  }
};
export default subscription;

export const getSubscription =(user,setData)=> async (dispatch) =>{
  try{
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token, authorization denied.");
      return;
    }

    const config = {
      headers: {
        "oauth-token": token,
      },
    };
    const response = await axios.get(`${apiUrl}/user/getUserSubscription`, config);
    setData(response?.data?.data)
  }
  catch(error){
    console.error("Error in payment verification:", error);
  }
} 