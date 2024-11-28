import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import DashTabs from './DashTabs';
import {
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Legend,
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../Shared/shared';

const Chart = () => {
  const hotelId =useSelector((state) => state?.HotelData?.hotelData?.data?.hotel?.id ? state?.HotelData?.hotelData?.data?.hotel?.id : state?.Auth?.user?.user?.hotel?.id);
  const dispatch = useDispatch();
  const { period } = useParams();
  console.log("period",period)
  const [selectedPeriod, setSelectedPeriod] = useState(period ? period : 'today');
  const [opacity, setOpacity] = useState({
    bookings: 1,
    revenue: 1,
    occupancy: 1,
  });
  const [chartData, setChartData] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenuePercentage, setTotalRevenuePercentage] = useState('0');
  const [occupancyAmount, setOccupancyAmount] = useState(0);

  const handleLegendClick = (e) => {
    const isAnyDimmed = Object.values(opacity).some((value) => value === 0.3);
    const isCurrentFull = opacity[e.dataKey] === 1;

    const newOpacity = isAnyDimmed
      ? { bookings: 1, revenue: 1, occupancy: 1 }
      : {
        bookings: 0.3,
        revenue: 0.3,
        occupancy: 0.3,
        [e.dataKey]: isCurrentFull ? 1 : 0.3,
      };

    setOpacity(newOpacity);
  };

  useEffect(() => {
    setSelectedPeriod(period);
    // Fetch data from API
    const fetchData = async () => {
      try {
          const response = await axios.post(`${apiUrl}/owner/dashboard`, {
          hotelId: hotelId ,
          period: selectedPeriod ,
        });
        if (response.data.success) {
          const { chartData, totalBookings, totalRevenuePercentage, occupancyAmount } = response.data.data;

          setChartData(chartData);
          setTotalBookings(totalBookings);
          setTotalRevenuePercentage(totalRevenuePercentage);
          setOccupancyAmount(occupancyAmount);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, [period, selectedPeriod,hotelId]);

  return (
    <Box sx={{ padding: '40px', width: '100%' }}>
      <Box sx={{ marginBottom: '50px' }}>
        <DashTabs totalBookings={totalBookings} totalRevenuePercentage={totalRevenuePercentage} selectedPeriod={selectedPeriod}/>
      </Box>

      <Box sx={{ backgroundColor: '#ffffff' }}>
        <Box sx={{ padding: '30px 40px 20px 40px' }}>
          <Typography variant="p" align="left" sx={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
            Bookings Overview
          </Typography>
        </Box>

        {/* Stats Section */}
        <Grid container sx={{ marginTop: '30px', marginBottom: '70px' }}>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                textAlign: 'center',
                border: '1px dashed #ddd',
                padding: '20px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '14px', color: '#000' }}>
                {totalBookings}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#888' }}>
                Number Of Total Bookings
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                textAlign: 'center',
                border: '1px dashed #ddd',
                padding: '20px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '14px', color: '#000' }}>
                {totalRevenuePercentage}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#888' }}>
                Total Revenue
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                textAlign: 'center',
                border: '1px dashed #ddd',
                padding: '20px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '14px', color: '#000' }}>
                ₹{occupancyAmount}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#888' }}>
                Total Commission
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Chart Section */}
        {totalBookings && totalBookings!=0 ?
        (
          <>
            <ResponsiveContainer width="100%" height={400} padding="40px">
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F9EAE9" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F9EAE9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Legend onClick={handleLegendClick} />
            <Bar dataKey="bookings" fill="#CE7778" name="Number of total bookings" opacity={opacity.bookings} />
            <Bar dataKey="occupancy" fill="#C42A25" name="Occupancy rate" opacity={opacity.occupancy} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#ffca28"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="Revenue"
              opacity={opacity.revenue}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#ffca28"
              strokeWidth={2}
              dot={{ stroke: '#ffca28', strokeWidth: 2 }}
              name="Revenue"
              opacity={opacity.revenue}
            />
          </ComposedChart>
        </ResponsiveContainer>
          </>
        ):(
          <>
            <h1 className='text-center'>No Data Available</h1>
          </>
        )
        }
        
      </Box>
    </Box>
  );
};

export default Chart;
