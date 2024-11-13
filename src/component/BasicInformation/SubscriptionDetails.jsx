import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";

import basicbg from "../../Assests/basicbg.png"; // Ensure this path is correct

import Side3 from "../../Assests/side3.png";

import BasicInformationNav from "./BasicInformationNav";
import { Link } from "react-router-dom";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { apiUrl } from "../../Shared/shared";
import CONSTANT from "../../Constant";
import { useDispatch } from "react-redux";
import subscription from "../../API/subscription";

function SubscriptionDetails({ setFrom }) {
  const hoteldata = useSelector((state) => state?.HotelData?.hotelData?.data?.hotel);
  const user = useSelector((state) => state?.Auth?.user?.user);
  const dispatch = useDispatch();
  const [monthlyPlan, setMonthlyPlan] = useState(null);
  useEffect(() => {
    localStorage.setItem("registrationStatus", false)
    localStorage.setItem("registrationstate", 3)
  }, [])
  const handleBack = () => {

    setFrom(2)
  }
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  const orderPlace = async (paymentId, orderId, signature) => {
    const payload = {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature // Include razorpay_signature in the payload
    };

    dispatch(subscription(payload, setFrom))
  };

  const handleOrderId = async () => {
    try {
      // Retrieve token from localStorage
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
      try {
        const getSubscription = await axios.get(`${apiUrl}/subscription`, config);
        const monthly = getSubscription.data.data.hotels.rows.find(
          // (plan) => console.log("plan",plan)
          (plan) => plan.name.toLowerCase().includes("mothly plan")
        );


        setMonthlyPlan(monthly);
        const payload = {
          id: monthly.id,
          name: monthly.name
        }
        // Send the form data to the API
        const response = await axios.post(`${apiUrl}/subscription/order`, payload, config);
        return response.data.data
      }
      catch (error) {
        toast.error('no subscription ')
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  const { error, isLoading, Razorpay } = useRazorpay();
  const handlePayment = async () => {

    const orderid = await handleOrderId(); // Await the order ID

    if (!orderid) {
      console.error("Failed to get order ID");
      return;

    }
    let amount = 300;
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      // key: "rzp_test_AWrlyaXOO9ncih",
      key: CONSTANT.razorPayKey,
      // key: "rzp_live_nzvLvNqutC7WOx", 
      amount: parseInt(amount * 100),
      // amount: parseInt(1 * 100),
      currency: CONSTANT.currency,
      name: CONSTANT.appName,
      description: hoteldata?.hotelName,
      // order_id: orderid,
      orderid: orderid,
      image: CONSTANT.logoUrl,
      handler: function (response) {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
        console.log('response succc', response)
        console.log("razorpay_payment_id", razorpay_payment_id)
        console.log("razorpay_order_id", razorpay_order_id)
        console.log("razorpay_signature", razorpay_signature)
        orderPlace(razorpay_payment_id, razorpay_order_id, razorpay_signature); // after payment completes on stripe this function will be called and you can do your stuff
      },
      prefill: {
        name: user?.fullName, // project or transaction name
        email: user?.email,
      },
      notes: {
      },
      theme: {
        color: "#ED1C24",
      },
    };
    const successCallback = (paymentId) => {
      console.log('paymentId: ', paymentId);
      //alert (paymentId);
    }
    const faliurCallback = (error) => {
      console.log('error: ', error);
      //alert(error);
    }
    const paymentObject = new window.Razorpay(options);
    paymentObject.open(options);
  };
  return (
    <>
      <BasicInformationNav />

      <Box
        sx={{
          padding: { xs: "0px 0px", sm: "0px 0px", md: "20px  80px", lg: "20px  80px" },
          backgroundColor: "#F1F1F1",
          position: "relative",
        }}>
        <Box sx={{ display: { xs: "none", sm: "none", md: "block", lg: "block" } }}>
          <img
            src={Side3}
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
                // alignItems: "center",
              }}>
              <Box sx={{ textAlign: "center", borderTop: "2px solid lightgrey", borderBottom: "2px solid lightgrey", paddingX: "50px", marginBottom: "20px", py: 3 }}>
                <Typography
                  sx={{
                    fontSize: "26px",
                    fontWeight: "600",
                    marginBottom: "20px",
                  }}>
                  Enjoy Premium Benefits and Enhanced Visibility for Just ₹300 per
                  Month
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: "400",
                    textAlign: "center",
                    fontStyle: 'italic',
                    maxWidth: "1200px",
                    marginBottom: "20px",
                    color: "#4B5563"
                  }}>
                  Unlock the full potential of your hotel with our premium
                  subscription plan. Enhance your property’s visibility, attract
                  more guests, and maximize your revenue. Experience exclusive
                  benefits designed to give you a competitive edge in the market
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
                        color: "#4B5563"
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
                        color: "#C42A25",
                      }}>
                      Pending....
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "40px",
                    color: "#64748B",
                  }}>
                  <Typography sx={{ fontSize: "20px", fontWeight: "300px" }}>
                    Complete your payment to unlock premium features and
                    maximize your hotel's visibility.
                  </Typography>
                  <Button
                    onClick={handlePayment}
                    // onClick={setFrom(4)}
                    sx={{
                      fontSize: { xs: "18px", md: "24px", lg: "24px" },
                      fontWeight: "600",
                      color: "#FFFFFF",
                      bgcolor: "#C42A25",
                      borderRadius: "10px",
                      marginTop: "40px",
                      width: "255px",
                      height: "55px"
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
                  onClick={handleBack}
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
                {/* <Link to="/"> */}
                <Button
                  disabled
                  sx={{
                    fontSize: { xs: "18px", md: "24px" },
                    fontWeight: "600",
                    color: 'white',
                    bgcolor: "#C42A2533",
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
      </Box>
    </>
  );
}

export default SubscriptionDetails;
