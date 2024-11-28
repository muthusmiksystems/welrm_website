import React, { useState, useEffect } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Box, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "@mui/material";
import { apiUrl } from "../../Shared/shared";
import toast from "react-hot-toast";

import logo from "../../Assests/logo.png";
import loginImg from "../../Assests/login.png";
import { useNavigate } from "react-router-dom";
import AuthComponent from "./AuthComponent";

const VerifyOtpEmailPhone = () => {
  const [otp, setOtp] = useState(""); // Initialize OTP as an empty string
  const [timeLeft, setTimeLeft] = useState(120);
  const [error, setError] = useState(""); // State for validation error
  const mobileNumber = useSelector((state) => state?.SaveNumber?.mobile);
  const [resendVisible, setResendVisible] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId); // Cleanup the interval on component unmount
    }
    if (timeLeft == 0) {
      setResendVisible(true)
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // OTP input change handler
  const handleChange = (newValue) => {
    setOtp(newValue); // Set OTP as a string
    if (error) setError(""); // Clear the error on input change
  };

  const handleVerify = async () => {
    if (otp.length !== 6 || isNaN(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return; // Stop the function if validation fails
    }

    try {
      const response = await axios.post(`${apiUrl}/user/verify-otp`, {
        otp: Number(otp), // Convert OTP to number
        mobile: Number(mobileNumber),
        countryCode: 91,
      });


      if (response.data.success === true) {
        const accessToken = response.data.data.accesstoken; // Access the token in response.data.data.accesstoken
        if (accessToken) {
          localStorage.setItem('token', accessToken);
          // toast.success("OTP verified successfully!");
          navigate("/Password");
        } else {
          toast.error("Access token not found.");
        }
      } else {
        toast.error("Invalid OTP!");
      }
    } catch (error) {
      toast.error("Verification failed.");

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
      } else {
        toast.error("Failed to resend OTP.");
      }
    } catch (error) {
      toast.error("Error in resending OTP. Please try again.");
    }
  };
  return (

    <AuthComponent title={"Verify Your Email/Phone Number OTP"} description={"Enter the verification code sent to your email or phone to complete your registration. Secure your WELRM account now."}>

      <div>
        <MuiOtpInput value={otp} onChange={handleChange} length={6} />
      </div>

      {
        error && (
          <Typography
            sx={{
              color: "red",
              fontSize: "14px",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            {error}
          </Typography>
        )
      }

      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", sm: "left" }, // Center on small screens, space-between on medium and up
          flexDirection: { xs: "column", sm: "row" }, // Stack vertically on small screens
          alignItems: "center", // Align center on smaller screens
          gap: { xs: 0, sm: 0 }, // Add gap between elements on small screens
        }}
      >
        <Typography
          sx={{
            marginRight: "10px",
            fontSize: "14px",
            fontWeight: "500",
            textAlign: "left",
            marginTop: "11px",
          }}
        >
          Resend OTP in{" "}
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            marginTop: "14px",
            fontWeight: "500",
          }}
        >
          {formatTime(timeLeft)}
        </Typography>
        {timeLeft === 0 && <Typography  sx={{
            fontSize: "14px",
            marginTop: "14px",
            fontWeight: "500",
            color: "#C42A25",
          }} > Time's up!</Typography>}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", sm: "space-between" }, // Center on small screens, space-between on medium and up
          flexDirection: { xs: "column", sm: "row" }, // Stack vertically on small screens
          alignItems: "center", // Align center on smaller screens
          gap: { xs: 0, sm: 0 }, // Add gap between elements on small screens
        }}
      >
        <Typography
          sx={{
            marginTop: "15px",
            fontSize: "12px",
            cursor: timeLeft === 0 ? 'pointer' : 'not-allowed',
          }}
        >
          Didn't receive the code?
          <a onClick={handleResendOtp} disabled={resendVisible} style={{
            textDecoration: "none", color: "#C42A25", color: timeLeft === 0 ? "#C42A25" : "#999", // Adjust color based on timeLeft
            cursor: timeLeft === 0 ? "pointer" : "not-allowed"
          }}>
            {" "}
            Resend
          </a>
        </Typography>

        {/* Confirm Button */}
        <Button
          onClick={handleVerify}
          sx={{
            color: "white",
            textAlign: "center",
            bgcolor: "#C42A25",
            borderRadius: "10px",
            padding: "10px 50px",
          }}
        >
          Confirm
        </Button>
      </Box>
    </AuthComponent>
  );
};

export default VerifyOtpEmailPhone;
