import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { TabProvider } from "./component/dashboard/Navbar/TabContex";
import { useDispatch } from "react-redux";

import "./App.css"


import { getBookingHistory, newBookingList } from "./API/Booking";
import Home from "./component/dashboard/Home/DashBoard";
import NewBooking from "./component/Booking/NewBooking";
import NewLogin from "./component/Forms/NewLogin";
import ProtectedRoute from "./ProtectedRoute";
import Registration from "./component/Forms/Registration";
import VerifyOtpEmailPhone from "./component/Forms/VerifyOtpEmailPhone";
import VerifyOtp from "./component/Forms/VerifyOtp";
import Forgot from "./component/Forms/Forgot";
import SetYourPassword from "./component/Forms/SetYourPassword";
import YourNewPassword from "./component/Forms/YourNewPassword";
import BasicInformation from "./component/BasicInformation/BasicInformation";
import Chart from "./component/dashboard/Chart";
import ActiveBooking from "./component/Booking/ActiveBooking";
import BookingHistory from "./component/Booking/BookingHistory";
import RoomListing from "./component/Room Manage/RoomListing";
import AddNewRoom from "./component/Room Manage/AddNewRoom";
import BookingAlert from "./component/Notification/BookingAlert";
import GuestMessage from "./component/Notification/GuestMessage";
import Poilices from "./component/Setting/Poilices";
import DeletAccount from "./component/Setting/DeletAccount";
import Faq from "./component/Support/Faq";
import Contact from "./component/Support/Contact";
import NotFound from "./component/NotFound";
import RegistrationAndLogin from "./component/Forms/RegistrationAndLogin";
import { Toaster } from "react-hot-toast";
import RoomDetails from "./component/BasicInformation/RoomDetails";
import Hero from "./component/Hero";
import Availability from "./component/Room Manage/Availability";
import HotelBooking from "./component/Booking/HotelProfile";
import UpdateRoom from "./component/Room Manage/UpdateRoom";

function App() {
  const dispatch = useDispatch();
  // const bookingDetails = {
  //   guestName: "Shazaib Hassan",
  //   roomName: "Double Deluxe Room",
  //   checkInTime: "02:00 PM",
  //   passCode: "764456789",
  //   noOfGuests: 3,
  //   noOfRooms: 2,
  //   checkInDate: "22 Jun, 2024",
  //   checkOutDate: "25 Jun, 2024",
  //   totalPrice: "16,000",
  //   nights: 3,
  // };

  // const handleConfirm = () => {

  // };

  // const handleCancel = () => {

  // };
  // useEffect(() => {
  //   dispatch(newBookingList());
  // }, []);

  return (
    <TabProvider>
      <Toaster />
      <Router>
        <Routes>

          <Route
            path="/"
            element={
              // <ProtectedRoute>
              <Hero />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }>
            <Route path="HotelProfile" element={<HotelBooking />} />
            <Route path="NewBooking" element={<NewBooking />} />

            <Route path="BookingHistory" element={<BookingHistory />} />
            <Route path="update-room" element={<UpdateRoom />} />
            <Route
              path="ActiveBooking"
              element={
                <ActiveBooking
                  // bookingDetails={bookingDetails}
                  // onConfirm={handleConfirm}
                  // onCancel={handleCancel}
                />
              }
            />
            <Route path="Chart" element={<Chart />} />
            <Route path="Chart/:period" element={<Chart />} />

            <Route path="RoomListing" element={<RoomListing />} />
            <Route path="Availability" element={<Availability />} />
            <Route path="AddNewRoom" element={<AddNewRoom />} />
            <Route path="BookingAlert" element={<BookingAlert />} />
            <Route path="GuestMessage" element={<GuestMessage />} />
            <Route path="Poilices" element={<Poilices />} />

            <Route path="DeletAccount" element={<DeletAccount />} />
            <Route path="Faq" element={<Faq />} />
            <Route path="Contact" element={<Contact />} />
          </Route>
          <Route path="/login" element={<NewLogin />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/loginReg" element={<RegistrationAndLogin />} />


          <Route path="/otp" element={<VerifyOtpEmailPhone />} />
          <Route path="/forget-otp" element={<VerifyOtp />} />

          <Route path="/Password" element={<SetYourPassword />} />
          <Route path="/ForgetPassword" element={<Forgot />} />
          <Route path="/ForgetPasswordOtp" element={<VerifyOtp />} />
          <Route path="/YourNewPassword" element={<YourNewPassword />} />
          <Route path="/basicInfo" element={<BasicInformation />} />
          <Route path="/roomDetails" element={<RoomDetails />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TabProvider>
  )
}

export default App;

