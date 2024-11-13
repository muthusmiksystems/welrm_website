import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.Auth); // Use correct slice of state (e.g., Auth)
  const token = localStorage.getItem("token"); // Or get token from the store if it's stored there
  let location = useLocation();
  // Check if user is authenticated and if a valid token exists
  if (!user.isAuthenticated && !token) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  // Add token validation logic here if needed (e.g., checking token expiration)

  return children; // Allow access to the protected route if checks pass
};

export default ProtectedRoute;
