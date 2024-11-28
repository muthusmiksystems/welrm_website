import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { TabContext } from './TabContex';

const ActiveTabController = () => {
    const location = useLocation();
    const { setActiveTab } = useContext(TabContext);

    useEffect(() => {
        // Set the active tab based on the current URL path
        if (location.pathname === "/dashboard/Chart") {
            setActiveTab("dashboard");
        } else if (location.pathname.startsWith("/dashboard/HotelProfile")) {
            setActiveTab("HotelProfile");
        }
        else if (location.pathname.startsWith("/dashboard/Chart/today")) {
            setActiveTab("Today");
        }else if (location.pathname.startsWith("/dashboard/Chart/yesterday")) {
            setActiveTab("Yesterday");
        } else if (location.pathname.startsWith("/dashboard/Chart/this_week")) {
            setActiveTab("This Week");
        }else if (location.pathname.startsWith("/dashboard/Chart/last_4_weeks")) {
            setActiveTab("Last Month");
        }else if (location.pathname.startsWith("/dashboard/NewBooking")) {
            setActiveTab("NewBooking");
        } else if (location.pathname.startsWith("/dashboard/ActiveBooking")) {
            setActiveTab("ActiveBooking");
        } else if (location.pathname.startsWith("/dashboard/RoomListing")) {
            setActiveTab("RoomListing");
        } else if (location.pathname.startsWith("/dashboard/AddNewRoom")) {
            setActiveTab("AddNewRoom");
        } else if (location.pathname.startsWith("/dashboard/BookingAlert")) {
            setActiveTab("BookingAlert");
        } else if (location.pathname.startsWith("/dashboard/GuestMessage")) {
            setActiveTab("GuestMessage");
        } else if (location.pathname.startsWith("/dashboard/FAQ")) {
            setActiveTab("FAQ");
        } else if (location.pathname.startsWith("/dashboard/PaymentSetting")) {
            setActiveTab("PaymentSetting");
        } else if (location.pathname.startsWith("/dashboard/subscription")) {
            setActiveTab("subscription");
        } else if (location.pathname.startsWith("/dashboard/support")) {
            setActiveTab("support");
        }
    }, [location, setActiveTab]);

    return null; // This component doesn't render anything
};
export default ActiveTabController;