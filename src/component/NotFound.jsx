import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/login");
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", marginTop: "100px" }}>
      <Box>
        <Typography
          variant="h1"
          component="h2"
          sx={{ fontSize: "6rem", fontWeight: "bold", color: "primary.main" }}>
          404
        </Typography>
        <Typography variant="h5" component="h3" sx={{ marginBottom: "20px" }}>
          Oops! Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "30px" }}>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGoHome}>
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
