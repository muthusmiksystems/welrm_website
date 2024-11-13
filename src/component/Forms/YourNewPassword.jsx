import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form"; // For form validation
import axios from "axios"; // For API request
import { Link, useNavigate } from "react-router-dom"; // Navigation after successful password reset
import { toast } from "react-hot-toast"; // For notifications
import loginImg from "../../Assests/login.png";
import logo from "../../Assests/logo.png";
import AuthComponent from "./AuthComponent";
import { apiUrl } from "../../Shared/shared";

const YourNewPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // For navigation after successful reset

  // Form setup with react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Watch password field for matching validation
  const password = watch("password");

  const onSubmit = async (data) => {
    const { password, confirmPassword } = data;

    // Validate password and confirmPassword
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token, authorization denied.");
        return;
      }

      const config = {
        headers: {
          "oauth-token": token, // Ensure this is the correct header key for your API
        },
      };

      const response = await axios.put(
        `${apiUrl}/user/reset-password`,
        {
          newPassword: password,
          confirmPassword: confirmPassword, // Explicitly send confirmPassword
        },
        config
      );

      if (response.data.success) {
        toast.success("Password reset successfully!");
        navigate("/login"); // Redirect to login page after success
      } else {
        toast.error(response.data.message || "Password reset failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while resetting the password.");
    }
  };


  return (
    <AuthComponent title={" Set Your New Password"} description={"Create a new password for your WELRM account. Ensure it is secure and memorable."}>


      {/* Password Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography
          sx={{
            alignSelf: "flex-start",
            marginBottom: "8px",
            fontWeight: "500",
          }}
        >
          Password
        </Typography>
        <TextField
          placeholder="India@12345"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          sx={{ marginBottom: "16px" }}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
              message:
                "Password must include at least one letter, one number, and one special character",
            },
          })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {errors.password && (
          <Typography color="error" variant="caption">
            {errors.password.message}
          </Typography>
        )}

        <Typography
          sx={{
            alignSelf: "flex-start",
            marginBottom: "8px",
            fontWeight: "500",
          }}
        >
          Confirm Password
        </Typography>
        <TextField
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          sx={{ marginBottom: "16px" }}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {errors.confirmPassword && (
          <Typography color="error" variant="caption">
            {errors.confirmPassword.message}
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "space-between" }, // Center on small screens, space-between on medium and up
            flexDirection: { xs: "column", sm: "row" }, // Stack vertically on small screens
            alignItems: "center", // Align center on smaller screens
            gap: { xs: 0, sm: 0 }, // Add gap between elements on small screens
          }}>
          <Box
            sx={{
              marginTop: "20px",
              padding: "3px 10px",
            }}>
            <Box sx={{ display: "flex" }}>
              <input type="checkbox" />
              <Typography
                sx={{
                  marginLeft: "10px",
                  marginTop: "5px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}>
                Password must meet our security criteria.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ marginTop: "20px" }}>

            <Button
              type="submit"
              sx={{
                color: "white",
                textAlign: "center",
                bgcolor: "#C42A25",
                borderRadius: "10px",
                padding: "5px 20px",
              }}>
              Set & Continue
            </Button>
          </Box>
        </Box>
      </form>
    </AuthComponent>
  );
};

export default YourNewPassword;
