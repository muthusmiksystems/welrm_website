import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Input,
  MenuItem,
  Grid,
  IconButton,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  FormControlLabel,
  DialogActions,
} from "@mui/material";
import { CiDiscount1 } from "react-icons/ci";
import RemoveIcon from "@mui/icons-material/Remove";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import CachedIcon from '@mui/icons-material/Cached';

import BasicInformation from "./BasicInformationNav";

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";

// Images
import picture from "../../Assests/picture.png";
import anities from "../../Assests/anities.png";
import side2 from "../../Assests/side2.png";
import axios from "axios";
import toast from "react-hot-toast";
import { apiUrl } from "../../Shared/shared";
import { Amenities } from "../../API/Hotel";
import dayjs from "dayjs";
import { useLoader } from "../../Reducers/LoaderProvider";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { TimePicker } from "@mui/x-date-pickers";
import { CheckBox } from "@mui/icons-material";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";

const propertyTypes = ["Deluxe Double Room", "Family Suit Room", "Superior King Room", "Standard Room"];
const discount = ["10", "20", "30", "40", "50"];

const validationSchema = yup.object().shape({
  roomName: yup
    .string()
    .required("Please select a valid room name"),
  roomDescription: yup.string().required("Room Description is required")
    .min(1, "At least 1 character must be available")
    .max(255, "Description only upto 255 characters allowed"),
  availableRooms: yup
    .number()
    .required("Available rooms are required")
    .min(1, "At least 1 room must be available"),
  guestCapacity: yup
    .number()
    .required("Guest capacity is required")
    .min(1, "Guest capacity must be at least 1"),
  roomPrice: yup
    .number()
    .required("Room price is required")
    .min(1, "Room price must be a positive value"),
  discount: yup.string().required("Discount is required"),
  breakfastOn: yup.boolean(),
  breakFastPrice: yup.number(),
  breakfastOff: yup.boolean().test(
    'oneOfRequired',
    'You must select either "Included" or "Not Included"',
    function (value) {
      return (this.parent.breakfastOn || value) && !(this.parent.breakfastOn && value);
    }
  ),
  Threeday: yup.boolean(),
  images: yup.array().of(yup.mixed()).max(3, "You can upload a maximum of 3 images"),
  startDate: yup.date().required("Start Date is required"),
  endDate: yup.date().required("End Date is required"),
  discountPrice: yup
    .number()
    .required("Room price is required"),
  checkIn: yup.date()
    .required("Check-in time is required"),
  checkOut: yup.date()
    .required("Check-out time is required"),

  // .min(1, "breakFast price must be a positive value"),
});



const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
function RoomDetails({ setFrom }) {
  const navigate=useNavigate()
  const { setLoading } = useLoader();
  const [roomName, setroomName] = useState('')
  const [refund,setRefund]=useState('oneDay')
  const [showFloatingBar, setShowFloatingBar] = useState(true);
  const [images, setImages] = useState([]);
  const hotelId = useSelector((state) => state?.HotelData?.hotelData?.data?.hotel?.id ? state?.HotelData?.hotelData?.data?.hotel?.id : state?.Auth?.user?.user?.hotel?.id);
  const [option, setOption] = useState([])
  const [otherRoomNameVisible, setOtherRoomNameVisible] = useState(false);
  const [otherroomvalue, setOtherroomvalue] = useState('');
  const [afterDiscountPrice, setAfterDiscountPrice] = useState(0)
  // const user = JSON.parse(localStorage.getItem("user"));
  // const userId = user?.id;

  const { register, handleSubmit, watch, reset, control, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      discountPrice: 0,
      roomPrice:0,
      checkIn:moment("12:00 AM", "hh:mm A"),
      checkOut:moment("12:00 AM", "hh:mm A"),
      // breakFastPrice:0

    },
  });
  const roomPrice = watch('roomPrice')
  const selectedDiscount = watch('discount')
  const handleOther = () => {
    setOtherRoomNameVisible(true)
    setOtherroomvalue('')
  }
  const handleRoomselection = (data) => {
    setOtherroomvalue(data)
    handleOtherRoomNameSubmit(data)
  }
  useEffect(() => {
    if (roomPrice && selectedDiscount) {
      const price = parseFloat(roomPrice)
      const discountAmount = price * (selectedDiscount / 100)
      setAfterDiscountPrice(price - discountAmount)
    } else {
      setAfterDiscountPrice(0)
    }
  }, [roomPrice, selectedDiscount])
  const handleroomtypeselect = (data) => {
    // setRoomTypeData()
  }
  const handleOtherRoomNameSubmit = async (data) => {
    if(otherroomvalue==='')
    {
      toast.error("Please enter room name")
      return ;
    }
    console.log('data',data)
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
    const payload = {
      hotelId: hotelId,
      name:  otherroomvalue,
      group: 'room_type'

    }
    const response = await axios.post(`${apiUrl}/option/room-type`, payload, config);
    setOtherRoomNameVisible(false)
    getRooms()
  };
  const clearAllAmenities = () => {
    const clearedAmenities = Object.keys(selectedAmenities).reduce((acc, type) => {
      acc[type] = {};  // Set each amenity group to an empty object (no checkboxes checked)
      return acc;
    }, {});
    setSelectedAmenities(clearedAmenities);  // Reset state to cleared amenities
    setSelectedAmenities({})
  };
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const reorderedImages = reorder(images, result.source.index, result.destination.index);
    setImages(reorderedImages);
  };
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = document.getElementById('thresholdSection').offsetTop;
      setShowFloatingBar(window.scrollY + window.innerHeight < scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    localStorage.setItem("registrationStatus", false)
    localStorage.setItem("registrationstate", 2)
    getRooms()

  }, [])
  const getSelectedAmenitiesLength = () => {
    let count = 0;

    // Loop through each category in the object
    for (const category in selectedAmenities) {
      // Loop through each amenity in the category
      for (const amenity in selectedAmenities[category]) {
        // Check if the amenity is selected (true)
        if (selectedAmenities[category][amenity]) {
          count++;
        }
      }
    }

    return count;
  };
  const getRooms = async () => {
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
    const response = await axios.get(`${apiUrl}/option/room_type`, config);
    setOption(response.data.data.options)
  }
  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0] && images.length < 3) {
      const file = e.target.files[0];
      // Convert each file to base64 if needed for API
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleBack = () => {
    // navigate(-1)
    setFrom(1)
  }
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };
  const amenitiesData = useSelector((state) => state?.AmenitiesData?.amenitiesData?.data?.amenities || []);
  const [selectedAmenities, setSelectedAmenities] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("selectedAmenities", selectedAmenities)
  }, [selectedAmenities])
  useEffect(() => {
    dispatch(Amenities());
  }, [dispatch]);

  // Group amenities by type
  const groupedAmenities = amenitiesData.reduce((groups, amenity) => {
    const { type } = amenity;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(amenity);
    return groups;
  }, {});

  // Toggle checkbox for a specific amenity
  const toggleAmenity = (amenityType, amenityName) => {
    setSelectedAmenities((prev) => ({
      ...prev,
      [amenityType]: {
        ...prev[amenityType],
        [amenityName]: !prev[amenityType]?.[amenityName]
      },
    }));
  };
  const [open, setOpen] = useState(false);
  // Validate that at least one amenity is selected per type
  const validateSelection = () => {
    const errors = {};
    Object.keys(groupedAmenities).forEach((type) => {
      const selectedInType = selectedAmenities[type] || {};
      const hasSelection = Object.values(selectedInType).some((isSelected) => isSelected);
      if (!hasSelection) {
        errors[type] = `Please select at least one amenity in the "${type}" category.`;
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const validationSction = () => {
    let isValid = true;

    // Validate amenities
    const selectedAmenitiesCount = Object.values(selectedAmenities).flat().filter(Boolean).length;
    if (selectedAmenitiesCount === 0) {
      toast.error('Please select  amenity');
      isValid = false;
    }
    else if (!validateSelection()) {
      toast.error('Please select only up to 5 amenities');
      isValid = false; // Make sure isValid is set to false
    }
    // Validate images
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      isValid = false;
    }
    
    
    
    // } else if (images.length > 3) {
    //   toast.error('You can upload a maximum of 3 images');
    //   isValid = false;
    // }

    // Check file size and type for each image
    // images.forEach((img, index) => {
    //   const file = img instanceof File ? img : new File([img], `image${index}.jpg`);
    //   if (file.size > 5000000) { // 5MB limit
    //     toast.error(`Image ${index + 1} exceeds the 5MB size limit`);
    //     isValid = false;
    //   }
    //   if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
    //     toast.error(`Image ${index + 1} is not in a supported format (JPEG, PNG, or GIF)`);
    //     isValid = false;
    //   }
    // });

    return isValid;
  };
  const [breakfastAvailable, setBreakfastAvailable] = useState(false);
  const [breakfastPrice, setBreakfastPrice] = useState(0);

  const [selectedOption, setSelectedOption] = useState("breakfastOff"); // Track the selected option

  const handleCheckboxChange = (option) => {

    setSelectedOption(option); // Set the selected option and uncheck the other


    if (option === 'breakfastOff') {
      reset({ breakFastPrice: null }); // Reset the breakfast price if "Not Included" is selected
    }
  };
  const [roomDescription, setRoomDescription] = useState('');
  const maxLength = 255;  // Maximum character count

  // Update room description and character count
  const handleDescriptionChange = (e) => {
    setRoomDescription(e.target.value);
  };
  const watchedRoomDescription = watch("roomDescription");
  useEffect(() => {
    // Whenever 'roomDescription' changes, this will run
    setRoomDescription(watchedRoomDescription);
  }, [watchedRoomDescription]); // Dependency on 'watchedRoomDescription'

  const onSubmit = async (data) => {
    if (validationSction()) {
      try {
        setLoading(true);
        const payload = {
          rooms: [{
            hotelId: hotelId,
            roomTypeId: parseInt(roomName), // Assuming this is an integer ID
            discount: parseFloat(data.discount),
            applyDiscount: 0, // This might be a boolean flag; adjust accordingly
            guestCapacity: parseInt(data.guestCapacity),
            checkIn: moment(data?.checkIn, 'HH:mm:ss').format('hh:mm:ss A') || "09:00:00 am", // Example check-in time, adjust if dynamic
            checkOut: moment(data.checkOut, 'HH:mm:ss').format('hh:mm:ss A') || "10:00:00 am", // Example check-out time, adjust if dynamic
            totalNumOfRooms: parseInt(data.availableRooms),
            roomDescription: data.roomDescription,
            roomAvailabiltyStart: data.startDate, // Ensure these are formatted correctly (e.g., "YYYY-MM-DD")
            roomAvailabiltyEnd: data.endDate,
            cancellationPolicy: refund, // You might want to collect this data from your form
            breakfast_available: data.breakfastOn || false, // Adjust if you have a form input for this
            breakfast_price: parseFloat(data.breakFastPrice) || 0, // Adjust if needed
            rates: [
              { hours: 1, price: parseFloat(data.roomPrice) },
              { hours: 12, price: parseFloat(data.roomPrice) },
              { hours: 24, price: parseFloat(data.roomPrice) }
            ],
            complementaries: [], // An array of IDs, such as [1, 2]
            // complementaries: selectedAmenities || [], // An array of IDs, such as [1, 2]
            images: images
            // images: images?.map((item, index) => {
            //   if (!item.hasOwnProperty('oldObj')) {
            //     const isCoverImage = item === images[0]
            //     console.log('isCoverImage', isCoverImage)
            //     return {
            //       base64Img: item, // Assuming `completeData` holds the base64 string
            //       size: 11586, // Assuming size is available
            //       originalName: "test.png", // Assuming the original name is available
            //       type: isCoverImage ? 'cover' : 'post' // First image as cover, the rest as post
            //     };
            //   }
            //   return null; // Return null for old objects if needed
            // }).filter(Boolean),
          }],
        };

        Object.keys(selectedAmenities).forEach((type) => {
          const selectedInType = selectedAmenities[type] || {};
          const selectedIds = Object.keys(selectedInType).filter((amenityName) => selectedInType[amenityName]);
          const amenityIds = selectedIds.map((name) => {
            const amenity = amenitiesData.find((amn) => amn.name === name);
            return amenity ? amenity.id : null;
          }).filter(id => id); // filter out null values
          payload.rooms[0].complementaries.push(...amenityIds); // push selected IDs into complementaries
        });

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
        const response = await axios.post(`${apiUrl}/hotel/room`, payload, config);
        // setLoading(false);
        toast.success('Room details submitted successfully!');
        setLoading(false);
        setFrom(3); // Navigate to the next form step
      } catch (error) {
        setLoading(false);
        console.error('Error during submission:', error.response?.data || error.message);
        toast.error('Failed to submit form.');
      }
    }
  };


  const handleSubmitamenities = () => {
    if (validateSelection()) {
      // Proceed with form submission or next steps
      setOpen(false)
    }
  };

  const handleDescription = (value) => {
    //const data=value.length > 255
    if (value.length > 255) {
      toast.error('Room description cannot be more then 255 characters')
    }
  }
  return (
    <>
      <BasicInformation />

      <Box
        sx={{
          padding: { xs: "20px 50x", sm: "20px 80px" },
          backgroundColor: "#F1F1F1",
          position: "relative",
        }}>
        <Box sx={{ display: { xs: "none", sm: "block" }, }}>
          <img
            src={side2}
            alt="side"
            style={{
              width: "47px",
              position: "absolute",
              top: "240px",
              left: "15px",
            }}
          />
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>

          <Box
            sx={{
              // padding: { xs: "20px", md: "40px" },
              borderRadius: "10px",
              backgroundColor: "#ffffff",

            }}>

            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Box sx={{ borderBottom: "1px solid lightgrey", padding: { xs: "20px 20px 10px 20px ", md: "40px 40px 10px 40px" }, }}>
                <Typography sx={{ fontSize: { xs: "18px", sm: "20px", md: "22px" }, fontWeight: 600, color: "#000" }}>
                  Add Room Details & Availability
                </Typography>
                <Typography
                  sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" }, fontWeight: 400, color: "#4B5563", mb: 2 }}>
                  Provide Information About Your Rooms
                </Typography>
              </Box>
              <Box sx={{ padding: { xs: "15px 20px 20px 20px ", md: "30px 40px 20px 40px" }, }}>
                {/* <Typography sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" }, fontWeight: 500, color: "#4B5563", lineHeight: "15.47px" }}>
                  Room Details:
                </Typography> */}

                <Grid container spacing={2}>
                  {/* Room Name */}
                  <Grid item xs={12} md={6} lg={6}>
                    <Typography
                      sx={{
                        fontSize: { xs: "12px", sm: "14px", md: "16px" },
                        fontWeight: 500,
                        color: "#4B5563",
                        lineHeight: "15.47px",
                        marginBottom: "15px",
                        textAlign: { xs: "center", md: "left" }
                      }}
                    >
                      Room Name *
                    </Typography>
                    <Select
                      fullWidth
                      variant="outlined"
                      {...register("roomName")}
                      error={!!errors.roomName}
                      value={roomName} // Set this to roomName which should hold the selected id
                      displayEmpty
                      onChange={(event) => {
                        const selectedRoom = option.find((type) => type.id === event.target.value);
                        setroomName(selectedRoom ? selectedRoom.id : ""); // Set the roomName to the id
                      }}
                      renderValue={(selected) => {
                        if (!selected) {
                          return (
                            <Typography sx={{ color: "#9CA3AF", fontSize: { xs: "12px", sm: "14px", md: "16px" } }}>
                              Choose your room name
                            </Typography>
                          );
                        }

                        // Find the name corresponding to the selected id
                        const selectedRoom = option.find((type) => type.name === otherroomvalue);
                        console.log("selectedRoom",selectedRoom)
                        return selectedRoom ? selectedRoom.name : "";
                      }}
                    >
                      {option?.map((type, index) => (
                        <MenuItem key={type.id} value={type.id} sx={{ color: "#000" }} onClick={()=>setOtherroomvalue(type.name)}>
                          {type.name}
                        </MenuItem>
                      ))}

                      {propertyTypes.map((type, index) => {
                        const data = option?.every((item) => item.name !== type);

                        if (data) {
                          return (
                            <MenuItem
                              key={index}
                              value={type}
                              sx={{ color:  "#000" }}
                              onClick={() => handleRoomselection(type)}
                            >
                              {type}
                            </MenuItem>
                          );
                        }
                        return null;
                      })}

                      <MenuItem value="" onClick={handleOther}>
                        <em>Other</em>
                      </MenuItem>
                    </Select>

                    <Typography color="error" variant="body2">
                      {errors.roomName?.message}
                    </Typography>
                    {otherRoomNameVisible && (
                      <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
                        <input
                          style={{ border: '1px solid lightgrey', padding: '20px', width: '100%', borderRadius: '10px' }}
                          fullWidth
                          onChange={(e) => setOtherroomvalue(e.target.value)}
                          variant="outlined"
                          placeholder="Enter room name"

                        />
                        <Button
                          sx={{ marginLeft: 2 }}
                          onClick={handleOtherRoomNameSubmit} // Call the function when clicking the button
                        >
                          Save
                        </Button>
                      </Box>
                    )}
                  </Grid>

                  {/* Available Rooms and Guest Capacity */}
                  <Grid item xs={12} md={6} lg={6}>
                    <Grid container spacing={2}>
                      {/* No. Of Available Rooms */}
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography
                            sx={{
                              fontSize: { xs: "12px", sm: "14px", md: "14px" },
                              fontWeight: 500,
                              color: "#4B5563",
                              lineHeight: "15.47px",
                              marginBottom: "15px",
                              textAlign: { xs: "center", md: "left" }
                            }}
                          >
                            No.Of Available Rooms*
                          </Typography>
                          <Controller
                            name="availableRooms"
                            control={control}
                            render={({ field }) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: { xs: "space-evenly", sm: "space-evenly", md: "space-evenly" },
                                  gap: 2,
                                  fontSize: { xs: "12px", sm: "14px", md: "16px" },
                                  border: "1px solid #94A3B880",
                                  // padding: "0px 40px",
                                  borderRadius: "10px",
                                }}
                              >
                                <Box>
                                  <IconButton
                                    onClick={() =>
                                      field.onChange(Math.max(0, parseInt(field.value || 0) - 1))
                                    }
                                    sx={{ color: "#9CA3AF" }}

                                    aria-label="decrement"
                                  >
                                    <RemoveIcon sx={{ fontSize: { xs: "14px", sm: "14px", md: "16px" } }} />
                                  </IconButton>
                                </Box>
                                <Box sx={{ bgcolor: "#94A3B880", padding: { xs: "14px 10px", sm: "14px 20px" } }}>
                                  <Typography sx={{ fontSize: { xs: "14px", sm: "14px", md: "16px" } }} variant="h6">{field.value || 0}</Typography>
                                </Box>
                                <Box>
                                  <IconButton
                                    onClick={() =>
                                      field.onChange(parseInt(field.value || 0) + 1)
                                    }
                                    sx={{ color: "#9CA3AF" }}
                                    aria-label="increment"
                                  >
                                    <AddIcon sx={{ fontSize: { xs: "14px", sm: "14px", md: "16px" } }} />
                                  </IconButton>
                                </Box>
                              </Box>
                            )}
                          />
                          <Typography color="error" variant="body2">
                            {errors.availableRooms?.message}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* No. Of Guest Capacity */}
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography
                            sx={{
                              fontSize: { xs: "12px", sm: "14px", md: "14px" },
                              fontWeight: 500,
                              color: "#4B5563",
                              lineHeight: "15.47px",
                              marginBottom: "15px",
                            }}
                          >
                            No.Of Guest Capacity*
                          </Typography>
                          <Controller
                            name="guestCapacity"
                            control={control}
                            render={({ field }) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: { xs: "space-evenly", sm: "space-evenly", md: "space-evenly" },
                                  gap: 2,
                                  fontSize: { xs: "12px", sm: "14px", md: "16px" },
                                  border: "1px solid #94A3B880",
                                  // padding: "0px 40px",
                                  borderRadius: "10px",
                                }}
                              >
                                <Box>
                                  <IconButton
                                    onClick={() =>
                                      field.onChange(Math.max(0, parseInt(field.value || 0) - 1))
                                    }
                                    sx={{ color: "#9CA3AF" }}
                                    aria-label="decrement"
                                  >
                                    <RemoveIcon sx={{ fontSize: { xs: "14px", sm: "14px", md: "16px" } }} />
                                  </IconButton>
                                </Box>
                                <Box sx={{ bgcolor: "#94A3B880", padding: { xs: "14px 10px", sm: "14px 20px" } }}>
                                  <Typography sx={{ fontSize: { xs: "14px", sm: "14px", md: "16px" } }} variant="h6">{field.value || 0}</Typography>
                                </Box>
                                <Box>
                                  <IconButton
                                    onClick={() =>
                                      field.onChange(parseInt(field.value || 0) + 1)
                                    }
                                    sx={{ color: "#9CA3AF" }}
                                    aria-label="increment"
                                  >
                                    <AddIcon sx={{ fontSize: { xs: "14px", sm: "14px", md: "16px" } }} />
                                  </IconButton>
                                </Box>
                              </Box>
                            )}
                          />
                          <Typography color="error" variant="body2">
                            {errors.guestCapacity?.message}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>


                <Grid container spacing={2}>
                  {/* Room Description */}
                  <Grid item xs={12} sm={12} md={6}>
                    <Typography
                      sx={{
                        fontSize: { xs: "12px", sm: "14px", md: "16px" },

                        color: "#4B5563",
                        lineHeight: "15.47px",
                        mb: 1,
                        marginTop: "20px",
                      }}>
                      Room Description *
                    </Typography>
                    <Box sx={{ height: "110px" }}>
                      <TextField
                        onChange={(e) => handleDescriptionChange(e.target.value)}
                        // onChange={alert(0)}
                        label="Write room description"

                        fullWidth
                        {...register("roomDescription")}
                        error={!!errors.roomDescription}
                        helperText={errors.roomDescription?.message}
                        variant="outlined"
                        inputProps={{
                          maxLength: maxLength,  // Restrict input to 255 characters
                        }}
                        multiline  // Allows the field to grow and handle multiline text
                        rows={3} // Defines a large initial number of rows, adjust this if needed
                        InputProps={{
                          sx: {
                            height: "100%",            // Makes the TextField fill the Box
                            alignItems: "flex-start",  // Aligns the input text at the top
                            overflow: 'hidden'
                          },
                        }}
                        sx={{
                          height: "100%", // Ensures the TextField container takes full height of the Box
                          fontSize: { xs: "12px", sm: "14px", md: "16px" },
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: roomDescription?.length >= maxLength ? "red" : "gray", // Show red if exceeded
                          textAlign: "right",  // Align text to the right
                          marginTop: "5px",
                        }}
                      >
                        {maxLength - roomDescription?.length} characters remaining
                      </Typography>
                    </Box>

                  </Grid>

                  {/* Basic Room Price */}
                  <Grid item xs={12} sm={12} md={6}>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: { xs: "12px", sm: "14px", md: "16px" },
                          fontWeight: "500",
                          marginTop: "20px",
                          marginLeft: "10px",

                        }}
                      >
                        Basic Room Price *
                      </Typography>

                      <Box
                        sx={{
                          bgcolor: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          borderRadius: "10px",
                          padding: "15px",
                          mt: 1, // margin-top for slight spacing
                        }}
                      >
                        {/* Basic Price */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: { xs: "column", sm: "row" },
                            mb: 2,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: { xs: "12px", sm: "14px", md: "16px" },
                              fontWeight: "600",
                              color: "#4B5563",
                              mb: { xs: 1, sm: 0 },
                            }}
                          >
                            Basic Price
                          </Typography>
                          <Box className="my-input" sx={{ display: "flex", alignItems: "center", width: { xs: "auto", sm: "180px", md: "200px" } }}>
                            <TextField
                              sx={{
                                borderBottom: "1px solid grey",
                                "& .MuiInputBase-input": {
                                  padding: "10px 10px", // Adjust padding to fit the layout
                                  fontSize: { xs: "12px", sm: "14px", md: "14px" },
                                  textAlign: "center", // Center text and placeholder
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  border: "none", // Remove default outline
                                },
                                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                                  border: "none", // Remove outline on hover
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  border: "none", // Remove outline when focused
                                },
                                "& .MuiInputBase-root:after": {
                                  borderBottom: "1px solid #000", // Bottom border when focused
                                },
                                "& fieldset": {
                                  borderRadius: "0px", // Square corners for fieldset
                                },
                              }}
                              placeholder="₹ Add Rate"
                              type="number"
                              defaultValue={0}
                              {...register("roomPrice")}
                              error={!!errors.roomPrice}
                              helperText={errors.roomPrice?.message}
                              fullWidth
                            />

                          </Box>
                        </Box>

                        {/* Discount */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: { xs: "column", sm: "row" },
                            mb: 2,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: { xs: "12px", sm: "14px", md: "16px" },
                              fontWeight: "600",
                              color: "#4B5563",
                              mb: { xs: 1, sm: 0 },
                            }}
                          >
                            Discount
                          </Typography>
                          <Box className="my-input" sx={{ display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid grey", width: { xs: "auto", sm: "180px", md: "200px" } }}>
                            <CiDiscount1 />
                            <TextField
                              select
                              defaultValue={30}
                              fullWidth
                              sx={{

                                "& .MuiInputBase-input": {
                                  padding: "10px 10px", // Adjust padding to fit the layout
                                  fontSize: { xs: "12px", sm: "14px", md: "14px" },
                                  textAlign: "center", // Center text and placeholder
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  border: "none", // Remove default outline
                                },
                                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                                  border: "none", // Remove outline on hover
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  border: "none", // Remove outline when focused
                                },
                                "& .MuiInputBase-root:after": {
                                  borderBottom: "1px solid #000", // Bottom border when focused
                                },
                                "& fieldset": {
                                  borderRadius: "0px", // Square corners for fieldset
                                },
                              }}
                              {...register("discount")}
                              error={!!errors.discount}
                              helperText={errors.discount?.message}
                              variant="outlined"
                            >
                              {discount.map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </TextField>

                          </Box>
                        </Box>

                        {/* After Discount Price */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: { xs: "column", sm: "row" },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: { xs: "12px", sm: "14px", md: "16px" },
                              fontWeight: "600",
                              color: "#4B5563",
                              mb: { xs: 1, sm: 0 },
                            }}
                          >
                            After Discount Price
                          </Typography>
                          <Box className="my-input" sx={{ display: "flex", alignItems: "center", width: { xs: "auto", sm: "180px", md: "200px" } }}>
                            <TextField
                              aria-readonly={true}
                              value={afterDiscountPrice.toFixed(2)}
                              sx={{
                                borderBottom: "1px solid grey",
                                "& .MuiInputBase-input": {
                                  padding: "10px 10px", // Adjust padding to fit the layout
                                  fontSize: { xs: "12px", sm: "14px", md: "14px" },
                                  textAlign: "center", // Center text and placeholder
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  border: "none", // Remove default outline
                                },
                                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                                  border: "none", // Remove outline on hover
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  border: "none", // Remove outline when focused
                                },
                                "& .MuiInputBase-root:after": {
                                  borderBottom: "1px solid #000", // Bottom border when focused
                                },
                                "& fieldset": {
                                  borderRadius: "0px", // Square corners for fieldset
                                },
                              }}
                              placeholder="₹ Add Rate"
                              {...register("discountPrice")}
                              error={!!errors.discountPrice}
                              helperText={errors.discountPrice?.message}
                              fullWidth
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                  </Grid>
                </Grid>


                <Grid container spacing={2}>
                  {/* Start and End Date */}

                  <Grid item xs={12} sm={12} md={6}>
                    <Box sx={{ marginTop: "10px", textAlign: { xs: "center", md: "left" } }}>
                      <Typography
                        sx={{
                          fontSize: { xs: "18px", sm: "20px", md: "22px" },
                          fontWeight: "600",
                        }}>
                        Availability :
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: "12px", sm: "14px", md: "16px" },
                          fontWeight: "400",
                          color: "#6B7280",
                        }}>
                        Please select the start & end dates{" "}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
      {/* Start Date Box */}
      <Box sx={{ flex: 1, flexBasis: { xs: "100%", sm: "45%" }, maxWidth: { xs: "100%", sm: "400px" } }}>
        <Typography sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" }, fontWeight: "500" }}>Start Date *</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]} sx={{ width: "100%" }}>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <Box>
                  <DatePicker
                    {...field}
                    minDate={dayjs()}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                        error={!!errors.startDate}
                      />
                    )}
                  />
                  <Typography color="error" variant="body2" sx={{ marginTop: "5px" }}>
                    {errors.startDate?.message}
                  </Typography>
                </Box>
              )}
            />
          </DemoContainer>
        </LocalizationProvider>
      </Box>

      {/* End Date Box */}
      <Box sx={{ flex: 1, flexBasis: { xs: "100%", sm: "45%" }, maxWidth: { xs: "100%", sm: "400px" } }}>
        <Typography sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" }, fontWeight: "500" }}>End Date *</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]} sx={{ width: "100%" }}>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <Box>
                  <DatePicker
                    {...field}
                    minDate={watch("startDate") ? dayjs(watch("startDate")).add(1, 'day') : dayjs()}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.endDate}
                      />
                    )}
                  />
                  <Typography color="error" variant="body2" sx={{ marginTop: "5px" }}>
                    {errors.endDate?.message}
                  </Typography>
                </Box>
              )}
            />
          </DemoContainer>
        </LocalizationProvider>
      </Box>

      {/* Check-In */}
      <Box sx={{ flex: 1, flexBasis: { xs: "100%", sm: "45%" }, maxWidth: { xs: "100%", sm: "400px" } }}>
        <Typography sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" }, fontWeight: "500" }}>Check-In *</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["TimePicker"]} sx={{ width: "100%" }}>
            <Controller
              name="checkIn"
              control={control}
              render={({ field }) => (
                <Box>
                  <TimePicker
                    {...field}
                    value={moment("12:00 AM", "hh:mm A")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.checkIn}
                      />
                    )}
                  />
                  <Typography color="error" variant="body2" sx={{ marginTop: "5px" }}>
                    {errors.checkIn?.message}
                  </Typography>
                </Box>
              )}
            />
          </DemoContainer>
        </LocalizationProvider>
      </Box>

      {/* Check-Out */}
      <Box sx={{ flex: 1, flexBasis: { xs: "100%", sm: "45%" }, maxWidth: { xs: "100%", sm: "400px" } }}>
        <Typography sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" }, fontWeight: "500" }}>Check-Out *</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["TimePicker"]} sx={{ width: "100%" }}>
            <Controller
              name="checkOut"
              control={control}
              render={({ field }) => (
                <Box>
                  <TimePicker
                    {...field}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.checkOut}
                      />
                    )}
                  />
                  <Typography color="error" variant="body2" sx={{ marginTop: "5px" }}>
                    {errors.checkOut?.message}
                  </Typography>
                </Box>
              )}
            />
          </DemoContainer>
        </LocalizationProvider>
      </Box>
    </Box>
                  </Grid>

                  {/* Cancellation Policy */}
                  <Grid item xs={12} sm={12} md={6}>
                    <Box>
                      <Box
                        sx={{
                          bgcolor: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          borderRadius: "10px",
                          padding: "15px",
                          mt: 5, mb: 5 // margin-top for slight spacing
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: { xs: "column", sm: "row" },
                            mb: 2,
                          }}
                        >
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <Box className="refund_input">

                              <input
                                type="checkbox"
                                checked={selectedOption === 'breakfastOn'} // Ensure only "breakfastOn" is selected
                                onClick={() => handleCheckboxChange('breakfastOn')}
                                // inputProps={{ 'aria-label': 'controlled' }}
                                {...register("breakfastOn")}
                              />
                            </Box>
                            <Typography
                              sx={{
                                fontSize: { xs: "12px", sm: "14px", md: "16px" },
                                fontWeight: "600",
                                color: "#4B5563",
                                mb: { xs: 1, sm: 0 },
                              }}
                            >
                              Breakfast price
                            </Typography>
                          </Box>
                          {
                            selectedOption === 'breakfastOn' && (
                              <Box className="my-input" sx={{ display: "flex", alignItems: "center", width: { xs: "auto", sm: "180px", md: "200px" } }}>
                                <TextField

                                  sx={{
                                    borderBottom: "1px solid grey",
                                    "& .MuiInputBase-input": {
                                      padding: "10px 10px", // Adjust padding to fit the layout
                                      fontSize: { xs: "12px", sm: "14px", md: "14px" },
                                      textAlign: "center", // Center text and placeholder
                                    },
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      border: "none", // Remove default outline
                                    },
                                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                                      border: "none", // Remove outline on hover
                                    },
                                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                      border: "none", // Remove outline when focused
                                    },
                                    "& .MuiInputBase-root:after": {
                                      borderBottom: "1px solid #000", // Bottom border when focused
                                    },
                                    "& fieldset": {
                                      borderRadius: "0px", // Square corners for fieldset
                                    },
                                  }}
                                  defaultValue={0}
                                  placeholder="₹ Add Rate"
                                  {...register("breakFastPrice")}
                                  error={!!errors.breakFastPrice}
                                  helperText={errors.breakFastPrice?.message}
                                  fullWidth
                                />

                              </Box>
                            )
                          }

                        </Box>
                        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                          <Box className="refund_input">
                            <input
                              type="checkbox"
                              checked={selectedOption === 'breakfastOff'} // Ensure only "breakfastOff" is selected
                              onClick={() => handleCheckboxChange('breakfastOff')}
                              // inputProps={{ 'aria-label': 'controlled' }}
                              {...register("breakfastOff")}
                            />
                          </Box>
                          <Typography
                            sx={{
                              fontSize: { xs: "12px", sm: "14px", md: "16px" },
                              fontWeight: "600",
                              color: "#4B5563",
                              mb: { xs: 1, sm: 0 },
                            }}
                          >
                            Not Included
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: { xs: "18px", sm: "20px", md: "22px" },
                          fontWeight: "600",
                          marginBottom: "20px",
                        }}>
                        Cancellation Policy :
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexDirection: { xs: "column", sm: "row" },
                          gap: 2,
                        }}>
                        <Box
                          sx={{
                            border: "1px solid grey",
                            borderRadius: "10px",
                            padding: "10px",
                            flex: 1,
                          }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}>
                            <Box className="refund_input">
                              <input type="checkbox" onClick={()=>setRefund('oneDay')} checked={refund === 'oneDay' ? true :false}   {...register("oneDay")} />
                            </Box>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontWeight: "500",
                                marginLeft: "10px",
                              }}>
                              Full Refund 1 Day Prior
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: "400",
                              color: "#9CA3AF",
                              marginLeft: "30px",
                              marginTop: "5px",
                            }}>
                            Cancel up to 1 day (24 hours) before check-in for a full
                            refund. Later cancellations incur a 100% penalty.
                          </Typography>
                        </Box>

                        {/* Second Policy Box */}
                        <Box
                          sx={{
                            border: "1px solid grey",
                            borderRadius: "10px",
                            padding: "10px",
                            flex: 1,
                          }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}>
                            <Box className="refund2_input">
                              <input type="checkbox" onClick={()=>setRefund('ThreeDay')} checked={refund === 'ThreeDay' ? true :false} {...register("ThreeDay")} />
                            </Box>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontWeight: "500",
                                marginLeft: "10px",
                              }}>
                              3-Day Refund Before Check-In
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: "400",
                              color: "#9CA3AF",
                              marginLeft: "30px",
                              marginTop: "5px",
                            }}>
                            Cancel up to 3 days (72 hours) before check-in for a full
                            refund. 100% penalty for late cancellations.
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ marginTop: "10px" }}>
                  <Grid container spacing={2}>
                    {/* Room Name */}
                    <Grid item xs={12} md={6} lg={6}>
                      <Box sx={{ p: { xs: 2, md: 3 }, justifyContent: "space-between", textAlign: { xs: "center", md: "left" } }}>
                        <Typography
                          sx={{
                            fontSize: { xs: "18px", sm: "20px", md: "22px" },
                            fontWeight: 600,
                            color: "#000",
                          }}>
                          Add Hotel Images:
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: "14px", md: "16px" },
                            fontWeight: 400,
                            color: "#4B5563",
                            mb: 2,
                          }}>
                          The building's exterior, parking space(s), entrance, & any available
                          facilities
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: { xs: "column", md: "row" },
                            gap: { xs: 2, md: 5 },
                          }}>
                          <Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: { xs: "center", sm: "center", md: "flex-start" },
                                flexDirection: "row",
                                gap: 2,
                                flexWrap: "wrap",
                              }}
                            >
                              <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="droppable" >
                                  {(provided) => (
                                    <div
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                      style={{ display: "flex", flexWrap: 'wrap', gap: "10px" }}
                                    >
                                      {images.map((image, index) => (
                                        <Draggable key={index} draggableId={`draggable-${index}`} index={index}>
                                          {(provided, snapshot) => (
                                            <Box
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              sx={{
                                                position: "relative",
                                                width: "100px",
                                                height: "100px",
                                                borderRadius: "8px",
                                                overflow: "hidden",
                                                border: "1px solid #ddd",
                                                opacity: snapshot.isDragging ? 0.7 : 1, // Reduce opacity when dragging
                                              }}
                                            >
                                              <img
                                                src={image?.url ? image?.url : image}
                                                alt={`Preview ${index}`}
                                                style={{
                                                  width: "100%",
                                                  height: "100%",
                                                  objectFit: "cover",
                                                }}
                                              />
                                              {index == 0 && (
                                                <Box
                                                  sx={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    left: 0,
                                                    width: "100%",
                                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                    color: "white",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    padding: "5px 0",
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                    opacity: 0.5,
                                                  }}
                                                >
                                                  Cover
                                                </Box>
                                              )}
                                              <Button
                                                sx={{
                                                  position: "absolute",
                                                  top: 0,
                                                  right: 0,
                                                  padding: "2px",
                                                  minWidth: "unset",
                                                  bgcolor: "rgba(255,255,255,0.8)",
                                                  fontSize: "12px",
                                                }}
                                                onClick={() => handleRemoveImage(image)}
                                              >
                                                X
                                              </Button>
                                            </Box>
                                          )}
                                        </Draggable>
                                      ))}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </DragDropContext>

                              {/* Show Add Image Button only if less than 3 images are uploaded */}
                              {images.length < 3 &&
                                [...Array(3 - images.length)].map((_, index) => (
                                  <label key={index} htmlFor={`upload-photo-${index + images.length}`}>
                                    <Input
                                      id={`upload-photo-${index + images.length}`}
                                      accept="image/*"
                                      type="file"
                                      onChange={handleImageChange}
                                      sx={{ display: "none" }}
                                    />
                                    <Box
                                      sx={{
                                        width: { xs: "80px", md: "100px" },
                                        height: { xs: "80px", md: "100px" },
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <img
                                        src={picture}
                                        alt={`Upload Icon ${index + 1}`}
                                        style={{ width: "100%", height: "100%" }}
                                      />
                                    </Box>
                                  </label>
                                ))}
                            </Box>

                          </Box>

                          {/* Save and Back Buttons Section */}

                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: { xs: "center", md: "flex-end" },
                          width: "100%",
                          flexDirection: "column",
                          gap: 3, // Reduced gap to maintain consistency
                          padding: { xs: 2, md: 0 }, // Added padding for mobile view
                        }}
                      >
                        {/* Amenities Button */}
                        <Button
                          onClick={() => setOpen(true)}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            bgcolor: "#F1F5F9",
                            alignItems: "center",
                            padding: "10px 20px", // Adjusted padding for smaller screens
                            color: "#000",
                            border: "1px solid #CBD5E1",
                            borderRadius: "10px",
                            mb: { xs: 2, md: 3 }, // Margin bottom for mobile view
                            width: { xs: "100%", sm: "auto" }, // Full width on small screens
                          }}
                        >
                          <Box sx={{ mr: 2 }}>
                            <img
                              style={{
                                width: "34px",
                                height: "34px",
                              }}
                              src={anities}
                              alt="Amenities"
                            />
                          </Box>
                          <Typography sx={{ fontSize: { xs: "18px", sm: "20px", md: "22px" }, fontWeight: "500" }}>
                            Include Amenities
                          </Typography>
                          <Typography sx={{ marginLeft: 1, fontSize: { xs: "16px", sm: "18px", md: "20px" } }}>
                            {getSelectedAmenitiesLength() > 0 && `(${getSelectedAmenitiesLength()})`}
                          </Typography>
                        </Button>

                        {/* Buttons */}
                        <Box
                          id="thresholdSection"
                          sx={{
                            display: "flex",
                            justifyContent: { xs: "center", md: "flex-start" },
                            gap: 2,
                            flexDirection: { xs: "column", sm: "row", md: "row" }, // Stack buttons vertically on small screens
                          }}
                        >
                          <Button onClick={handleBack}
                            sx={{
                              fontSize: { xs: "16px", md: "18px" },
                              fontWeight: "600",
                              color: "#475569",
                              bgcolor: "#4755691A",
                              border: "1px solid #0000001A",
                              borderRadius: "10px",
                              padding: { xs: "5px 10px", md: "5px 10px" },
                              width: { xs: "100%", md: "auto" }, // Full width on small screens
                            }}
                          >
                            Back
                          </Button>
                          <Button
                            onClick={handleSubmit(onSubmit)}
                            type="submit"
                            sx={{
                              fontSize: { xs: "18px", md: "18px" },
                              fontWeight: "600",
                              color: "#FFFFFF",
                              bgcolor: "#C42A25",
                              borderRadius: "10px",
                              padding: { xs: "5px 10px", md: "10px 20px" }, // Increased padding for better appearance
                              width: { xs: "100%", md: "auto" }, // Full width on small screens
                            }}
                          >
                            Save & Continue
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="100%" fullWidth>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '24px', fontWeight: 600, borderBottom: '1px solid #9CA3AF' }}>
                <Typography>Add Hotel Amenities ({amenitiesData?.length || '0'})</Typography>
                <CachedIcon onClick={clearAllAmenities} />
              </DialogTitle>
              <DialogContent>
                {Object.entries(groupedAmenities).map(([type, amenities]) => (
                  <Grid container item xs={12} key={type} sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{type}</Typography>
                    <Grid container spacing={2}>
                      {amenities.map((amenity) => (
                        <Grid item xs={3} key={amenity.id}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!selectedAmenities[type]?.[amenity.name]}
                                onChange={() => toggleAmenity(type, amenity.name)}
                              />
                            }
                            label={amenity.name}
                          />
                        </Grid>
                      ))}
                    </Grid>
                    {/* Display validation error message for each category */}
                    {validationErrors[type] && (
                      <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {validationErrors[type]}
                      </Typography>
                    )}
                  </Grid>
                ))}
              </DialogContent>
              <DialogActions sx={{ borderTop: '1px solid #9CA3AF' }}>
                {/* <Button
                  variant="outlined"
                  color="secondary"

                  onClick={clearAllAmenities}  // Call clear function on click
                >
                  Clear All
                </Button> */}
                <Button variant="outlined"
                  color="secondary" onClick={() => setOpen(false)} sx={{ fontWeight: '500' }}>Cancel</Button>
                <Button onClick={handleSubmitamenities} variant="contained" sx={{ bgcolor: '#C42A25', color: '#FFFFFF' }}>
                {getSelectedAmenitiesLength() > 0 && `(${getSelectedAmenitiesLength()})`} Add Amenities
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </form>
        {showFloatingBar && (
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              bgcolor: "#FFFFFF",
              boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
              zIndex: 1000,
              display: 'flex',
              justifyContent: 'center',
              transform: showFloatingBar ? "translateY(0)" : "translateY(100%)",
              transition: "transform 0.3s ease-in-out",

            }}
          >
            <Box
              sx={{
                maxWidth: "1200px",
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                gap: 3
              }}
            >
              <Button
                onClick={handleBack}
                sx={{
                  fontSize: { xs: "16px", md: "18px" },
                  fontWeight: "600",
                  color: "#475569",
                  bgcolor: "#4755691A",
                  border: "1px solid #0000001A",
                  borderRadius: "10px",
                  padding: { xs: "5px 10px", md: "5px 10px" },
                  width: { xs: "48%", sm: "auto" },
                }}
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                type="submit"
                sx={{
                  fontSize: { xs: "18px", md: "18px" },
                  fontWeight: "600",
                  color: "#FFFFFF",
                  bgcolor: "#C42A25",
                  borderRadius: "10px",
                  padding: { xs: "5px 10px", md: "10px 20px" },
                  width: { xs: "48%", sm: "auto" },
                }}
              >
                Save & Continue
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}

export default RoomDetails;
