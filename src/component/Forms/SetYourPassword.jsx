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
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import loginImg from "../../Assests/login.png";
import logo from "../../Assests/logo.png";
import toast from "react-hot-toast";
import axios from "axios";
import { apiUrl } from "../../Shared/shared";
import AuthComponent from "./AuthComponent";

// Yup validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must include at least one uppercase letter")
    .matches(/[a-z]/, "Password must include at least one lowercase letter")
    .matches(/[0-9]/, "Password must include at least one digit")
    .matches(
      /[!@#$%^&*]/,
      "Password must include at least one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const SetYourPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema), // Connect Yup schema to react-hook-form
  });

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        return;
      }

      const config = {
        headers: {
          "oauth-token": token, // Send the token with the oauth-token key in headers
        },
      };
      const payload = {
        newPassword: data.password, // Set the new password field
        confirmPassword: data.confirmPassword, // Set the confirm password field
      };
      // Make the POST request and pass 'data' and 'config'
      const response = await axios.put(`${apiUrl}/user/reset-password`, payload, config);
      localStorage.setItem('users', response.data.data);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));

      if (response.data.success === true) {
        toast.success("Password saved successfully");
        navigate("/basicInfo"); // Navigate to the Dashboard on success
      } else {
        toast.error("Invalid password!");
      }
    } catch (error) {
      toast.error("Password update failed.");
      console.log(error);
    }

  };


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthComponent title={"Set Your New Password"} description={"Create a new password for your WELRM account below. Ensure it's secure and memorable. Welcome back to seamless management with WELRM!"}>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography
          sx={{
            alignSelf: "flex-start",
            marginBottom: "8px",
            fontWeight: "500",
          }}>
          Password
        </Typography>
        <TextField
          placeholder="India@12345"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          {...register("password")} // Register the password input with react-hook-form
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{ marginBottom: "16px" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Typography
          sx={{
            alignSelf: "flex-start",
            marginBottom: "8px",
            fontWeight: "500",
          }}>
          Confirm Password
        </Typography>
        <TextField
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          {...register("confirmPassword")} // Register the confirmPassword input with react-hook-form
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          sx={{ marginBottom: "16px" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

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
            {/* <Box sx={{ display: "flex" }}>
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
            </Box> */}
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

export default SetYourPassword;
