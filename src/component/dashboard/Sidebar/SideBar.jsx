import React, { useContext, useState, useEffect } from "react";
import { TabContext } from "../Navbar/TabContex";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CloseIcon from "@mui/icons-material/Close"; // Import Close Icon
import Dashlogo from "../../../Assests/Dashlogo.png";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Badge } from "@mui/material";
import { useSelector } from "react-redux";
const Sidebar = ({ toggleSidebar }) => {
  const bookingId = useSelector((state) => state?.Booking?.booking?.data?.hotels?.rows || []);
  useEffect(() => {
    const pendingCount = bookingId.filter(item => item.status === "pending").length;
    setNotificationCount(pendingCount); // Update notification count
  }, [bookingId]);
  const { setActiveTab } = useContext(TabContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setSidebarOpen] = useState(true); // State for sidebar visibility
  const [isDashboardOpen, setDashboardOpen] = useState(false);
  const [isRoomOpen, setRoomOpen] = useState(false);
  const [isProductsOpen, setProductsOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isSubscriptionOpen, setSubscriptionOpen] = useState(false);
  const [isSettingOpen, setSettingOpen] = useState(false);
  const [isSupportOpen, setSupportOpen] = useState(false);
  const [isAbove768, setIsAbove768] = useState(window.innerWidth > 768);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0); // Dynamic notification count

  const activeStyle = {
    backgroundColor: '#FFF1E7',
    borderRadius: '10px',
    color: '#C42A25'
  };
  const toggleSubMenu = (section) => {
    setActiveSubMenu(activeSubMenu === section ? null : section); // Toggle sub-menu visibility
    toggleSection(section); // This should still navigate to the main section
  };
  // const toggleSidebar = () => {
  //   setSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  // };

  const toggleSection = (section) => {

    setActiveTab(section);
    setDashboardOpen(section === "dashboard" ? !isDashboardOpen : false);
    setRoomOpen(section === "Hotel" ? !isRoomOpen : false);
    setProductsOpen(section === "Room" ? !isProductsOpen : false);
    setNotificationOpen(section === "notification" ? !isNotificationOpen : false);
    setSubscriptionOpen(section === "subscription" ? !isSubscriptionOpen : false);
    setSettingOpen(section === "setting" ? !isSettingOpen : false);
    setSupportOpen(section === "support" ? !isSupportOpen : false);

    // if (section === "dashboard" && !isDashboardOpen) {
    //   navigate("/dashboard/Chart/today");
    // }
  };

  const isDashboardActive = location.pathname.startsWith("/dashboard");

  useEffect(() => {
    const handleResize = () => {
      setIsAbove768(window.innerWidth > 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false); // Close sidebar if window is resized below 768px
      } else {
        setSidebarOpen(true); // Open sidebar if window is resized above 768px
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlesubmenu = (data) => {
    setActiveTab(data);
  }
  // useEffect(() => {
  //   if (location.pathname.startsWith('/dashboard/Chart/today')) {
  //     // alert(0)
  //     toggleSection('dashboard')

  //     setActiveSubMenu("todaydash")

  //   }
  // }, [location])
  useEffect(() => {
    if (location.pathname.startsWith("/dashboard/Chart")) {
      setDashboardOpen(true);
      setRoomOpen(false);
      setProductsOpen(false);
      setNotificationOpen(false);
      setSubscriptionOpen(false);
      setSettingOpen(false);
      setSupportOpen(false);

      // Set active sub-menu based on the path
      if (location.pathname === "/dashboard/Chart/today") {
        setActiveSubMenu("todaydash");
      } else if (location.pathname === "/dashboard/Chart/yesterday") {
        setActiveSubMenu("yesterdaydash");
      } else if (location.pathname === "/dashboard/Chart/this_week") {
        setActiveSubMenu("thisweekdash");
      } else if (location.pathname === "/dashboard/Chart/last_4_weeks") {
        setActiveSubMenu("last4dash");
      } else {
        setActiveSubMenu(null);
      }
    } else if (location.pathname.startsWith("/dashboard/HotelProfile")) {
      setRoomOpen(true);
      setActiveSubMenu("HotelProfile");
    } else if (location.pathname.startsWith("/dashboard/NewBooking")) {
      setRoomOpen(true);
      setActiveSubMenu("NewBookingRequests");
    } else if (location.pathname.startsWith("/dashboard/ActiveBooking")) {
      setRoomOpen(true);
      setActiveSubMenu("ActiveBookings");
    } else if (location.pathname.startsWith("/dashboard/BookingHistory")) {
      setRoomOpen(true);
      setActiveSubMenu("BookingHistory");
    } else if (location.pathname.startsWith("/dashboard/RoomListing")) {
      setProductsOpen(true);
      setActiveSubMenu("RoomListings");
    } else if (location.pathname.startsWith("/dashboard/AddNewRoom")) {
      setProductsOpen(true);
      setActiveSubMenu("AddNewRoom");
    } else if (location.pathname.startsWith("/dashboard/BookingAlert")) {
      setNotificationOpen(true);
      setActiveSubMenu("BookingAlert");
    } else if (location.pathname.startsWith("/dashboard/GuestMessage")) {
      setNotificationOpen(true);
      setActiveSubMenu("GuestMessage");
    } else if (location.pathname.startsWith("/dashboard/FAQ")) {
      setSettingOpen(true);
      setActiveSubMenu("FAQ");
    } else if (location.pathname.startsWith("/dashboard/PaymentSetting")) {
      setSettingOpen(true);
      setActiveSubMenu("PaymentSetting");
    } else if (location.pathname.startsWith("/dashboard/subscription")) {
      setSubscriptionOpen(true);
      setActiveSubMenu("todaysub");
    } else if (location.pathname.startsWith("/dashboard/support")) {
      setSupportOpen(true);
      setActiveSubMenu("ContactSupport");
    } else {
      // Handle the case where the path doesn't match any known routes
      setActiveSubMenu(null);
    }
  }, [location]);
  return (
    <div className={`sidebar ${isSidebarOpen ? isAbove768 ? 'sideopen' : 'sideclose' : 'closed'}`}>
      <div className="top">
        <Link to="/dashboard/Chart" style={{ textDecoration: "none" }}>
          <span className="logo">
            <img style={{ width: "130px", height: "40px" }} src={Dashlogo} alt="Dashboard Logo" />
          </span>
        </Link>
        <div onClick={toggleSidebar}>
          <HighlightOffIcon style={{ cursor: 'pointer', display: isSidebarOpen ? 'none' : 'block' }} /> {/* Close icon */}
        </div>

      </div>
      <hr />
      <div className="center">
        <ul className="sidebar_main">
          <div className="menucontainer">
            <p className="title">Menu</p>
            <div className="titleicon" onClick={toggleSidebar}>
              <ExpandLessIcon style={{ filter: 'drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2))', transform: isSidebarOpen ? 'rotate(-90deg)' : 'rotate(90deg)', }} />

            </div>

          </div>

          {/* Dashboard Section */}
          <li
            onClick={() => toggleSection("dashboard")}
            style={isDashboardOpen ? activeStyle : {}}
          >
            <DashboardIcon style={isDashboardOpen ? activeStyle : {}} />
            <span style={isDashboardOpen ? activeStyle : {}}>Dashboard</span>
            {!isDashboardOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </li>
          {isDashboardOpen && (
            <ul className="sub-menu">
              <li onClick={() => setActiveSubMenu("todaydash")}>
                <Link to="/dashboard/Chart/today" style={{ textDecoration: "none", textAlign: 'right' }} onClick={() => handlesubmenu('Today')}>
                  <span className={activeSubMenu === "todaydash" ? 'active' : ''}> -- Today</span>
                </Link>
              </li>
              <li onClick={() => setActiveSubMenu("yesterdaydash")}>
                <Link to="/dashboard/Chart/yesterday" style={{ textDecoration: "none" }} onClick={() => handlesubmenu('Yesterday')}>
                  <span className={activeSubMenu === "yesterdaydash" ? 'active' : ''}> -- Yesterday</span>
                </Link>
              </li>
              <li onClick={() => setActiveSubMenu("thisweekdash")}>
                <Link to="/dashboard/Chart/this_week" style={{ textDecoration: "none" }} onClick={() => handlesubmenu('This Week')}>
                  <span className={activeSubMenu === "thisweekdash" ? 'active' : ''}> -- This Week</span>
                </Link>
              </li>
              <li onClick={() => setActiveSubMenu("last4dash")}>
                <Link to="/dashboard/Chart/last_4_weeks" style={{ textDecoration: "none" }} onClick={() => handlesubmenu('Last 4 Weeks')}>
                  <span className={activeSubMenu === "last4dash" ? 'active' : ''}> -- Last 4 Weeks</span>
                </Link>
              </li>
            </ul>
          )}

          {/* Hotel Profile Section */}
          <li
            onClick={() => toggleSection("Hotel")}
            style={isRoomOpen ? activeStyle : {}}
          >
            <PersonOutlineIcon style={isRoomOpen ? activeStyle : {}} />
            <span style={isRoomOpen ? activeStyle : {}}>Manage Profile</span>
            {!isRoomOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </li>
          {isRoomOpen && (
            <ul className="sub-menu">
              <li onClick={() => setActiveSubMenu("HotelProfile")}>
                <Link to="/dashboard/HotelProfile" style={{ textDecoration: "none" }} onClick={() => handlesubmenu('HotelProfile')}>
                  <span className={activeSubMenu === "HotelProfile" ? 'active' : ''}> -- Hotel Profile</span>
                </Link>
              </li>
              {/* <li onClick={() => setActiveSubMenu("NewBookingRequests")}>
                <Link to="/dashboard/NewBooking" style={{ textDecoration: "none" }} onClick={() => handlesubmenu('New Booking Requests')}>
                  <span className={activeSubMenu === "NewBookingRequests" ? 'active' : ''}> -- New Booking Requests</span>
                </Link>
              </li> */}
              <li onClick={() => setActiveSubMenu("NewBookingRequests")}>
                <Link to="/dashboard/NewBooking" style={{ textDecoration: "none" }} onClick={() => handlesubmenu('New Booking Requests')}>
                  <span className={activeSubMenu === "NewBookingRequests" ? 'active' : ''}>
                    -- New Booking Requests
                    {notificationCount >= 0 && (
                      <Badge
                        badgeContent={notificationCount}
                        color="error"
                        sx={{
                          paddingLeft: '2px',
                          color: 'white',
                          '& .MuiBadge-badge': {
                            color: 'white',
                          },
                        }}
                      ></Badge>
                    )}
                  </span>
                </Link>
              </li>

              <li onClick={() => setActiveSubMenu("ActiveBookings")}>
                <Link to="/dashboard/ActiveBooking" style={{ textDecoration: "none" }} onClick={() => handlesubmenu('Active Bookings')}>
                  <span className={activeSubMenu === "ActiveBookings" ? 'active' : ''}> -- Active Bookings</span>
                </Link>
              </li>
              <li onClick={() => setActiveSubMenu("BookingHistory")}>
                <Link to="/dashboard/BookingHistory" style={{ textDecoration: "none" }} onClick={() => handlesubmenu('Booking History')}>
                  <span className={activeSubMenu === "BookingHistory" ? 'active' : ''}> -- Booking History</span>
                </Link>
              </li>
            </ul>
          )}

          {/* Room Manage Section */}
          <li
            onClick={() => toggleSection("Room")}
            style={isProductsOpen ? activeStyle : {}}
          >
            <StoreIcon style={isProductsOpen ? activeStyle : {}} />
            <span style={isProductsOpen ? activeStyle : {}}>Room Manage</span>
            {!isProductsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </li>
          {isProductsOpen && (
            <ul className="sub-menu">
              <li onClick={() => setActiveSubMenu("RoomListings")}>
                <Link to="/dashboard/RoomListing" style={{ textDecoration: "none" }} onClick={() => handlesubmenu('Room Listings')}>
                  <span className={activeSubMenu === "RoomListings" ? 'active' : ''}> -- Room Listings</span>
                </Link>
              </li>
              <li onClick={() => setActiveSubMenu("AddNewRoom")}>
                <Link to="/dashboard/AddNewRoom" style={{ textDecoration: "none" }} onClick={() => handlesubmenu('Add New Room')}>
                  <span className={activeSubMenu === "AddNewRoom" ? 'active' : ''}> -- Add New Room</span>
                </Link>
              </li>
              <li onClick={() => setActiveSubMenu("Availability")}>
                <Link to="/dashboard/Availability" style={{ textDecoration: "none" }} onClick={() => handlesubmenu('Set Availabilty')}>
                  <span className={activeSubMenu === "Availability" ? 'active' : ''}> -- Set Availabilty</span>
                </Link>
              </li>
            </ul>
          )}

          {/* Notification Section */}
          <li
            onClick={() => toggleSection("notification")}
            style={isNotificationOpen ? activeStyle : {}}
          >
            <NotificationsNoneIcon style={isNotificationOpen ? activeStyle : {}} />
            <span style={isNotificationOpen ? activeStyle : {}}>Notifications</span>
            {!isNotificationOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </li>
          {isNotificationOpen && (
            <ul className="sub-menu">
              <li onClick={() => setActiveSubMenu("BookingAlert")}>
                <Link to="/dashboard/BookingAlert" style={{ textDecoration: "none" }} onClick={() => handlesubmenu('Booking Alerts')}>
                  <span className={activeSubMenu === "BookingAlert" ? 'active' : ''}> -- Booking Alerts</span>
                </Link>
              </li>
              <li onClick={() => setActiveSubMenu("GuestMessage")}>
                <Link to="/dashboard/GuestMessage" style={{ textDecoration: "none" }} onClick={() => handlesubmenu('Guest Messages')}>
                  <span className={activeSubMenu === "GuestMessage" ? 'active' : ''}> -- Guest Messages</span>
                </Link>
              </li>
            </ul>
          )}

          {/* Subscription Section */}
          <Link to="/dashboard/subscription" style={{ textDecoration: "none" }} onClick={() => handlesubmenu('Guest Messages')}>
            <li
              onClick={() => toggleSection("subscription")}
              style={isSubscriptionOpen ? activeStyle : {}}
            >

              <InsertChartIcon style={isSubscriptionOpen ? activeStyle : {}} />
              <span style={isSubscriptionOpen ? activeStyle : {}}>Subscription</span>
              {!isSubscriptionOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}

            </li>
          </Link>
          {/* Setting Section */}
          <li
            onClick={() => toggleSection("setting")}
            style={isSettingOpen ? activeStyle : {}}
          >
            <SettingsApplicationsIcon style={isSettingOpen ? activeStyle : {}} />
            <span style={isSettingOpen ? activeStyle : {}}>Settings</span>
            {!isSettingOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </li>
          {isSettingOpen && (
            <ul className="sub-menu">
              <li onClick={() => setActiveSubMenu("ChangePassword")}>
                <Link to="/dashboard/FAQ" style={{ textDecoration: "none" }} onClick={() => handlesubmenu('Change Password')}>
                  <span className={activeSubMenu === "ChangePassword" ? 'active' : ''}> -- Change Password</span>
                </Link>
              </li>
              <li onClick={() => setActiveSubMenu("PaymentSetting")}>
                <Link to="/dashboard/FAQ" style={{ textDecoration: "none" }} onClick={() => handlesubmenu('Payment Setting')}>
                  <span className={activeSubMenu === "PaymentSetting" ? 'active' : ''}> -- Payment Setting</span>
                </Link>
              </li>
            </ul>
          )}

          {/* Support Section */}
          <li
            onClick={() => toggleSection("support")}
            style={isSupportOpen ? activeStyle : {}}
          >
            <PsychologyOutlinedIcon style={isSupportOpen ? activeStyle : {}} />
            <span style={isSupportOpen ? activeStyle : {}}>Support</span>
            {!isSupportOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </li>
          {isSupportOpen && (
            <ul className="sub-menu">
              <li onClick={() => setActiveSubMenu("ContactSupport")}>
                <Link to="/dashboard/FAQ" style={{ textDecoration: "none" }} onClick={() => handlesubmenu(' Contact Support')}>
                  <span className={activeSubMenu === "ContactSupport" ? 'active' : ''}> -- Contact Support</span>
                </Link>
              </li>
              <li onClick={() => setActiveSubMenu("FAQ")}>
                <Link to="/dashboard/FAQ" style={{ textDecoration: "none" }} onClick={() => handlesubmenu('FAQs')}>
                  <span className={activeSubMenu === "FAQ" ? 'active' : ''}> -- FAQs</span>
                </Link>
              </li>
            </ul>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
