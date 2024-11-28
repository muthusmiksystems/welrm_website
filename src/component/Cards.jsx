import { Box, Typography } from '@mui/material'
import React from 'react'


function Cards(props) {
  return (
    <Box  sx={{
        height: "300px",
        width: "300px",
        bgcolor: "#FFFFFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        borderRadius: "22px",
        padding: "10px ",
        margin: "10px",

    }}

    >
        <Typography 
        sx={{
            fontSize: "20px",
            fontWeight: "700",

        }}
        >
           {props.cardTitle}
        </Typography>
        <Typography sx={{
            fontSize: "20px",
            fontWeight: "400",
            marginTop: "10px"
        }}
        >
            {props.cardDetail}
        </Typography>
        <img style={{ width: "60%", marginTop: "20px"}} src={props.cardImg} alt="card" />
    </Box>
  )
}

export default Cards