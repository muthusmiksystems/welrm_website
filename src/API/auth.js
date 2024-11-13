import { toast } from "react-hot-toast";
import axios from "axios";
import * as actions from "../Actions/actions";
import { apiUrl } from "../Shared/shared";

export const LoginUser = (payload, navigate) => async (dispatch) => {

  // Initialize authentication process
  dispatch(actions.init_auth());

  // Display a loading toast


  try {

    const res = await axios.post(`${apiUrl}/login`, payload);
    if (res?.data?.data) {
      if (res?.data?.data?.user?.userType === 'owner' || res?.data?.data?.user?.userType === 'admin') {
        toast.success(res.data.message || "Login successfully!")
        dispatch(actions.login_success(res?.data?.data));

        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication token not found. Please log in again.");
          return;
        }

        // Set the request headers with the OAuth token
        const config = {
          headers: {
            "oauth-token": token, // Send the token with the oauth-token key in headers
            "Content-Type": "application/json", // Ensure correct content-type header for JSON data
          },
        };
        const user = await axios.get(`${apiUrl}/owner/profile`, config);
        // localStorage.setItem("user", JSON.stringify(user.data.data));
        if (user?.data?.data?.subscriptionId === 0 || user.data.data.hasSubscribed === false) {
          // alert(1)
          localStorage.setItem("registrationstate", 3)
        }
        if (!user?.data?.data?.totalNumofRooms) {
          // alert(2)
          localStorage.setItem("registrationstate", 2)
        }
        if (!user?.data?.data?.user?.hotel) {
          // alert(3)
          localStorage.setItem("registrationstate", 1)
        }

        const registrationStatus = localStorage.getItem("registrationStatus") === "true"
        const registrationstate = localStorage.getItem("registrationstate")
        if ( user?.data?.data?.user.createdAt <= '2024-11-08 00:00:00' || (user.data.data.hasSubscribed && user?.data?.data?.subscriptionId !== 0) ) {
          navigate("/dashboard/Chart/today");
        }
        else {
          navigate("/basicInfo", { state: { registrationstate: 6 } });
        }
      }
      else {
        toast.error("Invalid Credentials !")
        navigate("/Login")
      }



    } else {
      toast.error(res.data.message || "Login failed!")
      navigate("/Login")
    }



    // Navigate to home page on successful login


  } catch (err) {
    console.log(err);

    // Dispatch failure action if an error occurs
    if (err.response) {
      dispatch(actions.login_failed(err?.response?.data?.message));
      console.log(err);
      // Update the loading toast to show error message
      toast.error(err?.response.data.message || "Login failed!");
    } else {
      // If there's no response (e.g., network error)
      toast.error("Login failed! Please try again.",);
    }
  } finally {

  }
};



// Thunk action for logout with navigation
export const logout = (navigate) => (dispatch) => {
  // Clear the token from localStorage
  console.log("logout");
  localStorage.removeItem("token");
  localStorage.clear()
  // Dispatch the logout action to reset Redux state
  dispatch(actions.logout);

  // Navigate to the login page or desired route
  navigate("/loginReg", { replace: true });
};

export const AuthDataStore = (data) => {
  return (dispatch) => {
    dispatch(actions.load_user(data));
  };
};