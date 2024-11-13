import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
  DialogContentText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form"; // Import useForm and Controller
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import { apiUrl } from "../../Shared/shared";
import { formatDate } from "../../Shared/dateformate";
import BookingDates from "../BookingDates"; // Assuming this is another component for handling booking dates
import moment from "moment/moment";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { acceptBooking } from "../../API/Booking";
import { useDispatch } from "react-redux";


const ActiveBooking = () => {
  const dispatch = useDispatch();
  const [checkin_datenew, setcheckin_datenew] = useState();
  const [checkout_datenew, setcheckout_datenew] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false); // New state for cancel dialog
  const [data, setData] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({});
  const [cancellationReason, setCancellationReason] = useState(""); // State for cancellation reason
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { control, handleSubmit, reset } = useForm(); // Set up useForm
  const handleClickOpen = (item) => {
    setBookingDetails(item);
    reset({ // Reset form with current booking detail 
      fullName: item.user.fullName,
      roomName: item.roomDetail.roomType.name,
      checkinTime: item.checkinTime ? item.checkinTime.trim() : "00:00",
      mobile: item.user.mobile,
      confirmation_code:item.confirmation_code=== null ? 0 : item.confirmation_code,
      total_guest: item.total_guest === null ? 0 : item.total_guest,
      roomQuantity: item.roomQuantity,
      roomPrice: item.roomPrice,
      numberOfDays: item.numberOfDays,
      checkin_date: moment(item.checkin_date, 'MM/DD/YYYY'),
      checkout_date: moment(item.checkout_date, 'MM/DD/YYYYY'),
      status: item.status,
    });
    setOpenDialog(true);
  };

  const handleCancelClickOpen = (item) => {
    setBookingDetails(item);
    setCancelDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
  const handleConfirmOpen = (item) => {
    setConfirmOpen(true)
    setBookingDetails(item);
  }
  const handleConfirmClose = () => {
    setConfirmOpen(false)
  }
  const handleCancelClose = () => {
    setCancelDialog(false);
  };
  const onSubmit = async (data) => {

    try {
      const token = localStorage.getItem("token");
      const hotel = JSON.parse(localStorage.getItem("user"));
      if (!token) return;

      const config = {
        headers: {
          "oauth-token": token,
        },
      };
      // Ensure checkin_datenew and checkout_datenew are formatted as 'YYYY-MM-DD' strings
      const formattedCheckinDate = moment(checkin_datenew, 'MM/DD/YYYY');
      const formattedCheckoutDate = moment(checkout_datenew, 'MM/DD/YYYY');

      // Ensure bookingIds is an array even if it's a single value
      const bookingIdArray = Array.isArray(bookingDetails?.id) ? bookingDetails.id : [bookingDetails?.id];
      // Construct the payload
      const payload = {
        "bookingIds": bookingDetails.id,
        "old_checkin_date": moment(bookingDetails?.checkin_date, 'MM/DD/YYYY'),
        "old_checkout_date": moment(bookingDetails?.checkout_date, 'MM/DD/YYYY'),
        "checkin_date": formattedCheckinDate,
        "checkout_date": formattedCheckoutDate,
        "confirmation_code":bookingDetails?.confirmation_code,
        "total_guest":bookingDetails?.total_guest,
        "roomQuantity":bookingDetails?.roomQuantity
      };
      console.log("formattedCheckoutDate", formattedCheckoutDate)
      console.log("bookingDetails.checkout_date", bookingDetails.checkout_date)
      // Call the updateActiveBookings API to update booking details
      const response = await axios.put(`${apiUrl}/hotel/active-book/${bookingDetails?.roomDetail?.id}/${bookingDetails?.id}`, payload, config);

      if (response.data.success) {
        handleClose();
        toast.success('Updated successfully')

        fetchData() // Close the dialog after successful submission
      } else {
        toast.error(response.data.message || 'Updated failed')
        console.error("Failed to update booking:", response.data.message);
      }
    } catch (error) {
      toast.error(error || 'Updated failed')
      console.error("Error updating booking:", error);
    }
  };
  const handleAccept = () => {
    const status = "confirmed"
    dispatch(acceptBooking(bookingDetails, setConfirmOpen, status))
    setConfirmOpen(false);
    fetchData()
  }
  // const onCancelSubmit = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const hotel = JSON.parse(localStorage.getItem("user"));
  //     if (!token || !bookingDetails?.id) return;

  //     const config = {
  //       headers: { "oauth-token": token },
  //     };

  //     const response = await axios.put(`${apiUrl}/hotel/cancel-book/${bookingDetails.id}`, { cancelation_reason: cancellationReason }, config);
  //       console.log("response",response.data);
  //     if (response.data.success) {
  //       handleCancelClose();
  //       fetchData();
  //     } else {
  //       console.error("Failed to cancel booking:", response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error canceling booking:", error);
  //   }
  // };

  const onCancelSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const hotel = JSON.parse(localStorage.getItem("user"));
      if (!token || !bookingDetails?.id || !bookingDetails?.roomDetail?.id) return;

      const config = {
        headers: { "oauth-token": token },
      };
      const response = await axios.put(`${apiUrl}/booking/cancel/${bookingDetails.roomDetail.id}/${bookingDetails.id}`,
        { cancelation_reason: cancellationReason },
        config);
      setCancellationReason('')
      if (response.data.success) {
        handleCancelClose();
        toast.success(response.data.message)
        fetchData();
      } else {
        console.error("Failed to cancel booking:", response.data.message);
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error)
      console.error("Error canceling booking:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const hotel = JSON.parse(localStorage.getItem("user"));
      if (!token) return;

      const config = {
        headers: {
          "oauth-token": token,
        },
      };

      const response = await axios.get(`${apiUrl}/hotel/active-book/${hotel.hotel.id}`, config);
      console.log('data', response.data)
      setData(response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "20px" }}>
      {data?.data?.bookingsDetails ? (
        data.data.bookingsDetails.map((item, index) => (
          item?.status === "active" || item?.status === "confirmed" ? (
            <Box key={index} sx={{ margin: "30px 0px", backgroundColor: "white", width: "100%", borderRadius: "10px" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", borderBottom: "1px solid rgba(0,0,0,0.1)", padding: "20px 30px" }}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ bgcolor: "#C42A251A", height: "35px", width: "35px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* SVG path content */}
                      </svg>
                    </Box>
                    <Box sx={{ marginLeft: "20px" }}>
                      <Typography sx={{ fontSize: "18px", fontWeight: "400" }} fontWeight="bold">
                        {item?.roomDetail?.roomType?.name || "Room Type"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#0095331A", borderRadius: "40px" }}>
                    <Box sx={{ margin: "10px 20px" }}>
                      <Typography sx={{ color: "#4B5563", fontSize: "18px", fontWeight: "500" }}>Booking Status:</Typography>
                    </Box>
                    <Box sx={{ marginLeft: "20px", bgcolor: "#0095330D", borderRadius: "40px", padding: "10px 30px" }}>
                      <Typography sx={{ fontSize: "18px", fontWeight: "500", color: "#009533" }}>
                        {item?.status === "confirmed" ? "confirmed" : item?.status}
                      </Typography>
                    </Box>
                  </Box>
                  {item?.status === 'active' && (<IconButton aria-label="edit" onClick={() => handleClickOpen(item)}>
                    <EditIcon />
                  </IconButton>)}

                </Box>
              </Box>

              <Box gap={4} sx={{ display: {xs:"block",sm:"block",md:"flex",lg:"flex"}, padding: "20px 0px 20px 30px" }}>
                <Box sx={{ margin: "10px", marginTop: "0px !important", borderRight: '1px solid #EEE', padding: '0px 20px 0px 0px', width: { xs: "100%", sm: "100%", md: "30%", lg: "30%" } }}>
                  <Box>
                    <Typography sx={{ fontSize: "18px", fontWeight: "500", color: "#4B5563", marginBottom: "15px" }}>Basic details:</Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", padding: "10px 0px", borderBottom: '1px solid #EEEE' }}>
                      <Typography sx={{ fontSize: "16px", fontWeight: "500", color: "#4B5563" }}>• Guest Name</Typography>
                      <Typography sx={{ fontSize: "16px", fontWeight: "500", color: "#4B5563" }}>{item?.user?.fullName}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", padding: "10px 0px", borderBottom: '1px solid #EEEE' }}>
                      <Typography sx={{ fontSize: "16px", fontWeight: "500", color: "#4B5563" }}>• Contact Number</Typography>
                      <Typography sx={{ fontSize: "16px", fontWeight: "500", color: "#4B5563" }}>{item?.user?.mobile}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ padding: '0px 10px 0px 10px', width: { xs: "100%", sm: "100%", md: "40%", lg: "40%" } }}>
                  <Typography sx={{ fontSize: "18px", fontWeight: "500", color: "#4B5563", marginBottom: "20px" }}>Booking Info:</Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ bgcolor: "#F1F5F9", padding: "8px 20px", borderRadius: "5px", marginLeft: "0px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontSize: "14px", fontWeight: "500", marginRight: "25px", color: "#4B5563" }}>No. Of Guest</Typography>
                      <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>{item?.total_guest === null ? 0 : item?.total_guest}</Typography>
                    </Box>
                    <Box sx={{ bgcolor: "#F1F5F9", padding: "8px 20px", borderRadius: "5px", marginLeft: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontSize: "14px", fontWeight: "500", marginRight: "25px", color: "#4B5563" }}>No. Of Room</Typography>
                      <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>{item?.roomQuantity}</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Box
                      sx={{
                        bgcolor: "#F1F5F9",
                        padding: "8px 20px",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "10px",
                      }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M16.1557 1.75781H1.85087C1.25687 1.75781 0.773438 2.23867 0.773438 2.83267V11.8121C0.773438 12.4061 1.25687 12.8869 1.85087 12.8869H16.1557C16.7497 12.8869 17.2306 12.4061 17.2306 11.8121V2.83267C17.2306 2.23867 16.7497 1.75781 16.1557 1.75781ZM9.00201 12.2261C8.68829 12.2261 8.43372 11.9741 8.43372 11.6578C8.43372 11.3441 8.68829 11.0895 9.00201 11.0895C9.31829 11.0895 9.5703 11.3441 9.5703 11.6578C9.5703 11.9741 9.31829 12.2261 9.00201 12.2261ZM16.202 10.4672H1.80201V2.83267C1.80201 2.80695 1.82514 2.78639 1.85087 2.78639H16.1557C16.1814 2.78638 16.202 2.80695 16.202 2.83267V10.4672Z"
                            fill="#4B5563"
                          />
                          <path
                            d="M12.8932 15.7475C12.8932 16.0252 12.6695 16.2489 12.3943 16.2489H5.61862C5.3409 16.2489 5.11719 16.0252 5.11719 15.7475C5.11719 15.6086 5.17375 15.4852 5.26376 15.3952C5.35376 15.3052 5.47975 15.2486 5.61862 15.2486H6.18689L6.61889 13.4023H11.394L11.826 15.2486H12.3943C12.6695 15.2486 12.8932 15.4723 12.8932 15.7475Z"
                            fill="#4B5563"
                          />
                          <path
                            d="M7.88348 7.05009V8.96581C7.88348 8.99924 7.85518 9.02752 7.82175 9.02752H7.50805C7.47205 9.02752 7.44376 8.99924 7.44376 8.96581V8.74209H3.05433V8.96581C3.05433 8.99924 3.02605 9.02752 2.99262 9.02752H2.6789C2.64549 9.02752 2.61719 8.99924 2.61719 8.96581V7.05009C2.61719 7.01666 2.64549 6.98838 2.6789 6.98838H2.99262C3.02605 6.98838 3.05433 7.01666 3.05433 7.05009V7.07837C4.5149 6.90096 5.98319 6.90096 7.44376 7.07837V7.05009C7.44376 7.01666 7.47205 6.98838 7.50805 6.98838H7.82176C7.85519 6.98838 7.88348 7.01666 7.88348 7.05009Z"
                            fill="black"
                          />
                          <path
                            d="M7.28025 5.69615V4.54672C7.28025 4.31272 7.09254 4.125 6.85854 4.125H3.63397C3.40253 4.125 3.21225 4.31272 3.21225 4.54672V5.69615L2.90625 6.47529H2.98854C3.08368 6.47529 3.17367 6.49844 3.25083 6.53957C3.91425 6.46758 4.58283 6.43158 5.24369 6.43158C5.9071 6.43158 6.57826 6.46758 7.2391 6.53957C7.31883 6.49844 7.40882 6.47529 7.50397 6.47529H7.58883L7.28025 5.69615ZM4.79624 5.94043C4.78854 5.94043 4.78081 5.93529 4.77311 5.93015C4.7474 5.90444 4.70625 5.90957 4.67282 5.92757C4.57768 5.979 4.45939 6.00986 4.33081 6.00986C4.20224 6.00986 4.08397 5.979 3.98882 5.92757C3.95797 5.90957 3.91424 5.90699 3.88854 5.93015C3.88081 5.93529 3.87311 5.94043 3.86539 5.94043C3.81397 5.94043 3.77024 5.78614 3.77024 5.59586C3.77024 5.40558 3.81397 5.25386 3.86539 5.25386C3.87311 5.25386 3.88081 5.25643 3.88854 5.26158C3.91682 5.28729 3.95797 5.28214 3.98882 5.26414C4.08397 5.21272 4.20224 5.18186 4.33081 5.18186C4.45939 5.18186 4.57768 5.21272 4.67282 5.26414C4.70625 5.28214 4.7474 5.28729 4.77311 5.26158C4.78081 5.25643 4.78854 5.25386 4.79624 5.25386C4.85025 5.25386 4.8914 5.40558 4.8914 5.59586C4.8914 5.78614 4.85025 5.94043 4.79624 5.94043ZM6.62712 5.94043C6.61939 5.94043 6.61169 5.93529 6.60396 5.93015C6.57826 5.90444 6.5371 5.90957 6.50368 5.92757C6.40853 5.979 6.29026 6.00986 6.16169 6.00986C6.03312 6.00986 5.91482 5.979 5.81968 5.92757C5.78882 5.90957 5.74767 5.90699 5.71939 5.93015C5.71169 5.93529 5.70396 5.94043 5.69624 5.94043C5.64483 5.94043 5.6011 5.78614 5.6011 5.59586C5.6011 5.40558 5.64482 5.25386 5.69624 5.25386C5.70396 5.25386 5.71169 5.25643 5.71939 5.26158C5.74768 5.28729 5.78883 5.28214 5.81968 5.26414C5.91482 5.21272 6.03312 5.18186 6.16169 5.18186C6.29026 5.18186 6.40853 5.21272 6.50368 5.26414C6.5371 5.28214 6.57826 5.28729 6.60396 5.26158C6.61169 5.25643 6.61939 5.25386 6.62712 5.25386C6.6811 5.25386 6.72226 5.40558 6.72226 5.59586C6.72226 5.78614 6.6811 5.94043 6.62712 5.94043Z"
                            fill="black"
                          />
                          <path
                            d="M15.8193 4.1266C15.8193 4.28347 15.6933 4.40947 15.5365 4.40947H9.07191C8.91506 4.40947 8.78906 4.28347 8.78906 4.1266C8.78906 3.96975 8.91506 3.84375 9.07191 3.84375H15.5365C15.6933 3.84375 15.8193 3.96974 15.8193 4.1266Z"
                            fill="black"
                          />
                          <path
                            d="M11.3859 5.70473C11.3859 5.8616 11.26 5.98759 11.1031 5.98759H9.07191C8.91506 5.98759 8.78906 5.8616 8.78906 5.70473C8.78906 5.54787 8.91506 5.42188 9.07191 5.42188H11.1031C11.26 5.42188 11.3859 5.54787 11.3859 5.70473Z"
                            fill="black"
                          />
                          <path
                            d="M15.8136 5.70473C15.8136 5.8616 15.6876 5.98759 15.5308 5.98759H12.2985C12.1416 5.98759 12.0156 5.8616 12.0156 5.70473C12.0156 5.54787 12.1416 5.42188 12.2985 5.42188H15.5308C15.6876 5.42188 15.8136 5.54787 15.8136 5.70473Z"
                            fill="black"
                          />
                          <path
                            d="M15.8193 7.28676C15.8193 7.44363 15.6933 7.56963 15.5365 7.56963H9.07191C8.91506 7.56963 8.78906 7.44363 8.78906 7.28676C8.78906 7.1299 8.91506 7.00391 9.07191 7.00391H15.5365C15.6933 7.00391 15.8193 7.1299 15.8193 7.28676Z"
                            fill="black"
                          />
                          <path
                            d="M14.0162 8.86488C14.0162 9.02175 13.8902 9.14775 13.7334 9.14775H10.8688C10.7119 9.14775 10.5859 9.02175 10.5859 8.86488C10.5859 8.70803 10.7119 8.58203 10.8688 8.58203H13.7334C13.8902 8.58203 14.0162 8.70803 14.0162 8.86488Z"
                            fill="black"
                          />
                        </svg>
                        <Typography
                          sx={{
                            marginLeft: "10px",
                            fontSize: "14px",
                            fontWeight: "500",
                            marginRight: "15px",
                            color: "#4B5563"
                          }}>
                          Booking Date :
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          marginLeft: "0px",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#4B5563"
                        }}>
                        {" "}
                        <Typography>{formatDate(item?.bookingFromDate)}</Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        bgcolor: "#F1F5F9",
                        padding: "8px 20px",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "10px",
                      }}>
                      <Box
                        sx={{
                          display: "flex",
                        }}>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M1.5 6.75C1.5 5.81812 1.5 5.35218 1.65224 4.98463C1.85523 4.49458 2.24458 4.10523 2.73463 3.90224C3.10218 3.75 3.56812 3.75 4.5 3.75H13.5C14.4319 3.75 14.8978 3.75 15.2654 3.90224C15.7554 4.10523 16.1448 4.49458 16.3478 4.98463C16.5 5.35218 16.5 5.81812 16.5 6.75C16.5 6.98297 16.5 7.09946 16.4619 7.19134C16.4112 7.31386 16.3139 7.41119 16.1913 7.46194C16.0995 7.5 15.983 7.5 15.75 7.5H2.25C2.01703 7.5 1.90054 7.5 1.80866 7.46194C1.68614 7.41119 1.58881 7.31386 1.53806 7.19134C1.5 7.09946 1.5 6.98297 1.5 6.75Z"
                            fill="#C42A25"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M1.5 12.5C1.5 14.3856 1.5 15.3284 2.08579 15.9142C2.67157 16.5 3.61438 16.5 5.5 16.5H12.5C14.3856 16.5 15.3284 16.5 15.9142 15.9142C16.5 15.3284 16.5 14.3856 16.5 12.5V10C16.5 9.5286 16.5 9.29289 16.3536 9.14645C16.2071 9 15.9714 9 15.5 9H2.5C2.0286 9 1.79289 9 1.64645 9.14645C1.5 9.29289 1.5 9.5286 1.5 10V12.5ZM5.25 11.25C5.25 11.017 5.25 10.9005 5.28806 10.8087C5.33881 10.6861 5.43614 10.5888 5.55866 10.5381C5.65054 10.5 5.76703 10.5 6 10.5H7.5C7.73297 10.5 7.84946 10.5 7.94134 10.5381C8.06386 10.5888 8.16119 10.6861 8.21194 10.8087C8.25 10.9005 8.25 11.017 8.25 11.25C8.25 11.483 8.25 11.5995 8.21194 11.6913C8.16119 11.8139 8.06386 11.9112 7.94134 11.9619C7.84946 12 7.73297 12 7.5 12H6C5.76703 12 5.65054 12 5.55866 11.9619C5.43614 11.9112 5.33881 11.8139 5.28806 11.6913C5.25 11.5995 5.25 11.483 5.25 11.25ZM5.28806 13.8087C5.25 13.9005 5.25 14.017 5.25 14.25C5.25 14.483 5.25 14.5995 5.28806 14.6913C5.33881 14.8139 5.43614 14.9112 5.55866 14.9619C5.65054 15 5.76703 15 6 15H7.5C7.73297 15 7.84946 15 7.94134 14.9619C8.06386 14.9112 8.16119 14.8139 8.21194 14.6913C8.25 14.5995 8.25 14.483 8.25 14.25C8.25 14.017 8.25 13.9005 8.21194 13.8087C8.16119 13.6861 8.06386 13.5888 7.94134 13.5381C7.84946 13.5 7.73297 13.5 7.5 13.5H6C5.76703 13.5 5.65054 13.5 5.55866 13.5381C5.43614 13.5888 5.33881 13.6861 5.28806 13.8087ZM9.75 11.25C9.75 11.017 9.75 10.9005 9.78806 10.8087C9.83881 10.6861 9.93614 10.5888 10.0587 10.5381C10.1505 10.5 10.267 10.5 10.5 10.5H12C12.233 10.5 12.3495 10.5 12.4413 10.5381C12.5639 10.5888 12.6612 10.6861 12.7119 10.8087C12.75 10.9005 12.75 11.017 12.75 11.25C12.75 11.483 12.75 11.5995 12.7119 11.6913C12.6612 11.8139 12.5639 11.9112 12.4413 11.9619C12.3495 12 12.233 12 12 12H10.5C10.267 12 10.1505 12 10.0587 11.9619C9.93614 11.9112 9.83881 11.8139 9.78806 11.6913C9.75 11.5995 9.75 11.483 9.75 11.25ZM9.78806 13.8087C9.75 13.9005 9.75 14.017 9.75 14.25C9.75 14.483 9.75 14.5995 9.78806 14.6913C9.83881 14.8139 9.93614 14.9112 10.0587 14.9619C10.1505 15 10.267 15 10.5 15H12C12.233 15 12.3495 15 12.4413 14.9619C12.5639 14.9112 12.6612 14.8139 12.7119 14.6913C12.75 14.5995 12.75 14.483 12.75 14.25C12.75 14.017 12.75 13.9005 12.7119 13.8087C12.6612 13.6861 12.5639 13.5888 12.4413 13.5381C12.3495 13.5 12.233 13.5 12 13.5H10.5C10.267 13.5 10.1505 13.5 10.0587 13.5381C9.93614 13.5888 9.83881 13.6861 9.78806 13.8087Z"
                            fill="#C42A25"
                          />
                          <path
                            d="M5.25 2.25L5.25 4.5"
                            stroke="#C42A25"
                            stroke-width="2"
                            stroke-linecap="round"
                          />
                          <path
                            d="M12.75 2.25L12.75 4.5"
                            stroke="#C42A25"
                            stroke-width="2"
                            stroke-linecap="round"
                          />
                        </svg>

                        <Typography
                          sx={{
                            marginLeft: "10px",
                            fontSize: "14px",
                            fontWeight: "500",
                            marginRight: "15px",
                            color: "#C42A25"
                          }}>
                          From/To :{" "}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          marginLeft: "0px",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#C42A25"
                        }}>
                        {" "}
                        <Typography>{formatDate(item?.bookingFromDate)}&nbsp;/{" "}
                          {formatDate(item?.bookingToDate)}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ marginLeft: "10px", borderLeft: '1px solid #EEE', padding: '0px 0px 0px 20px', width: { xs: "100%", sm: "100%", md: "30%", lg: "30%" } }}>
                  <Typography sx={{ fontSize: "18px", fontWeight: "500", color: "#4B5563", marginBottom: "20px" }}>
                    Action & Payment Info:
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: "#d32f2f",
                      borderBottomLeftRadius: "10px",
                      borderTopLeftRadius: "10px",
                      padding: "10px 20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#FFF", fontSize: "28px", fontWeight: "400" }}>
                      ₹ {item?.roomPrice}.00
                    </Typography>
                    <Typography variant="h6" sx={{ color: "#FFF", fontSize: "16px", fontWeight: "500", marginLeft: "10px" }}>
                      {item?.numberOfDays}/Nights
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", padding: "20px", paddingLeft: "0px !important" }}>
                    <Button
                      onClick={() => handleCancelClickOpen(item)}
                      sx={{
                        bgcolor: "#C42A251A",
                        color: "#C42A25",
                        padding: "10px 40px",
                        borderRadius: "5px",
                        fontSize: "14px",
                        fontWeight: "500",
                        marginRight: "20px",
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => item?.status === "active" ? handleConfirmOpen(item) : null}
                      sx={{
                        bgcolor: "#CBD5E1",
                        color: "#4B5563",
                        padding: "10px 40px",
                        borderRadius: "5px",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item?.status === "confirmed" ? 'CheckOut' : 'Confirm'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (<h1 className="p-5 text-center font-bold">No Bookings are available</h1>)
        ))
      ) : (
        <p>Loading...</p>
      )}

      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            Booking Confirmation Details
          </Typography>
        </DialogTitle>
        <DialogContent dividers
          sx={{
            maxHeight: '400px', // Adjust as needed
            overflowY: 'auto',
          }}>
          <form onSubmit={handleSubmit(onSubmit)}> {/* Use handleSubmit here */}
            <Box display="flex" justifyContent="space-between" marginBottom={2} gap={2}>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Guest Name" slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }} fullWidth variant="outlined" />
                )}
              />
              <Controller
                name="roomName"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Room Name" slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }} fullWidth variant="outlined" />
                )}
              />
              <Controller
                name="checkinTime"
                control={control}
                defaultValue="00:00" // Default time format to avoid errors
                render={({ field }) => (
                  <TextField
                    {...field}
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                    label="Check-in Time"
                    fullWidth
                    variant="outlined"
                    type="time" // Set input type to time
                    inputProps={{
                      pattern: "[0-9]{2}:[0-9]{2}", // Optional regex to ensure "HH:mm" format
                    }}
                  />
                )}
              />

              <Controller
                name="confirmation_code"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Pass Code" slotProps={{
                    input: {
                      readOnly: false,
                    },
                  }} fullWidth variant="outlined" />
                )}
              />
            </Box>

            {/* <Box display="flex" justifyContent="space-between" marginBottom={2}>
              
            </Box> */}

            {/* <Box display="flex" justifyContent="space-between" marginBottom={2}>
              
            </Box> */}

            <Box display="flex" justifyContent="space-between" marginBottom={2} gap={2}>
              <Controller
                name="total_guest"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="No. Of Guests" slotProps={{
                    input: {
                      readOnly: false,
                    },
                  }} type="number" fullWidth variant="outlined" sx={{ width: { xs: "100%", sm: "100%", md: "20%", lg: "35%" } }} />
                )}

              />
              <Controller
                name="roomQuantity"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="No. Of Rooms" slotProps={{
                    input: {
                      readOnly: false,
                    },
                  }} type="number" fullWidth variant="outlined" sx={{ width: { xs: "100%", sm: "100%", md: "20%", lg: "35%" } }} />
                )}

              />
              <BookingDates bookingDetails={bookingDetails} setcheckin_datenew={setcheckin_datenew} setcheckout_datenew={setcheckout_datenew} />
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={2}>
              <Box>
                <Controller
                  name="roomPrice"
                  control={control}
                  render={({ field }) => (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          color: "#424242",
                          fontWeight: "bold",
                        }}
                      >
                        ₹ {field.value ? parseInt(field.value).toLocaleString() : "0"}
                      </Typography>
                    </Box>
                  )}
                />
                <Controller
                  name="numberOfDays"
                  control={control}
                  render={({ field }) => (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "8px",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#757575",
                        }}
                      >
                        Total: {field.value || 0}/Nights
                      </Typography>
                    </Box>
                  )}
                />
              </Box>
              <DialogActions>
                <Button onClick={handleClose} style={{ color: "#4B5563", backgroundColor: "#E5E7EB" }}>
                  Back
                </Button>
                <Button type="submit" style={{ color: "#FFF", backgroundColor: "#C42A25" }}>
                  Update
                </Button>
              </DialogActions>
            </Box>

          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {"Confirm Booking"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you ready to finalize this booking? Once
            confirmed, a notification will be sent to the
            guest with all the booking details. Ensure all
            information is accurate before proceeding.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="secondary">
            Cancel
          </Button>
          {/* <Link to="/dashboard/ActiveBooking"> */}
          <Button
            onClick={() => handleAccept()}
            color="primary"
            autoFocus>
            Confirm
          </Button>
          {/* </Link> */}
        </DialogActions>
      </Dialog>
      <Dialog open={cancelDialog} onClose={handleCancelClose} fullWidth>
        <DialogTitle>
          <Typography variant="h6">Cancel Booking</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Cancellation Reason"
            fullWidth
            variant="outlined"
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose} color="primary">Cancel</Button>
          <Button onClick={onCancelSubmit} color="secondary">Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActiveBooking;