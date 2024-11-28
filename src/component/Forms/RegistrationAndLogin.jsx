import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";
import logo from "../../Assests/logo.png";
import loginImg from "../../Assests/login.png"; // Make sure this image is set to the correct path
import AuthComponent from "./AuthComponent";

function RegistrationAndLogin() {
  return (
    <AuthComponent title={"Welcome to the Partner Portal"} description={"Choose an option below to access your owner dashboard or register your property. Manage bookings, update details, and start reaching guests today!"}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Login Button */}
        <Link to="/Login" style={{ textDecoration: "none" }}>
          <Button
            sx={{
              color: "white",
              bgcolor: "#C42A25",
              borderRadius: "80px",
              padding: "10px 50px",
              marginTop: "10px",
              width: "200px",
            }}
          >
            Login
          </Button>
        </Link>

        {/* Registration Button */}
        <Link to="/register" style={{ textDecoration: "none" }}>
          <Button
            sx={{
              color: "#4B5563",
              bgcolor: "#E2E8F0",
              borderRadius: "80px",
              padding: "10px 50px",
              marginTop: "10px",
              width: "200px",
            }}
          >
            Registration
          </Button>
        </Link>
        <Link to="/" style={{ textDecoration: "underline",color:'#4B5563' ,marginTop:'20px'}}>Go to Home Page</Link>
      </Box>
    </AuthComponent>
  );
}

export default RegistrationAndLogin;
