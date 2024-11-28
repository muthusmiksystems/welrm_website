import React from 'react'
import { Box, Typography, Button } from '@mui/material';

import Check from "../Assests/check.png"

function HeroCards(props) {
  return (
    // <Box sx={{
    //   display: "flex",
    //   flexDirection: "column",
    //   flexWrap: "wrap",
    //   alignItems: "center",
    //   margin: "auto"
    // }}>
      <Box sx={{
        display: "flex",
        gap: "50px",
        width: "90%",
        padding: "20px 0px",
        flexDirection: { lg: "row", md: "row", sm: "row", xs: "column" },
        justifyContent: "space-between",
        gap: "20px",
        margin: "auto"
      }}>
        <Box sx={{
          maxWidth: "800px",

        }}>
          <Typography
            sx={{
              fontFamily: 'Mona-Sans',
              fontWeight: 600,
              color: 'black', // Changed to white for better visibility
              zIndex: 2, // Ensure text is above the overlay
              fontSize: { lg: '30px', md: '20px', sm: '16px' },
            }}
          >
            {props.title}
          </Typography>
          <Box sx={{
            paddingTop: "15px",

          }}>
            <Box sx={{
              display: "flex",
              alignItems: "top",
              paddingTop: "10px"
            }}>
              <img src={Check} style={{ height: "36px", width: "36px" }} alt="" />
              <Typography
                sx={{
                  fontFamily: 'Mona-Sans',
                  fontWeight: 400,
                  color: '#4B5563', // Changed to white for better visibility
                  zIndex: 2, // Ensure text is above the overlay
                  fontSize: { lg: '20px', md: '18px', sm: '14px' },
                  paddingTop: "8px"
                }}
              >
                {props.details1}
              </Typography>
            </Box>

            <Box sx={{
              display: "flex",
              alignItems: "top",
              paddingTop: "10px"
            }}>
              <img src={Check} style={{ height: "36px", width: "36px" }} alt="" />
              <Typography
                sx={{
                  fontFamily: 'Mona-Sans',
                  fontWeight: 400,
                  color: '#4B5563', // Changed to white for better visibility
                  zIndex: 2, // Ensure text is above the overlay
                  fontSize: { lg: '20px', md: '18px', sm: '14px' },
                  paddingTop: "8px"
                }}
              >
                {props.details2}
              </Typography>
            </Box>

            <Box sx={{
              display: "flex",
              alignItems: "top",
              paddingTop: "10px"
            }}>
              <img src={Check} style={{ height: "36px", width: "36px" }} alt="" />
              <Typography
                sx={{
                  fontFamily: 'Mona-Sans',
                  fontWeight: 400,
                  color: '#4B5563', // Changed to white for better visibility
                  zIndex: 2, // Ensure text is above the overlay
                  fontSize: { lg: '20px', md: '18px', sm: '14px' },
                  paddingTop: "8px"
                }}
              >
                {props.details3}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          maxWidth:{lg: "350px" ,md:"330px", sm:"300px"},
        }}>
          <img src={props.HeroCardImg} alt="card" style={{ maxWidth: "100%"}} />
        </Box>
      </Box>

    // </Box>
  )
}

export default HeroCards
