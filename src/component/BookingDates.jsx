// import React, { useEffect, useState } from "react";
// import { Box, IconButton } from "@mui/material";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";
// import moment from "moment";

// function BookingDates({ bookingDetails, setcheckin_datenew, setcheckout_datenew }) {
//   console.log("BookingDateszzzzzzzzz", bookingDetails?.checkin_date,bookingDetails?.checkout_date)//12/11/2024
//   const [checkinDate, setCheckinDate] = useState(
//     bookingDetails?.checkin_date ? moment(bookingDetails.checkin_date, 'DD/MM/YYYY') : null
//   );
//   console.log("BookingDateszzzzzzzzzaaaaaaaaaaaaaa", checkinDate);
//   const [checkoutDate, setCheckoutDate] = useState(
//     bookingDetails?.checkout_date ? moment(bookingDetails.checkout_date, 'DD/MM/YYYY') : null
//   );
//   console.log("BookingDateszzzzzzzzzaaaaaaaaaaaaaabbbbbbbbbbbbbbbb", checkoutDate);
//   useEffect(() => {
//     console.log("checkinDateaaaaaa", checkinDate);
//   }, [checkinDate]);

//   useEffect(() => {
//     console.log("checkoutDatebbbbbbbbbbb", checkoutDate);
//   }, [checkoutDate]);

//   const handleSetCheckIn = (newDate) => {
//     const formattedDate = newDate ? moment(newDate, 'DD/MM/YYYY') : null;
//     setCheckinDate(formattedDate);
//     setcheckin_datenew(formattedDate); // Ensure it's in the required format
//   };

//   const handleSetCheckOut = (newDate) => {
//     const formattedDate1 = newDate ? moment(newDate, 'DD/MM/YYYY') : null;
//     setCheckoutDate(formattedDate1);
//     setcheckout_datenew(formattedDate1); // Ensure it's in the required format
//   };


//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box display="flex" flexDirection="row" gap={2}>
//         <DatePicker
//           label="Check In Date"
//           value={dayjs(checkinDate, "DD/MM/YYYY")}
//           onChange={(newDate) => handleSetCheckIn(dayjs(newDate).format("DD/MM/YYYY"))}
//           format="DD/MM/YYYY" // Custom format for display
//           renderInput={(params) => (
//             <Box sx={{ width: "100%" }}>
//               {React.cloneElement(params.inputProps, {
//                 endAdornment: (
//                   <IconButton edge="end">
//                     <CalendarTodayIcon color="error" />
//                   </IconButton>
//                 ),
//               })}
//             </Box>
//           )}
//         />
//         <DatePicker
//           label="Check Out Date"
//           value={dayjs(checkoutDate, "DD/MM/YYYY")}
//           onChange={(newDate) => handleSetCheckOut(dayjs(newDate).format("DD/MM/YYYY"))}
//           format="DD/MM/YYYY" // Custom format for display
//           renderInput={(params) => (
//             <Box sx={{ width: "100%" }}>
//               {React.cloneElement(params.inputProps, {
//                 endAdornment: (
//                   <IconButton edge="end">
//                     <CalendarTodayIcon color="error" />
//                   </IconButton>
//                 ),
//               })}
//             </Box>
//           )}
//         />
//       </Box>
//     </LocalizationProvider>

//   );
// }

// export default BookingDates;


import React, { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function BookingDates({ bookingDetails, setcheckin_datenew, setcheckout_datenew }) {
  // Initialize checkinDate and checkoutDate with dayjs
  const [checkinDate, setCheckinDate] = useState(
    bookingDetails?.checkin_date ? dayjs(bookingDetails.checkin_date, 'DD/MM/YYYY') : null
  );
  
  const [checkoutDate, setCheckoutDate] = useState(
    bookingDetails?.checkout_date ? dayjs(bookingDetails.checkout_date, 'DD/MM/YYYY') : null
  );

  // Update checkin date state
  const handleSetCheckIn = (newDate) => {
    const formattedDate = newDate ? dayjs(newDate).format('DD/MM/YYYY') : null;
    setCheckinDate(newDate);
    setcheckin_datenew(formattedDate); // Send formatted date back to parent
  };

  // Update checkout date state
  const handleSetCheckOut = (newDate) => {
    const formattedDate = newDate ? dayjs(newDate).format('DD/MM/YYYY') : null;
    setCheckoutDate(newDate);
    setcheckout_datenew(formattedDate); // Send formatted date back to parent
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

