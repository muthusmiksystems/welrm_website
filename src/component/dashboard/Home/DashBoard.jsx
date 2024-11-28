import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/SideBar";
import Navbar from "../Navbar/Navbar";
import "./home.scss";
import { Outlet } from "react-router-dom";
import Footer from "../../Footer";
import ActiveTabController from "../Navbar/ActiveTabController";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false); // Close sidebar if width is less than 768px
    } else {
      setIsSidebarOpen(true); // Open sidebar if width is greater than or equal to 768px
    }
  };

  useEffect(() => {
    // Set initial state based on window size
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <div className="home">
        <div className="sidebar">
        <ActiveTabController />
          {isSidebarOpen && <Sidebar toggleSidebar={toggleSidebar} />}
        </div>
        {/* Conditionally render the sidebar */}
        <div className="homeContainer">
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/> {/* Pass toggleSidebar as prop */}
          <div className="widgets">
            <Outlet />
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Home;
