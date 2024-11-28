import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Dash1 from '../../Assests/Dash1.png'; // Import image 1
import Dash2 from '../../Assests/Dash2.png'; // Import image 2

// DashTabs Component
const DashTabs = ({ title, value, description, trendPercentage, trendPositive, image, backgroundColor }) => {
  return (
    <Box
      sx={{
        padding: { xs: '12px', sm: '16px 22px' },
        borderRadius: '10px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Left Section with Icon */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: 50,
            height: 50,
            backgroundColor: backgroundColor,
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '10px',
          }}
        >
          <img src={image} alt="Icon" style={{ width: '30px', height: '30px' }} />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ color: '#888', lineHeight: '12.57px', fontWeight: '500', fontSize: { xs: '12px', sm: '13px' }, paddingBottom: '5px' }}>
            {title}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: '#888', fontSize: { xs: '12px', sm: '14px' } }}>
            {description}
          </Typography>
        </Box>
      </Box>

      {/* Right Section for Trend */}
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h5" sx={{ textAlign: 'right', color: '#333', fontWeight: '550', fontSize: { xs: '20px', sm: '22px' }, paddingBottom: '5px' }}>
          {value}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: trendPositive ? '#4caf50' : '#f44336',
            backgroundColor: trendPositive ? '#E6F7F5' : '#FDEFEC',
            borderRadius: '25px',
            padding: '0px 8px',
          }}
        >
          {trendPositive ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          <Typography variant="subtitle2" sx={{ fontSize: { xs: '10px', sm: '12px' }, fontWeight: 'bold' }}>
            {trendPercentage}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// StatsOverview Component
const StatsOverview = ({ totalBookings, totalRevenuePercentage,selectedPeriod}) => {
  return (
    <Grid container spacing={3}>
      {/* First Card: New Bookings */}
      <Grid item xs={12} sm={6} md={6}>
        <DashTabs
          title="NEW BOOKINGS"
          value={totalBookings}
          description="New Booking Requests"
          image={Dash1} // Image for the first card
          trendPercentage={3.58} // Assuming trendPercentage is a fixed value or coming from props/state
          trendPositive={true}
          backgroundColor="#FEF2DF"
        />
      </Grid>

      {/* Second Card: Revenue */}
      <Grid item xs={12} sm={6} md={6}>
        <DashTabs
          title="REVENUE"
          value={totalRevenuePercentage}
          description={`Total Revenue ${selectedPeriod && selectedPeriod==="today" ? "Today" : selectedPeriod==="yesterday" ? "Yesterday" :selectedPeriod==="this_week" ? "this Week" :"Last 4 Weeks"}`}
          image={Dash2} // Image for the second card
          trendPercentage={5.02} // Assuming trendPercentage is a fixed value or coming from props/state
          trendPositive={false}
          backgroundColor="#DDE0EA"
        />
      </Grid>
    </Grid>
  );
};

export default StatsOverview;
