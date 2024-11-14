
import React, { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function BookingDates({ bookingDetails, setcheckin_datenew, setcheckout_datenew }) {
  const [checkinDate, setCheckinDate] = useState(dayjs());
  const [checkoutDate, setCheckoutDate] = useState(dayjs());

  // This effect updates the state whenever bookingDetails changes
  useEffect(() => {
    if (bookingDetails) {
      setCheckinDate(dayjs(bookingDetails.bookingFromDate));
      setCheckoutDate(dayjs(bookingDetails.bookingToDate));
      setcheckin_datenew(dayjs(bookingDetails.bookingFromDate).toDate());
      setcheckout_datenew(dayjs(bookingDetails.bookingToDate).toDate());
    }
  }, [bookingDetails, setcheckin_datenew, setcheckout_datenew]);

  const handleSetCheckIn = (newDate) => {
    setCheckinDate(newDate);
    setcheckin_datenew(newDate ? newDate.toDate() : null);
  };

  const handleSetCheckOut = (newDate) => {
    setCheckoutDate(newDate);
    setcheckout_datenew(newDate ? newDate.toDate() : null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" flexDirection="row" gap={2}>
        <DatePicker
          label="Check In Date"
          value={checkinDate}
          onChange={handleSetCheckIn}

          renderInput={(params) => (
            <Box sx={{ width: "100%" }}>
              {React.cloneElement(params.inputProps, {
                endAdornment: (
                  <IconButton edge="end">
                    <CalendarTodayIcon color="error" />
                  </IconButton>
                ),
              })}
            </Box>
          )}
        />
        <DatePicker
          label="Check Out Date"
          value={checkoutDate}
          onChange={handleSetCheckOut}
          PopperProps={{
            // Adjust the Paper props to control the display style of the calendar
            sx: {
                '& .MuiPaper-root': {
                    width: '100px', // Example width for the calendar
                    maxHeight: '100px', // Example max height for the calendar
                },
            },
        }}

          renderInput={(params) => (
            <Box sx={{ width: "100%" }}>
              {React.cloneElement(params.inputProps, {
                endAdornment: (
                  <IconButton edge="end">
                    <CalendarTodayIcon color="error" />
                  </IconButton>
                ),
              })}
            </Box>
          )}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default BookingDates;
