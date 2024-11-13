import {
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { AddBoxOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { LoginUser } from "../../API/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import loginImg from "../../Assests/login.png";
import logo from "../../Assests/logo.png";
import { Toaster } from "react-hot-toast";
import AuthComponent from "./AuthComponent";
const validationSchema = Yup.object().shape({
  emailOrPhone: Yup.string()
    .required("Email or Phone Number is required")
    .test("emailOrPhone", "Enter a valid email or phone number", (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\d{10}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    }),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const NewLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data?.emailOrPhone);

    const payload = {
      [isEmail ? "email" : "mobile"]: data?.emailOrPhone, // Send 'email' or 'mobile' depending on the input
      password: data?.password,
    };

    dispatch(LoginUser(payload, navigate));
  };

  return (
    <AuthComponent title={"Login to Your Owner Dashboard"} description={"Log in to manage your property details, bookings, from everywhere from these login/registration pages."}>
      <Typography
        sx={{
          alignSelf: "flex-start",
          marginBottom: "8px",
          fontWeight: "500",
        }}>
        Email/Number
      </Typography>
      <TextField
        {...register("emailOrPhone")}
        error={!!errors.emailOrPhone}
        helperText={errors.emailOrPhone?.message}
        placeholder="Email or Number"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <Typography
        sx={{
          alignSelf: "flex-start",
          marginBottom: "8px",
          fontWeight: "500",
        }}>
        Password
      </Typography>
      <TextField
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        placeholder="Password"
        type={showPassword ? "text" : "password"} // Toggle between text and password
        variant="outlined"
        fullWidth
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
        }}
      >
        {/* Remember me checkbox */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center", // Ensure checkbox and label are aligned
            mb: { xs: 1, sm: 0 }, // Add margin bottom on small screens for spacing
          }}
        >
          <Input type="checkbox" />
          <Typography
            sx={{
              ml: 1, // Use shorthand for marginLeft
              mt: 0.5,
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            Remember me
          </Typography>
        </Box>

        {/* Forgot password link */}
        <Box>
          <Typography
            sx={{
              color: "#C42A25",
              fontWeight: "500",
              textAlign: { xs: "center", sm: "right" }, // Center on small screens, right-align on larger screens
            }}
          >
            <Link
              to="/ForgetPassword"
              style={{
                textDecoration: "none",
                color: "#C42A25",
                fontWeight: "500",
              }}
            >
              Forgot password?
            </Link>
          </Typography>
        </Box>
      </Box>

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
            padding: "3px 0px",
          }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "left" }, // Center on small screens, space-between on medium and up
              flexDirection: { xs: "row", sm: "row" }, // Stack vertically on small screens
              alignItems: "center", // Align center on smaller screens
              gap: { xs: 2, sm: 0 }, // Add gap between elements on small screens
              width: "100%",
              marginBottom: "10px",
            }}>
            <svg
              style={{
                margin: "0px 4px",
              }}
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_2664_8258)">
                <path
                  d="M10.5156 8.60547V12.6783H16.1755C15.9269 13.9881 15.1811 15.0971 14.0625 15.8428L17.4756 18.4911C19.4642 16.6556 20.6115 13.9595 20.6115 10.7567C20.6115 10.011 20.5446 9.29388 20.4203 8.60558L10.5156 8.60547Z"
                  fill="#4285F4"
                />
                <path
                  d="M4.6274 12.5195L3.85761 13.1088L1.13281 15.2312C2.86327 18.6634 6.40997 21.0345 10.521 21.0345C13.3604 21.0345 15.7409 20.0975 17.481 18.4914L14.0679 15.8431C13.131 16.4741 11.9359 16.8565 10.521 16.8565C7.78667 16.8565 5.46352 15.0114 4.6317 12.5256L4.6274 12.5195Z"
                  fill="#34A853"
                />
                <path
                  d="M1.12806 5.80469C0.411061 7.21959 0 8.81622 0 10.518C0 12.2197 0.411061 13.8164 1.12806 15.2313C1.12806 15.2408 4.62728 12.5161 4.62728 12.5161C4.41695 11.8851 4.29263 11.2159 4.29263 10.5179C4.29263 9.81985 4.41695 9.15066 4.62728 8.51966L1.12806 5.80469Z"
                  fill="#FBBC05"
                />
                <path
                  d="M10.5212 4.18752C12.07 4.18752 13.4467 4.72289 14.5462 5.75545L17.5577 2.74391C15.7316 1.04216 13.3607 0 10.5212 0C6.41018 0 2.86327 2.36145 1.13281 5.80326L4.63193 8.51846C5.46364 6.03269 7.78689 4.18752 10.5212 4.18752Z"
                  fill="#EA4335"
                />
              </g>
              <defs>
                <clipPath id="clip0_2664_8258">
                  <rect width="21.0332" height="21.0332" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <svg
              style={{
                margin: "0px 4px",
              }}
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_2664_8259)">
                <path
                  d="M21.5176 10.5166C21.5176 4.70849 16.8091 0 11.001 0C5.19287 0 0.484375 4.70849 0.484375 10.5166C0.484375 15.4485 3.87998 19.587 8.46059 20.7236V13.7305H6.29206V10.5166H8.46059V9.13178C8.46059 5.55235 10.0806 3.89325 13.5948 3.89325C14.2611 3.89325 15.4108 4.02407 15.8811 4.15448V7.06758C15.6329 7.0415 15.2017 7.02846 14.6662 7.02846C12.9419 7.02846 12.2756 7.68175 12.2756 9.37997V10.5166H15.7107L15.1205 13.7305H12.2756V20.9562C17.483 20.3273 21.518 15.8935 21.518 10.5166H21.5176Z"
                  fill="#0866FF"
                />
                <path
                  d="M15.1254 13.7318L15.7155 10.5179H12.2804V9.38125C12.2804 7.68303 12.9467 7.02974 14.671 7.02974C15.2065 7.02974 15.6377 7.04278 15.8859 7.06886V4.15576C15.4156 4.02494 14.2659 3.89453 13.5996 3.89453C10.0854 3.89453 8.4654 5.55363 8.4654 9.13306V10.5179H6.29688V13.7318H8.4654V20.7249C9.27896 20.9268 10.13 21.0345 11.0058 21.0345C11.437 21.0345 11.8623 21.008 12.28 20.9575V13.7318H15.1249H15.1254Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_2664_8259">
                  <rect
                    width="21.0332"
                    height="21.0332"
                    fill="white"
                    transform="translate(0.484375)"
                  />
                </clipPath>
              </defs>
            </svg>
            <svg
              style={{
                margin: "0px 4px",
              }}
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_2664_8260)">
                <path
                  d="M20.0719 16.3913C19.7538 17.1261 19.3773 17.8025 18.9411 18.4244C18.3465 19.2722 17.8596 19.859 17.4844 20.1849C16.9028 20.7198 16.2796 20.9938 15.6122 21.0093C15.1332 21.0093 14.5554 20.873 13.8829 20.5965C13.2082 20.3212 12.5881 20.1849 12.0211 20.1849C11.4265 20.1849 10.7888 20.3212 10.1066 20.5965C9.42348 20.873 8.87313 21.0171 8.45235 21.0314C7.81241 21.0587 7.17455 20.7769 6.53787 20.1849C6.1315 19.8305 5.62321 19.2229 5.01431 18.3621C4.361 17.4429 3.82389 16.377 3.40311 15.1618C2.95247 13.8492 2.72656 12.5781 2.72656 11.3476C2.72656 9.93802 3.03114 8.72229 3.64122 7.70351C4.12068 6.88519 4.75854 6.23967 5.55687 5.76578C6.35519 5.2919 7.21779 5.05042 8.14673 5.03497C8.65501 5.03497 9.32156 5.19219 10.1499 5.50119C10.9759 5.81123 11.5062 5.96845 11.7387 5.96845C11.9126 5.96845 12.5018 5.78461 13.5005 5.4181C14.4451 5.0782 15.2422 4.93747 15.8953 4.9929C17.6649 5.13572 18.9943 5.8333 19.8785 7.09006C18.2958 8.04899 17.513 9.39209 17.5285 11.1151C17.5428 12.4571 18.0297 13.5739 18.9865 14.4607C19.4202 14.8722 19.9044 15.1903 20.4432 15.4162C20.3264 15.7551 20.203 16.0797 20.0719 16.3913ZM16.0134 0.420784C16.0134 1.47268 15.6291 2.45484 14.8631 3.36392C13.9387 4.44463 12.8206 5.06911 11.6081 4.97057C11.5927 4.84438 11.5837 4.71156 11.5837 4.57199C11.5837 3.56217 12.0233 2.48146 12.804 1.59783C13.1938 1.15043 13.6894 0.778429 14.2906 0.481674C14.8904 0.189347 15.4577 0.0276841 15.9913 0C16.0069 0.140623 16.0134 0.281254 16.0134 0.42077V0.420784Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_2664_8260">
                  <rect
                    width="21.0332"
                    height="21.0332"
                    fill="white"
                    transform="translate(0.96875)"
                  />
                </clipPath>
              </defs>
            </svg>
          </Box>
          <Box>
            <Typography>
              Don’t have a account?
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  color: "#C42A25",
                  fontWeight: "500",
                }}>
                   Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>

        <Link to="">
          <Box
            sx={{
              marginTop: "20px",
            }}>
            <Button onClick={handleSubmit(onSubmit)}
              type="submit"
              sx={{
                color: "white",
                textAlign: "center",
                bgcolor: "#C42A25",
                borderRadius: "10px",
                padding: "10px 50px",
              }}>
              Login
            </Button>
          </Box>
        </Link>
      </Box>
    </AuthComponent>

  );
};

export default NewLogin;
