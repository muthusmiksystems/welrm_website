import React, { useContext, useState, useEffect } from "react";
import { TabContext } from "./TabContex"; // Adjust the import path as needed
import "./Navbar.scss";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { logout } from "../../../API/auth";
import profile from '../../../Assests/WELRM.png';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import notification from '../../../Assests/notification.png'
import axios from "axios";
import toast from "react-hot-toast";
import { apiUrl } from "../../../Shared/shared";

const settings = ['Logout'];
// const settings = ['Profile', 'Dashboard', 'Logout'];

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const bookingId = useSelector((state) => state?.Booking?.booking?.data?.hotels?.rows || []);

  const pendingCount = bookingId.filter(item => item.status === "pending").length;

  console.log("Pending Count:", pendingCount);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [process, setProcess] = useState(false);
  const { activeTab } = useContext(TabContext);
  const [notificationCount, setNotificationCount] = useState(pendingCount); // Dynamic notification count
  const [anchorElUser, setAnchorElUser] = useState(null); // State for menu anchor
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // State for mobile view
  const user = useSelector((state) => state.Auth);

  // Fetch data once on mount or when location changes
  useEffect(() => {
    fetchData();
  }, [location]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      return;
    }

    const config = {
      headers: {
        "oauth-token": token, // Send the token with the oauth-token key in headers
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.get(`${apiUrl}/owner/profile`, config);
      setProcess(!response.data.data.hasSubscribed && location.pathname.toLowerCase().startsWith('/dashboard/chart'));

    } catch (error) {
      console.error("Error fetching user data", error);
      toast.error("Failed to fetch user data");
    }
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="left">
          <div>
            <h1 className="text-[#4B5563] ms-0" style={{ fontSize: '42px', fontWeight: 600 }}>{activeTab}</h1>
            {!isMobile && process && (
              <div className="registration-container">
                <span className="buttonroun">Registration Process
                  <Button variant="contained" className="status-btn">IN PROGRESS</Button>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="items">
          {/* Settings Icon */}
          <div className="item">
            <div className="setting">
              <SettingsOutlinedIcon className="icon" />
            </div>
          </div>

          {/* Notification Icon */}
          {/* <div className="item">
            <div className="setting">
              <Badge badgeContent={notificationCount} color="#C42A25">
                <img src={notification} className="icon" />
              </Badge>
            </div>
          </div> */}
          <div className="item">
            <div className="setting">
              {notificationCount > 0 && (
                <Badge badgeContent={notificationCount} color="error">
                  <img src={notification} className="icon" />
                </Badge>
              )}
              {notificationCount <= 0 && (
                <img src={notification} className="icon" />
              )}
            </div>
          </div>

          {/* Profile Avatar and User Menu */}
          <div className="item" onClick={handleOpenUserMenu}>
            <img src={profile} alt="profile" className="avatar" />
          </div>

          {/* User Menu */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                {setting === "Logout"
                  ? <Button onClick={handleLogout}>{setting}</Button>
                  : setting === "Dashboard" ? <Button onClick={() => navigate('/dashboard/Chart/today')}>{setting}</Button> : <Button>{setting}</Button>
                }
              </MenuItem>
            ))}
          </Menu>

          {/* User Info */}
          {!isMobile && user?.user?.user && (
            <div>
              <p className="fontnav mb-3">{user?.user?.user?.fullName}</p>
              <p className="fontnav mt-2">{user?.user?.user?.hotel?.hotelName}</p>
              {!user.user.user.hotel && <p style={{ marginTop: '2px' }}>{user.user.user.userType}</p>}

            </div>
          )}

          {/* Mobile Menu Icon */}
          {(isMobile || !isSidebarOpen) && (
            <div className="menu-icon" onClick={toggleSidebar}>
              <MenuIcon style={{ fontSize: 30 }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
