import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Input,
  Button,
  MenuItem,
  Grid,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import basicbg from "../../Assests/basicbg.png"; // Ensure this path is correct

import Side4 from "../../Assests/side4.png";
import axios from "axios";
import toast from "react-hot-toast";
import { apiUrl } from "../../Shared/shared";
import moment from "moment";
import { useSelector } from "react-redux";

function SubscriptionDetails2({ setFrom }) {
  const navigate = useNavigate()
  const data=useSelector((state)=>state?.SubscriptionData?.SubscriptionData?.data)
  
  useEffect(() => {
    localStorage.setItem("registrationStatus", false)
    localStorage.setItem("registrationstate", 4)
  }, [])


  const handlenav = async() => {
    localStorage.setItem("registrationStatus", true)
    localStorage.setItem("registrationstate", 6)
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
    navigate('/dashboard/chart/today')
  }
  return (
    <Box
      sx={{
        padding: { xs: "0px 0px", sm: "0px 0px", md: "20px  80px", lg: "20px  80px" },
        backgroundColor: "#F1F1F1",
        position: "relative",
      }}>
      <Box sx={{ display: { xs: "none", sm: "none", md: "block", lg: "block" } }}>
        <img
          src={Side4}
          alt="side"
          style={{
            width: "47px",
            position: "absolute",
            top: "240px",
            left: "15px",
          }}
        />
      </Box>
      <Box
        sx={{
          paddingY: { xs: "20px", md: "40px" },
          borderRadius: "10px",
          backgroundColor: "#ffffff",
        }}>
        <Box
          sx={{
            backgroundImage: `url(${basicbg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            // height: "150px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            borderRadius: "30px",
            paddingY: "15px",
            marginX: { xs: "20px", md: "40px" }
          }}>
          <Typography
            sx={{
              fontSize: { xs: "24px", md: "34px", lg: "34px" },
              fontWeight: 700,
              color: "#FFFFFF",
            }}>
            Discover WELRM
          </Typography>
          <Typography
            sx={{
              fontSize: {
                xs: "16px",
                md: "24px",
                lg: "24px",
                margin: "0px 20px",
                textAlign: "center",
              },
              fontWeight: 400,
              color: "#FFFFFF",
              fontStyle: "italic"
            }}>
            Join WELRM and enhance your hotel's visibility. Let's get your
            property ready for bookings!
          </Typography>
        </Box>

        {/* Basic Information Section */}
        <Box sx={{ px: 5, py: 3 }}>
          <Typography
            sx={{ fontSize: "22px", fontWeight: 600, color: "#4B5563" }}>
            Subscription Details
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              color: "#4B5563",
              fontStyle: 'italic',
              mb: 2,
            }}>
            Your Subscription Plan
          </Typography>
        </Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}>
            <Box sx={{ textAlign: "center", borderTop: "2px solid lightgrey", borderBottom: "2px solid lightgrey", paddingX: "40px", marginBottom: "20px", py: 3 }}>
              <Typography
                sx={{
                  fontSize: "26px",
                  fontWeight: "600",
                  textAlign: "center",
                }}>
                Enjoy Premium Benefits and Enhanced Visibility for Just ₹300 per
                Month
              </Typography>
            </Box>
            <Box
              sx={{
                bgcolor: "#F1F5F9",
                borderRadius: "20px",
                padding: "20px 50px",
                // display:"flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "40px",
                  borderBottom: "2px solid #CBD5E1",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: "500",
                    }}>
                    {" "}
                    Payment Status
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: "500",
                      color: "#2FCA44",
                    }}>
                    Active
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "40px",
                }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    flexWrap: "wrap",
                  }}>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "20px",
                        fontWeight: "500",
                      }}>
                      Subscription Date
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "20px",
                        fontWeight: "500",
                        color: "#C42A25",
                      }}>
                      Next Billing Date
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "20px",
                        fontWeight: "500",
                      }}
                    >
                      {data?.subscriptionStartedDate ? moment(data?.subscriptionStartedDate).format("DD/MM/YYYY") :moment( new Date().toLocaleDateString()).format("DD/MM/YYYY")}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "20px",
                        fontWeight: "500",
                        color: "#C42A25",
                      }}
                    >
                      {data?.subscriptionEndDate ? moment(data?.subscriptionEndDate).format("DD/MM/YYYY") :moment( new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()).format("DD/MM/YYYY")}
                    </Typography>
                  </Box>

                </Box>

                <Button
                  disabled
                  sx={{
                    fontSize: { xs: "18px", md: "24px" },
                    fontWeight: "600",
                    color: "#C42A25",
                    bgcolor: "#C42A2533",
                    borderRadius: "10px",
                    marginTop: "40px",
                    padding: { xs: "5px 20px", md: "10px 50px" },
                  }}>
                  PAY NOW ₹300
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                marginTop: "20px",
                marginRight: "20px",
                justifyContent: { xs: "end", md: "flex-end  " },
                gap: 2,
              }}>
              <Button
                onClick={() => setFrom(3)}
                sx={{
                  fontSize: { xs: "18px", md: "24px" },
                  fontWeight: "600",
                  color: "#475569",
                  bgcolor: "#4755691A",
                  border: "1px solid #0000001A",
                  borderRadius: "10px",
                  padding: { xs: "5px 20px", md: "10px 50px" },
                  mr: 2,
                }}>
                Back
              </Button>
              {/* <Link to="/dashboard/chart/today"> */}
              <Button
                onClick={handlenav}
                sx={{
                  fontSize: { xs: "18px", md: "24px" },
                  fontWeight: "600",
                  color: "#FFFFFF",
                  bgcolor: "#c42a25",
                  borderRadius: "10px",
                  padding: { xs: "5px 20px", md: "10px 50px" },
                }}>
                Complete Registration
              </Button>
              {/* </Link> */}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box >
  );
}

export default SubscriptionDetails2;
