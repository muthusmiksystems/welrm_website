import React, { useState } from 'react';
import { Grid, Box, Typography, Card, CardContent, Avatar, Button, Accordion, AccordionSummary, AccordionDetails, Link, Divider, IconButton, TextField, InputAdornment } from '@mui/material';
import { Facebook, Twitter, Instagram, YouTube, MailOutline } from '@mui/icons-material';
import "./Hero.css";
import { FaFacebookF } from "react-icons/fa";
function Footer({ onAboutClick, onOurStoryClick, onHomeClick }) {
  return (
    <>
      <Box
        sx={{
          backgroundColor: '#1a1a1a', // Dark background
          color: '#fff',
          padding: '20px 20px',
        }}
      >
        <Box textAlign="center" mt={4} sx={{
          marginBottom: "60px"
        }}>
          <Button
            component="a"
            href="https://welrm.com/"
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="error"
            size="large"
          >
            Find Your Perfect Hotel Booking
          </Button>
        </Box>
        <Grid container spacing={4}>
          {/* COMPANY */}
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: "White", fontSize: "18px", fontSize: "18px", fontWeight: "500px" }}>COMPANY</Typography>

            <Typography sx={{ paddingTop: "10px" }}>
              <Link to="#" onClick={onHomeClick} style={{ textDecoration: "none", color: "#7d7d7d", fontSize: "16px", fontWeight: "500px", cursor: "pointer" }}>HOME</Link>
            </Typography>

            {/* <Typography sx={{ paddingTop: "10px" }}>
              <Link to="/room-management" style={{ textDecoration: "none", color: "#7d7d7d", fontSize: "16px", fontWeight: "500px" }}>ROOM MANAGEMENT</Link>
            </Typography> */}

            <Typography sx={{ paddingTop: "10px" }}>
              <Link to="#" onClick={onAboutClick} style={{ textDecoration: "none", color: "#7d7d7d", fontSize: "16px", fontWeight: "500px", cursor: "pointer" }}>ABOUT US</Link>
            </Typography>

            <Typography sx={{ paddingTop: "10px" }}>
              <Link to="#" onClick={onOurStoryClick} style={{ textDecoration: "none", color: "#7d7d7d", fontSize: "16px", fontWeight: "500px", cursor: "pointer" }}>OUR STORY</Link>
            </Typography>

            <Typography sx={{ paddingTop: "10px" }}>
              <Link to="/blogs" style={{ textDecoration: "none", color: "#7d7d7d", fontSize: "16px", fontWeight: "500px" }}>BLOGS</Link>
            </Typography>
          </Grid>

          {/* LEGAL */}
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: "White", fontSize: "18px", fontSize: "18px", fontWeight: "500px" }}>LEGAL</Typography>

            <Typography sx={{ paddingTop: "10px" }}>
              <Link to="/terms-and-services" style={{ textDecoration: "none", color: "#7d7d7d", fontSize: "16px", fontWeight: "500px" }}>
                TERMS AND SERVICES
              </Link>
            </Typography>

            <Typography sx={{ paddingTop: "10px" }}>
              <Link to="/privacy-policy" style={{ textDecoration: "none", color: "#7d7d7d", fontSize: "16px", fontWeight: "500px" }}>
                PRIVACY POLICY
              </Link>
            </Typography>

            <Typography sx={{ paddingTop: "10px" }}>
              <Link to="/cancellation-policy" style={{ textDecoration: "none", color: "#7d7d7d", fontSize: "16px", fontWeight: "500px" }}>
                CANCELLATION POLICY
              </Link>
            </Typography>

            <Typography sx={{ paddingTop: "10px" }}>
              <Link to="/hotel-partners-agreement" style={{ textDecoration: "none", color: "#7d7d7d", fontSize: "16px", fontWeight: "500px" }}>
                AGREEMENT WITH HOTEL PARTNERS
              </Link>
            </Typography>
          </Grid>


          {/* NEWSLETTER AND ADDRESS */}
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: "10px", fontSize: "18px", fontSize: "18px", fontWeight: "500px" }}>NEWSLETTER</Typography>
            <TextField
              variant="standard"
              placeholder="Enter email address"

              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutline sx={{ color: '#7d7d7d' }} />
                  </InputAdornment>
                ),
                disableUnderline: true,
                style: { color: '#fff' },
              }}
              sx={{
                padding: '5px 10px',
                borderRadius: '1px',
                marginBottom: '20px',
                borderBottom: "2px solid #7d7d7d"
              }}
            />
            {/* <Typography variant="h6" sx={{ fontWeight: 'bold' }}>ADDRESS:</Typography>
              <Typography sx={{
                paddingTop: "10px"
              }}>
                Opp. Senior Sec. School, Ghanauli, Ropar, Punjab - 140113
              </Typography> */}
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginLeft: "40px", fontSize: "18px", fontSize: "18px", fontWeight: "500px" }}>FOLLOW US</Typography>

            <IconButton
              sx={{
                backgroundColor: '#fff',
                borderRadius: '50%',
                color: '#000',
                marginX: "30px",
                marginY: "10px",
                padding: '3px',
                '&:hover': {
                  backgroundColor: '#ffff'
                }
              }}
            >
              <a style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} target='0' href='https://www.facebook.com/welrmhospitalityservices/'>
                <FaFacebookF />
              </a>
            </IconButton>

            <IconButton
              sx={{
                backgroundColor: '#fff',
                borderRadius: '50%',
                color: '#000',
                padding: '3px',
                '&:hover': {
                  backgroundColor: '#ffff'
                }
              }}
            >
              <a
                href='#'
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
              <Twitter />
              </a>
            </IconButton>

            <IconButton
              sx={{
                backgroundColor: '#fff',
                borderRadius: '50%',
                color: '#000',
                marginX: "30px",
                padding: '5px', // Adjust padding to control the circle size
                // display: 'flex',
                // justifyContent: 'center',
                // alignItems: 'center', // Center the icon within the button
                '&:hover': {
                  backgroundColor: '#ffff',
                },
              }}
            >
              <a
                href='https://www.instagram.com/welrmhospitalityservices/' target='0'
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <Instagram />
              </a>
            </IconButton>


            <IconButton
              sx={{
                backgroundColor: '#fff',
                borderRadius: '50%',
                color: '#000',
                padding: '3px',
                '&:hover': {
                  backgroundColor: '#ffff'
                }
              }}
            >
              <a
                href='#'
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
              <YouTube />
              </a>
            </IconButton>

            <Typography variant="h6" sx={{ fontWeight: 'bold', marginLeft: "40px", fontSize: "18px", fontSize: "18px", fontWeight: "500px" }}>CONTACT US</Typography>
            <Typography sx={{
              color: "#7d7d7d", marginBottom: '10px', marginLeft: "40px"
            }}>+91-9584290842</Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', marginLeft: "40px", fontSize: "18px", fontWeight: "500px" }}>EMAIL</Typography>
            <Typography sx={{
              color: "#7d7d7d", marginLeft: "40px"
            }}>INFO@WELRM.COM</Typography>
          </Grid>

        </Grid>



        {/* COPYRIGHT SECTION */}
        <Typography sx={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#888', borderTop: '1px solid #444444', paddingTop: '20px' }}>
          © 2016 to 2019 welrm.com, Inc. All rights reserved.
        </Typography>
      </Box>
    </>
  );
}

export default Footer;