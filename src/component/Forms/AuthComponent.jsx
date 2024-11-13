import { Box, Typography } from "@mui/material";
import React from "react";
import loginImg from "../../Assests/login.png";
import logo from "../../Assests/logo.png";
import { Toaster } from "react-hot-toast";

const AuthComponent = ({title,description, children }) => {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F1F1F1" }}>
            {/* Left side - Login form */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 2,
                    borderRadius: 2,
                    margin: "auto",
                    maxWidth: 631,
                }}
            >
                <Box sx={{ mb: 2, width: { xs: "150px", sm: "170px", md: "190.63px" }, height: { xs: "50px", sm: "50px", md: "54.31px" } }}>
                    <img src={logo} alt="logo" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: "100%" }}>
                    <Box
                        sx={{
                            padding: "20px",
                            backgroundColor: "white",
                            borderRadius: "10px",
                            maxWidth: "631px",
                            width: "80%",
                            marginTop: "15px",
                        }}>
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: '20px',
                                    sm: '23px',
                                    md: '26px'
                                },
                                fontWeight: "600",
                                lineHeight: "38px",
                                textTransform: "capitalize",
                                color: "#383737",
                                textAlign: "center",
                                marginBottom: "15px",

                            }}>
                            {title}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "14px",
                                fontWeight: "500",
                                textTransform: "capitalize",
                                color: "#6B7280",
                                textAlign: "center",
                                marginBottom: "20px",
                            }}>
                            Log in to manage your property details, bookings, from everywhere from these login/registration pages.
                        </Typography>
                        {children}
                    </Box>
                </Box>
            </Box>

            {/* Right side - Background image */}
            {/* <Box
        sx={{
          flex: 1,
          background: `url(${loginImg}) center/cover no-repeat`,
          display: { xs: "none", md: "block" },
        }}
      /> */}

            <Toaster />
        </Box>
    );
};

export default AuthComponent;
