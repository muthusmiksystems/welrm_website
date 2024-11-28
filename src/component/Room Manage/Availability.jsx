import React, { useState } from 'react';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
    Box,
    Typography,
    IconButton,
    Button,
} from '@mui/material';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CustomDatePicker from '../CustomDatePicker';

function Availability() {
    // State variables
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [startTime, setStartTime] = useState(dayjs());
    const [endTime, setEndTime] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const handleSetDate = () => {
        console.log("Selected date:", selectedDate.format('DD MMM YYYY'));
    };
    return (
        <div className='bg-white rounded m-5 p-5 w-full'>
            {/* Header Section */}
            <Box className="flex justify-between items-center border-b w-97 p-4">
                <Typography variant="h5" fontWeight="bold">Set Availability</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1" color="textSecondary" fontWeight="bold">
                        Status:
                    </Typography>
                    <Box display="flex" alignItems="center" color="green">
                        <span className="text-3xl">•</span>
                        <Typography variant="body1" color="green" fontWeight="bold">
                            Available
                        </Typography>
                        <ExpandMoreIcon />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: 'flex' }} flexDirection={{ xs: 'column', md: 'row' }} >
                {/* Form Section */}
                <Box >
                    {/* Start Date */}
                    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} p={4}>
                        <Box flex={1}>
                            <Typography variant="subtitle1" fontWeight="500">Start Date *</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    value={startDate}
                                    onChange={(newDate) => setStartDate(newDate)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            InputProps: {
                                                endAdornment: (
                                                    <IconButton edge="end">
                                                        <CalendarTodayIcon color="error" />
                                                    </IconButton>
                                                ),
                                            },
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>

                        {/* End Date */}
                        <Box flex={1}>
                            <Typography variant="subtitle1" fontWeight="500">End Date *</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    value={endDate}
                                    onChange={(newDate) => setEndDate(newDate)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            InputProps: {
                                                endAdornment: (
                                                    <IconButton edge="end">
                                                        <CalendarTodayIcon color="primary" />
                                                    </IconButton>
                                                ),
                                            },
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} p={4}>
                        {/* Time/From */}
                        <Box flex={1}>
                            <Typography variant="subtitle1" fontWeight="500">Time/From *</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    value={startTime}
                                    onChange={(newTime) => setStartTime(newTime)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            InputProps: {
                                                endAdornment: (
                                                    <IconButton edge="end">
                                                        <AccessTimeIcon />
                                                    </IconButton>
                                                ),
                                            },
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>

                        {/* To Time */}
                        <Box flex={1}>
                            <Typography variant="subtitle1" fontWeight="500">To *</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    value={endTime}
                                    onChange={(newTime) => setEndTime(newTime)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            InputProps: {
                                                endAdornment: (
                                                    <IconButton edge="end">
                                                        <AccessTimeIcon />
                                                    </IconButton>
                                                ),
                                            },
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>
                    </Box>
                </Box>

                {/* Calendar Section */}
                <Box
                    sx={{
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: 3,
                        mt: 3,
                        flex:1,
                        justifyContent:'center',
                        alignItems:'center'
                    }}
                >
                    <Typography variant="subtitle1" fontWeight="600">Select Your Date</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Set availability for your dates
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                        <CustomDatePicker />
                    </div>
                    {/* <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                        {selectedDate.format('DD MMM YYYY')}
                    </Typography> */}
                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        sx={{ mt: 2, borderRadius: '8px' }}
                        onClick={handleSetDate}
                    >
                        Set
                    </Button>
                </Box>
            </Box>
        </div>
    );
}

export default Availability;
