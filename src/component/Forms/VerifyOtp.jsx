import React, { useState, useEffect } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Box, Typography, TextField, Button, Input } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../Assests/logo.png";
import { useDispatch, useSelector } from "react-redux";
import loginImg from "../../Assests/login.png";
import axios from "axios";
import toast from "react-hot-toast";
import { apiUrl } from "../../Shared/shared";
import AuthComponent from "./AuthComponent";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(""); // OTP is a string
  const [timeLeft, setTimeLeft] = useState(120);
  const navigate = useNavigate()

  const mobileNumber = useSelector((state) => state?.SaveNumber?.mobile); // Get mobile number from Redux
  const userToken = localStorage.getItem("userToken"); // Get userToken from localStorage
 
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId); // Cleanup on unmount
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleChange = (newValue) => {
    setOtp(newValue); // newValue is already an array
  };
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/forgot-password/otp-verify`, {
        otp,
        mobile: mobileNumber,
        userToken: userToken
      });
      if (response?.data?.success) {
        toast.success("OTP verified successfully!");
        // Redirect user to the next page (e.g., password reset)
        navigate("/YourNewPassword")
      } else {
        toast.error(response.data.message || "OTP verification failed.");
      }
    } catch (error) {
      toast.error("Error verifying OTP. Please try again.");
    }
  };
  const handleResendOtp = async () => {

    try {
      const response = await axios.post(`${apiUrl}/user/send-otp/owner`, {
        mobile: Number(mobileNumber),
        userType: "owner",
        countryCode: 91,
      });

      if (response.data.success === true) {
        toast.success("OTP resent successfully!");
        setTimeLeft(120); // Reset the timer
      }
    } catch (error) {
      toast.error("Error in resending OTP. Please try again.");
    }

    setTimeLeft(120); // Reset timer after resending OTP
    toast.success("OTP resent successfully!");
  };

  return (
    <AuthComponent title={"Verify Your OTP"} description={"Enter the OTP (One-Time Password) sent to your registered email or phone number to verify your account. Complete this step to secure access to your WELRM account."}>

      <div>
        <MuiOtpInput value={otp} onChange={handleChange} length={6} />
      </div>

      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", sm: "left" }, // Center on small screens, space-between on medium and up
          flexDirection: { xs: "column", sm: "row" }, // Stack vertically on small screens
          alignItems: "center", // Align center on smaller screens
          gap: { xs: 0, sm: 0 }, // Add gap between elements on small screens
          marginTop: "11px",
        }}>
        <h1
          style={{
            marginRight: "10px",
            fontSize: "14px",
            fontWeight: "500",
            textAlign: "left",
            
          }}>
          Resend OTP in{" "}
        </h1>
        <h2
          style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "#386BF6"
          }}>
          {formatTime(timeLeft)}
        </h2>
        {timeLeft === 0 && <p>Time's up!</p>}
      </Box>
      <Box
       sx={{
        display: "flex",
        justifyContent: { xs: "center", sm: "space-between" }, // Center on small screens, space-between on medium and up
        flexDirection: { xs: "column", sm: "row" }, // Stack vertically on small screens
        alignItems: "center", // Align center on smaller screens
        gap: { xs: 2, sm: 0 }, // Add gap between elements on small screens
      }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}>
          <Typography
            sx={{
              marginTop: "15px",
              fontSize: "12px",
            }}>
            Didn't Received code?
            <a

              onClick={handleResendOtp}
              style={{
                textDecoration: "none",
                color: "#C42A25",
                fontWeight: "500",
                cursor: "pointer"
              }}>

              Resend
            </a>
          </Typography>
        </Box>

        <Button
          onClick={handleVerifyOtp}
          sx={{
            color: "white",
            textAlign: "center",
            bgcolor: "#C42A25",
            borderRadius: "10px",
            textAlign: "center",
            padding: "10px 50px",
          }}>
          Verify
        </Button>

      </Box>
    </AuthComponent>
  );
};

export default VerifyOtp;
