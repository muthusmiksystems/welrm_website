import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import loginImg from "../../Assests/login.png";
import logo from "../../Assests/logo.png";
import { useDispatch } from "react-redux";
import savePhoneNumber from "../../API/saveNumber";
import AuthComponent from "./AuthComponent";
import { apiUrl } from "../../Shared/shared";
// Validation schema using Yup
const schema = yup.object().shape({
  emailOrNumber: yup
    .string()
    .required("Email/Phone number is required")
    .test(
      "emailOrNumber",
      "Please enter a valid email or phone number",
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      }
    ),
});

const Forgot = () => {
  // Initialize the form using react-hook-form and yup for validation
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${apiUrl}/forgot-password`,
        {
          mobile: data.emailOrNumber,
          type: "mobile"
        }
      );

      if (response.data.success) {
        const userToken = response.data.data.userToken;
        if (userToken) {
          // Store the userToken in localStorage
          dispatch(savePhoneNumber(data.emailOrNumber))
          localStorage.setItem("userToken", userToken);
          toast.success("OTP sent successfully!");
          navigate("/forget-otp")
        } else {
          toast.error("User token is missing.");
        }
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Error sending the reset instructions.");
    }
  };

  return (

    <AuthComponent title={"Forgot Your password?"} description={"No worries! Enter your registered email Address/phone number below and we'll send you instructions to reset your password. Stay connected with WELRM effortlessly."}>


      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography
          sx={{
            alignSelf: "flex-start",
            marginBottom: "8px",
            fontWeight: "500",
          }}
        >
          Email/Number
        </Typography>
        <TextField
          {...register("emailOrNumber")}
          placeholder="welrm123@gmail.com or 1234567890"
          variant="outlined"
          fullWidth
          error={!!errors.emailOrNumber}
          helperText={errors.emailOrNumber?.message}
          sx={{ marginBottom: "16px" }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "space-between" }, // Center on small screens, space-between on medium and up
            flexDirection: { xs: "column", sm: "row" }, // Stack vertically on small screens
            alignItems: "center", // Align center on smaller screens
            gap: { xs: 0, sm: 0 }, // Add gap between elements on small screens
          }}
        >
          <Box
            sx={{
              marginTop: "20px",
              padding: "3px 10px",
            }}
          >
            <Typography>
              Remember Password?
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "#C42A25",
                  fontWeight: "500",
                }}
              >
                {" "}
                Login
              </Link>
            </Typography>
          </Box>

          <Box
            sx={{
              marginTop: "20px",
            }}
          >
            <Button
              type="submit"
              sx={{
                color: "white",
                textAlign: "center",
                bgcolor: "#C42A25",
                borderRadius: "10px",
                padding: "10px 50px",
              }}
            >
              Send Code
            </Button>
          </Box>
        </Box>
      </form>
    </AuthComponent>
  );
};

export default Forgot;
