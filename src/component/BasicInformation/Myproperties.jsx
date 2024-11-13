import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Grid, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import basicbg from "../../Assests/basicbg.png"; // Ensure this path is correct
import search from '../../Assests/search.png';
import path from '../../Assests/path.png';
import BasicInformationNav from "./BasicInformationNav";
import { useSelector } from "react-redux";
import { apiUrl } from "../../Shared/shared";
import toast from "react-hot-toast";
import axios from "axios";
import { FaLaptopHouse } from "react-icons/fa";

// Sample property data
const sampleProperties = [
    { id: 1, hotelName: "Oxford Hotel" },
    { id: 2, hotelName: "Marriott Hotel" },
    { id: 3, hotelName: "Hilton Residency" },
    { id: 4, hotelName: "Grand Palace" },
    { id: 5, hotelName: "Beach Resort" },
];

function MyProperties({ setFrom }) {
    const navigate = useNavigate()
    const hotelName = useSelector((state) => state?.HotelData?.hotelData?.data?.hotel?.hotelName ? state?.HotelData?.hotelData?.data?.hotel?.hotelName : state?.Auth?.user?.user?.hotel?.hotelName);

    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [filteredProperties, setFilteredProperties] = useState(sampleProperties); // State for filtered list
    const registrationStatus = localStorage.getItem("registrationStatus") === "true"

    const [isInProgress, setIsInProgress] = useState(registrationStatus);
    const [isPendingApproval, setIsPendingApproval] = useState("");
    useEffect(() => {
        fetchprofile()
    }, [])
    const fetchprofile = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Authentication token not found. Please log in again.");
            return;
        }

        // Set the request headers with the OAuth token
        const config = {
            headers: {
                "oauth-token": token, // Send the token with the oauth-token key in headers
                "Content-Type": "application/json", // Ensure correct content-type header for JSON data
            },
        };
        const user = await axios.get(`${apiUrl}/owner/profile`, config);
        setIsInProgress(user?.data?.data?.hasSubscribed)
        setIsPendingApproval(user?.data?.data?.user?.hotel?.is_approved)
    }
    // Handle search input change
    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase(); // Convert input to lowercase
        setSearchQuery(query);

        // Filter properties based on the search query
        const filtered = sampleProperties.filter((property) =>
            property.hotelName.toLowerCase().includes(query)
        );
        setFilteredProperties(filtered);
    };
    const handleclick = async () => {
        const registrationstate = await localStorage.getItem("registrationstate")
        if(parseInt(registrationstate)===6)
        {
            navigate("/dashboard/Chart/today");
        }
        else{
            setFrom(parseInt(registrationstate))

        }

    }
    return (
        <>
            <BasicInformationNav />

            <Box
                sx={{
                    padding: { xs: "0px", md: "20px 80px" },
                    backgroundColor: "#F1F1F1",
                }}
            >
                <Box
                    sx={{
                        paddingY: { xs: "20px", md: "40px" },
                        borderRadius: "10px",
                        backgroundColor: "#ffffff",
                    }}
                >
                    <Box
                        sx={{
                            backgroundImage: `url(${basicbg})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            borderRadius: "30px",
                            paddingY: "15px",
                            marginX: { xs: "20px", md: "40px" },
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: { xs: "24px", md: "34px" },
                                fontWeight: 700,
                                color: "#FFFFFF",
                            }}
                        >
                            Discover WELRM
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: "16px", md: "24px" },
                                textAlign: "center",
                                fontWeight: 400,
                                color: "#FFFFFF",
                                fontStyle: "italic",
                            }}
                        >
                            Join WELRM and enhance your hotel's visibility. Let's get your
                            property ready for bookings!
                        </Typography>
                    </Box>

                    {/* Basic Information Section */}
                    <Box sx={{ px: 5, py: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    sx={{ fontSize: "36px", fontWeight: 600, color: "#000" }}
                                >
                                    My Properties
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ position: "relative", width: "100%" }}>
                                    <img
                                        src={search}
                                        alt="search"
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            position: "absolute",
                                            top: "50%",
                                            left: "10px",
                                            transform: "translateY(-50%)",
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        type="text"
                                        placeholder="Search by Name"
                                        value={searchQuery} // Controlled input
                                        onChange={handleSearchChange} // Update search input
                                        InputProps={{
                                            disableUnderline: true,
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root fieldset": {
                                                border: "none",
                                            },
                                            paddingLeft: "40px",
                                            border: "1px solid #7d7d7d",
                                            borderRadius: "30px",
                                        }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ borderTop: "1px solid #7d7d7d", px: { xs: 0, sm: 2, md: 5, lg: 5 }, py: 3 }}>
                        <Typography sx={{ fontSize: '22px', fontWeight: '500px', color: '#000', pb: 2 }}>Hotel Listing</Typography>
                        <Box sx={{ bgcolor: '#E2E9F0', borderRadius: '20px', }}>
                            <Grid container spacing={2}
                                sx={{
                                    display: 'flex',
                                    justifyContent: { xs: 'center', sm: 'center', md: 'space-between', lg: 'space-between', },
                                    alignItems: 'center',
                                    padding: '8px 16px',
                                    width: '100%',
                                    margin: 'auto',
                                    gap: '16px', // Adds spacing between buttons
                                    borderBottom: '1px solid white'
                                }}
                            >
                                {/* First Toggle Button */}
                                <Grid sx={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                    <Button
                                        onClick={() => setIsInProgress(registrationStatus)}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            border: ` 1px solid ${isInProgress===false ? '#C42A25' : '#27AE60'}`,
                                            borderRadius: '20px',
                                            padding: '0px',
                                            color: "#7d7d7d",
                                            textTransform: 'none',
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '14px', fontWeight: 500, marginX: '8px', }}>
                                            Registration Status
                                        </Typography>
                                        <Box
                                            sx={{
                                                bgcolor: isInProgress===false ? '#C42A25' : '#27AE60',
                                                color: '#fff',
                                                borderRadius: '15px',
                                                padding: '2px 8px',
                                            }}
                                        >
                                            {isInProgress===false ? 'IN PROGRESS' : 'COMPLETE'}
                                        </Box>
                                    </Button>
                                </Grid>
                                {/* Second Toggle Button */}
                                <Grid sx={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                    <Button
                                        onClick={() => setIsPendingApproval(isPendingApproval)}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            border: ` 1px solid ${isPendingApproval==="Unapproved" ? '#FFC107' : '#27AE60'}`,
                                            borderRadius: '20px',
                                            padding: '0px',
                                            color: "#7d7d7d",
                                            textTransform: 'none',
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '14px', fontWeight: 500, marginX: '8px' }}>
                                            Pending Approvals
                                        </Typography>
                                        <Box
                                            sx={{
                                                bgcolor: isPendingApproval==="Unapproved" ? '#FFC107' : '#27AE60',
                                                color: '#fff',
                                                borderRadius: '15px',
                                                padding: '2px 8px',
                                            }}
                                        >
                                            {isPendingApproval==="Unapproved" ? 'PENDING' : 'COMPLETE'}
                                        </Box>
                                    </Button>
                                </Grid>
                            </Grid>
                            <Box sx={{ px: 2, py: 3 }}>
                                {/* {filteredProperties.length > 0 ? (
                                    filteredProperties.map((property) => (
                                        <>
                                            <Grid container spacing={2}
                                                key={property.id}
                                                sx={{
                                                    marginY: 2,
                                                    padding: 2,
                                                    // border: "1px solid #ddd",
                                                    borderRadius: "10px",
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Grid sx={{xs:12,sm:6,md:6,lg:6}}>
                                                    <Typography sx={{ color: "#7d7d7d", fontSize: '12px', fontWeight: '500px' }}>Hotelname</Typography>
                                                    <Typography sx={{ fontSize: "22px", fontWeight: 600 }}>
                                                        <b>{property.hotelName}</b>
                                                    </Typography>
                                                </Grid>
                                                <Grid sx={{xs:12,sm:6,md:6,lg:6}}>
                                                    <img
                                                        src={path}
                                                        alt="path"
                                                        style={{ width: "450px" }}
                                                    />
                                                </Grid>
                                            </Grid>



                                        </>
                                    ))
                                ) : (
                                    <Typography>No properties found</Typography>
                                )} */}


                                <Grid container spacing={2}
                                    // key={property.id}
                                    sx={{
                                        marginY: 2,
                                        padding: 2,
                                        // border: "1px solid #ddd",
                                        borderRadius: "10px",
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Grid sx={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                                        <Typography sx={{ color: "#7d7d7d", fontSize: '12px', fontWeight: '500px' }}>Hotelname</Typography>
                                        <Typography sx={{ fontSize: "22px", fontWeight: 600 }}>
                                            <b>{hotelName}</b>
                                            {/* <b>{property.hotelName}</b> */}
                                        </Typography>
                                    </Grid>
                                    <Grid sx={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                                        <img
                                            src={path}
                                            alt="path"
                                            style={{ width: "450px" }}
                                        />
                                    </Grid>
                                </Grid>




                            </Box>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "20px",
                            marginRight: "40px",
                            gap: 2,
                        }}
                    >
                        {/* <Link to="/"> */}
                        <Button
                            onClick={handleclick}
                            sx={{
                                fontSize: { xs: "18px", md: "24px" },
                                fontWeight: 600,
                                color: "#FFFFFF",
                                bgcolor: "#C42A25",
                                borderRadius: "10px",
                                padding: { xs: "5px 20px", md: "10px 50px" },
                            }}
                        >
                            Continue
                        </Button>
                        {/* </Link> */}
                    </Box>
                </Box >
            </Box >
        </>
    );
}

export default MyProperties;