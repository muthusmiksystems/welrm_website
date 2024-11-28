import React, { useState } from 'react';
import { Box, Button, Typography, IconButton, Grid } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import dayjs from 'dayjs';

const CustomDatePicker = () => {
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState(null);

    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const getDaysInMonth = () => {
        const year = currentDate.year();
        const month = currentDate.month();
        const firstDay = dayjs(new Date(year, month, 1)).day();
        const daysInMonth = dayjs(new Date(year, month + 1, 0)).date();

        const daysArray = Array(firstDay).fill(null);
        for (let i = 1; i <= daysInMonth; i++) {
            daysArray.push(i);
        }

        return daysArray;
    };

    const handleMonthChange = (direction) => {
        setCurrentDate(currentDate.add(direction, 'month'));
    };

    const handleDateSelect = (day) => {
        setSelectedDate(dayjs(new Date(currentDate.year(), currentDate.month(), day)));
    };

    const formatDate = (date) => {
        return date ? date.format('DD MMM YYYY') : 'Select a date';
    };

    const daysArray = getDaysInMonth();

    return (
        <Box
            sx={{
                width: 280,
                border: '1px solid #ddd',
                borderRadius: 2,
                p: 2,
                backgroundColor: '#fff',
            }}
        >
            {/* Header with month navigation */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <IconButton onClick={() => handleMonthChange(-1)}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="subtitle1" fontWeight="bold">
                    {currentDate.format('MMMM YYYY')}
                </Typography>
                <IconButton onClick={() => handleMonthChange(1)}>
                    <ArrowForward />
                </IconButton>
            </Box>

            {/* Days of the week */}
            <Grid container spacing={1} justifyContent="space-around" mb={2}>
                {daysOfWeek.map((day, index) => (
                    <Grid item key={day} xs={1.7}>
                        <Typography
                            align="center"
                            fontWeight="bold"
                            color={day === "Tu" || day === "Sa" ? "error" : "text.primary"}
                        >
                            {day}
                        </Typography>
                    </Grid>
                ))}
            </Grid>

            {/* Days in month */}
            <Grid container spacing={0.5}>
                {daysArray.map((day, index) => (
                    <Grid item key={index} xs={1.7}>
                        <Button
                            variant="text"
                            fullWidth
                            onClick={() => day && handleDateSelect(day)}
                            sx={{
                                minWidth: 0,
                                height: 40,
                                borderRadius: '50%',
                                backgroundColor: day === selectedDate?.date() ? 'error.main' : 'transparent',
                                color: day === selectedDate?.date() ? '#fff' : 'text.primary',
                                '&:hover': {
                                    backgroundColor: day ? '#eee' : 'transparent',
                                },
                            }}
                        >
                            {day || ''}
                        </Button>
                    </Grid>
                ))}
            </Grid>

            {/* Footer with selected date display */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Box
                    sx={{
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: '#f9f9f9',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        {formatDate(selectedDate)}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="error"
                    sx={{ borderRadius: 2 }}
                    onClick={() => alert(`Date set to ${formatDate(selectedDate)}`)}
                >
                    Set
                </Button>
            </Box>
        </Box>
    );
};

export default CustomDatePicker;
