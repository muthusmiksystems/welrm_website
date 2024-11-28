import React, { useState, useEffect } from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { Box, Typography, TextField, Button, Input } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../../Assests/logo.png';


import loginImg from "../../Assests/login.png"
import AuthComponent from './AuthComponent';

const Otpdata = () => {
  const [otp, setOtp] = React.useState(['', '', '', '']); // Initialize as an array
  const [timeLeft, setTimeLeft] = useState(120);


  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId); // Cleanup the interval on component unmount
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleChange = (newValue) => {
    setOtp(newValue); // newValue is already an array
  };

  return (


    <AuthComponent title={"Verify Your OTP"} description={"Enter the OTP (One-Time Password) sent to your registered email or phone number to verify your account. Complete this step to secure access to your WELRM account."}>
      <div>
        <MuiOtpInput value={otp} onChange={handleChange} length={6} />
      </div>

      <Box sx={{
        display: "flex",
        justifyContent: "left",
        alignItems: "left",
        width: "100%",
        marginTop: "20px"

      }}>
        <h1 style={{
          marginRight: "10px",
          fontSize: "14px",
          fontWeight: "500",
          textAlign: "left",
          marginTop: "11px"
        }}>Resend</h1>
        <h2 style={{
          fontSize: "14px",
          fontWeight: "500",
        }}>{formatTime(timeLeft)}</h2>
        {timeLeft === 0 && <p>Time's up!</p>}
      </Box>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        marginTop: "20px",
      }}>
        <Box sx={{
          display: "flex",
          justifyContent: "space-between"
        }}>
          <Typography sx={{
            marginTop: "15px",
            fontSize: "12px"
          }}>
            Recived
            <a href='#' style={{ textDecoration: "none", color: "red" }}>  Resend</a>
          </Typography>



        </Box>

        <Button sx={{
          color: "white",
          textAlign: "center",
          bgcolor: "#C42A25",
          borderRadius: "10px",
          textAlign: "center",
          padding: "10px 50px",
        }}>
          submit
        </Button>
      </Box>
    </AuthComponent>
  );
};

export default Otpdata;