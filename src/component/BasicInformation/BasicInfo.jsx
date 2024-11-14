import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  MenuItem,
  Grid,
  Chip,
  IconButton, Modal
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from "@mui/icons-material/Refresh";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import basicbg from "../../Assests/basicbg.png"; // Ensure this path is correct
import location from "../../Assests/location.png";
import qrcode from "../../Assests/qr-code.png";
import picture from "../../Assests/picture.png";
import SideImg from "../../Assests/side.png";
import toast from "react-hot-toast";
import { HotelData } from "../../API/Hotel";
import { useDispatch, useSelector } from "react-redux";
import BasicInformation from "./BasicInformationNav";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { apiUrl } from "../../Shared/shared";
import MapComponent from "../Map";
import QrScanner from "qr-scanner";
import { AuthDataStore } from "../../API/auth";
import { useLoader } from "../../Reducers/LoaderProvider";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";


const propertyTypes = ["Choose your property type", "Hotel", "Guest House", "Resort", "Motel"];
const hotelRates = ["3 star", "1 star", "2 star", "4 star", "5 star"];

// Validation schema using Yup



const containerStyle = {
  width: "100%",
  height: "80%",
};

const center = {
  lat: 28.6139, // Default location (New Delhi)
  lng: 77.209,
};
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
const BasicInfo = ({ setFrom }) => {
  const navigate=useNavigate()
  const schema = yup.object().shape({
    hotelName: yup.string().required("Hotel Name is required"),
    fullName: yup.string().required("Owner Name is required"),
    propertyType: yup.string().required("Property Type is required")
      .notOneOf(["Choose your property type"], "Please select a valid property type"),
    hotelRates: yup.string().required("Hote Rate is required"),
    email: yup
      .string()
      .email("Must be a valid email")
      .required("Email is required"),
    stdCode: yup
      .string()
      .required("STD Code is required")
      .matches(/^\d{2,4}$/, "STD Code must be between 2 to 4 digits"),
    landlineNumber: yup
      .string()
      .required("Landline Number is required")
      .matches(/^\d{7}$/, "Landline Number must be exactly 7 digits"),
    landmark: yup
      .array()
      .min(1, 'At least one tag is required')
      .test("tags", "At least one Landmark is required", (value) => {
        return tags && tags.length > 0; // Check that qrCodeValue is not empty
      }),

    qrCode: yup
      .mixed()
      .required("QR Code is required")
      .test("qrCodeValue", "QR code value cannot be empty", (value) => {
        return qrCodeValue && qrCodeValue.trim() !== ""; // Check that qrCodeValue is not empty
      }),
    selectedLocation: yup
      .object()
      .nullable()
      .test('address', 'Address cannot be empty', (value) => {
        // Ensure that the address is not null or empty when the selectedLocation is provided
        return address && address.trim() !== '';
      }),
    images: yup.array()
      .test("images", "At least one Image is required", (value) => {
        return images && images.length > 0; // Check that qrCodeValue is not empty
      }),
  });
  const { setLoading } = useLoader();
  const usermobile = useSelector((state) => state.SaveNumber.mobile);
  const [showFloatingBar, setShowFloatingBar] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [images, setImages] = useState([]);
  const [searchBox, setSearchBox] = useState(null)
  const [tags, setTags] = useState([]);  // To store added tags
  const [inputValue, setInputValue] = useState('');  // To track the current input

  const [qrImage, setQrImage] = useState(null);
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState();
  const [uploadedImageURLs, setUploadedImageURLs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [scanner, setScanner] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCJ6NqGpAz3uhAC9XB7MaNrkQmS0EV1Mzo", // Replace with your API key
    libraries: ['places'],
  });
  const onLoad = useCallback((ref) => setSearchBox(ref), [])
  const maxImages = 10;
  const dispatch = useDispatch()
  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue, clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces()
      if (places && places.length > 0) {
        const place = places[0]
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }
        setSelectedLocation(newLocation)
        setAddress(place.formatted_address)
      }
    }
  }
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const reorderedImages = reorder(images, result.source.index, result.destination.index);
    setImages(reorderedImages);
  };
  // Handle image uploads
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prevImages) => [...prevImages, reader.result]);
        clearErrors('images')
      };
      reader.readAsDataURL(file);
      // handleImageUpload()
    }
  };
  // Remove selected image
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };
  const handleAddTag = (event) => {
    if (event.key === 'Enter' && inputValue.trim() && inputValue.length >= 2) {
      setTags([...tags, inputValue]);
      setInputValue('');  // Clear the input field
      event.preventDefault();
      clearErrors('landmark')
    }
  };

  // Function to handle removing a tag
  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setQrImage(imageUrl);

      // Read QR code from image
      readQRCode(imageUrl);
    }
  };
  const readQRCode = async (file) => {
    try {
      const result = await QrScanner.scanImage(file);

      setQrCodeValue(result);
      clearErrors('qrCode')
      // Set the decoded text as the QR code value
    } catch (error) {
      toast.error('Qr value Empty')
      console.error('QR code decoding error:', error);
    }
  };
  const handleRemove = () => {
    setQrImage(null);
    setQrCodeValue('');
    setValue("qrCode", null);
  };
  const getAddressFromCoordinates = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder()
    const location = { lat, lng }

    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address)
      } else {
        console.error('Geocoder failed due to: ', status)
      }
    })
  }
  const handleSelectLocation = (event) => {
    const lat = event.latLng.lat()
    const lng = event.latLng.lng()
    setSelectedLocation({ lat, lng })
    getAddressFromCoordinates(lat, lng)
  }
  const openMapModal = () => {
    setModalOpen(true);
  };

  const closeMapModal = () => {
    setModalOpen(false);
  };
  useEffect(() => {
    const handleScroll = () => {
      // Get the Y offset of the element that determines where the bar should disappear
      const scrollThreshold = document.getElementById('thresholdSection').offsetTop;

      // Hide the bar if scrolled past the threshold
      setShowFloatingBar(window.scrollY + window.innerHeight < scrollThreshold);
    };
    localStorage.setItem("registrationStatus", false)
    localStorage.setItem("registrationstate", 1)
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Handle form submission
  const onSubmit = async (data) => {
    // Ensure that images is properly defined if you intend to send it
    // const images = data.images || []; // Adjust this depending on your form input for images

    // Prepare the payload for submission
    const payload = {
      hotelName: data.hotelName,
      fullName: data.fullName,
      address: address,
      propertyType: data.propertyType,
      email: data.email,
      isdCode: data.stdCode,
      telephone: data.landlineNumber,
      images: images?.map((item, index) => {
        if (!item.hasOwnProperty('oldObj')) {
          // const isCoverImage = item === images[0]
          return {
            base64Img: item, // Assuming `completeData` holds the base64 string
            size: 11586, // Assuming size is available
            originalName: "test.png", // Assuming the original name is available
            type: index == 0 ? 'cover' : 'post' // First image as cover, the rest as post
          };
        }
        return null; // Return null for old objects if needed
      }).filter(Boolean), // Attach images correctly
      lat: selectedLocation?.lat,
      log: selectedLocation?.lng,
      mobile: usermobile,
      landmark: tags,
      qrCode: qrCodeValue,
      avgRating:data?.hotelRates.split(' ')[0]
    };
    try {
      setLoading(true);
      // Retrieve token from localStorage
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

      // Send the form data to the API
      const response = await axios.post(`${apiUrl}/hotel/create`, payload, config); // Make sure 'apiUrl' is set to the correct API URL
      // Optional: Uncomment the line below if you need to use a PUT request instead of POST
      // const response = await axios.put('https://api.welrm.com/api/hotel/', payload, config); 

      // Retrieve user data from localStorage
      const useridvalue = await JSON.parse(localStorage.getItem("user"));

      // Get userId from retrieved user data
      const userId = useridvalue?.id;

      // Stop loading state once the request is complete
      setLoading(false);

      // Log response data for debugging

      // Create userdata object with added userId field
      const userdata = {
        ...response.data.data, // Spread the response data into userdata
        id: userId             // Add id property to the userdata
      };
      localStorage.setItem("user", JSON.stringify(userdata));
      // Log userdata for verification
      dispatch(HotelData(response.data))
      // Log the API response
      const user = await axios.get(`${apiUrl}/owner/profile`, config);
      dispatch(AuthDataStore(user.data.data))
      // Show success toast notification
      toast.success("Hotel information submitted successfully!");

      // Navigate to the next form step if successful
      setFrom(2);
    } catch (error) {
      setLoading(false);
      // Log error details for debugging
      console.error("Error:", error.response ? error.response.data : error.message);

      // Show error toast notification
      toast.error("Submission failed. Please try again.");
    }
  };

  const handleImageUpload = async () => {
    const formData = new FormData();

    images.forEach((image, index) => {
      formData.append('image', image); // Make sure to append the correct file
    });

    try {
      const response = await axios.post(`${apiUrl}/hotel/img`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const url = `http://localhost:5001/img/${response.data.file.filename}`;
      setUploadedImageURLs(prev => [...prev, url]);

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error.response ? error.response.data : error.message);
      toast.error("Image upload failed!");
    }
  };
  const handleBack=()=>{
    navigate(-1)
  }
  return (
    <div>
      <BasicInformation />
      <Box
        sx={{
          padding: { xs: "0px 0px", sm: "0px 0px", md: "20px  80px", lg: "20px  80px" },
          backgroundColor: "#F1F1F1",
          position: "relative",
        }}>
        <Box sx={{ display: { xs: "none", sm: "none", md: "block", lg: "block" } }}>
          <img
            src={SideImg}
            alt="side"
            style={{
              width: "47px",
              position: "absolute",
              top: "240px",
              left: "15px",
            }}
          />
        </Box>
        <Box
          sx={{
            padding: { xs: "20px", md: "40px" },
            borderRadius: "10px",
            backgroundColor: "#ffffff",
          }}>
          <Box
            sx={{
              backgroundImage: `url(${basicbg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              // height: "150px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              borderRadius: "30px",
              paddingY: "15px"
            }}>
            <Typography
              sx={{
                fontSize: { xs: "24px", md: "34px", lg: "34px" },
                fontWeight: 700,
                color: "#FFFFFF",
              }}>
              Discover WELRM
            </Typography>
            <Typography
              sx={{
                fontSize: {
                  xs: "16px",
                  md: "24px",
                  lg: "24px",
                  margin: "0px 20px",
                  textAlign: "center",
                },
                fontWeight: 400,
                color: "#FFFFFF",
                fontStyle: "italic"
              }}>
              Join WELRM and enhance your hotel's visibility. Let's get your
              property ready for bookings!
            </Typography>
          </Box>

          {/* Basic Information Section */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "22px", fontWeight: 600, color: "#000" }}>
                Basic Information
              </Typography>
              <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#4B5563", mb: 2 }}>
                Let's Get Started with Your Hotel's Basic Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: "16px", fontWeight: 500, mb: 1 }}>
                    Hotel Name
                  </Typography>
                  <Controller
                    name="hotelName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter hotel  name"
                        error={!!errors.hotelName}
                        helperText={errors.hotelName?.message}
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: "16px", fontWeight: 500, mb: 1 }}>
                    Owner Name
                  </Typography>
                  <Controller
                    name="fullName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter hotel owner name"
                        error={!!errors.fullName}
                        helperText={errors.fullName?.message}
                        {...field}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: "16px", fontWeight: 500, mb: 1 }}>
                    Select Property Type
                  </Typography>
                  <Controller
                    name="propertyType"
                    control={control}
                    defaultValue={propertyTypes[0]}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        select
                        variant="outlined"
                        error={!!errors.propertyType}
                        helperText={errors.propertyType?.message}
                        {...field}
                        sx={{
                          "& .MuiSelect-select": {
                            color: field.value === propertyTypes[0] ? "#9e9e9e" : "#000",
                          },
                        }}
                      >
                        {propertyTypes.map((type, index) => (
                          <MenuItem key={type} value={type} sx={{ color: index === 0 ? "#9e9e9e" : "#000", }}>
                            {type}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: "16px", fontWeight: 500, mb: 1 }}>
                    Property Rating
                  </Typography>
                  <Controller
                    name="hotelRates"
                    control={control}
                    defaultValue={hotelRates[0]}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        select
                        variant="outlined"
                        error={!!errors.hotelRates}
                        helperText={errors.hotelRates?.message}
                        {...field}
                        sx={{
                          "& .MuiSelect-select": {
                            color: field.value === hotelRates[0] ? "#9e9e9e" : "#000",
                          },
                        }}
                      >
                        {hotelRates.map((type, index) => (
                          <MenuItem key={type} value={type} sx={{ color: index === 0 ? "#9e9e9e" : "#000", }}>
                            {type}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

              </Grid>
            </Box>

            {/* STD Code, Landline Number, and Hotel Location */}
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={6} container spacing={2}>
                  <Grid item xs={12} sm={12} md={6} lg={4}>
                    <Typography sx={{ fontSize: "16px", fontWeight: 500, mb: 1 }}>
                      STD Code *
                    </Typography>
                    <Controller
                      name="stdCode"

                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Type 2 to 4 digits code"
                          error={!!errors.stdCode}
                          inputProps={{ maxLength: 4 }}
                          helperText={errors.stdCode?.message}
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={8}>
                    <Typography sx={{ fontSize: "16px", fontWeight: 500, mb: 1 }}>
                      Landline Number *
                    </Typography>
                    <Controller
                      name="landlineNumber"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Type landline number"
                          error={!!errors.landlineNumber}
                          inputProps={{ maxLength: 7 }}
                          helperText={errors.landlineNumber?.message}
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography sx={{ fontSize: '22px', fontWeight: 500, mb: 1, color: '#000' }}>
                      <b>Landmark</b>
                    </Typography>
                    <Box
                      sx={{
                        border: '1px solid #D0D5DD',
                        borderRadius: '8px',
                        padding: '8px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      {/* Render existing tags */}
                      <div style={{ maxHeight: '70px', overflowY: 'auto', gap: '8px', padding: '8px' }}>
                        {tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            onDelete={() => handleDeleteTag(tag)}
                            sx={{ backgroundColor: 'lightgrey', borderRadius: '8px', padding: '4px' }}
                            deleteIcon={<CloseIcon fontSize="small" />}
                          />
                        ))}
                      </div>

                      <TextField
                        fullWidth
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => handleAddTag(e)} // Add tag on 'Enter' key press
                        variant="outlined"
                        placeholder="Type here"
                        size="small"
                        sx={{ flexGrow: 1, minWidth: '150px' }}
                      />
                    </Box>

                    {/* Display validation errors for tags */}
                    {errors.landmark && (
                      <Typography color="error" variant="body2" >
                        {errors.landmark.message}
                      </Typography>
                    )}
                  </Grid>


                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Grid item xs={12} sm={12}>
                    <Typography sx={{ fontSize: "16px", fontWeight: 500, mb: 1 }}>
                      Email
                    </Typography>
                    <Controller
                      name="email"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          type="email"
                          variant="outlined"
                          placeholder="Enter email address"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>

                    <Typography sx={{ fontSize: { xs: "18px", sm: "18px", md: "20px", lg: "22px" }, fontWeight: 500, mt:5,mb: 1 }}>
                      Upload Payment QR Code Image (Only 1)
                    </Typography>
                    <Box sx={{ paddingX: { xs: "0px", sm: "30px", md: "50px", lg: "60px" } }}>

                      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                        <Controller
                          name="qrCode"
                          control={control}
                          render={({ field }) => (
                            <>
                              {!qrImage ? (
                                <Button
                                  component="label"
                                  fullWidth
                                  startIcon={<img src={qrcode} alt="qrcode" />}
                                  sx={{
                                    p: 1,
                                    backgroundColor: '#F1F5F9',
                                    color: '#000',
                                    // marginBottom: '20px',
                                    border: '1px solid #CBD5E1',
                                  }}
                                >
                                  Upload QR Code
                                  <input
                                    type="file"
                                    hidden
                                    onChange={(e) => {
                                      field.onChange(e.target.files[0]);
                                      handleUpload(e);
                                    }}
                                    accept="image/*"
                                  />
                                </Button>
                              ) : (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    width: '140px',
                                    height: '140px',
                                    margin: 'auto',
                                    borderRadius: '8px',
                                    backgroundColor: '#F1F5F9',
                                    marginBottom: '20px',
                                  }}
                                >
                                  <img
                                    src={qrImage}
                                    alt="QR Code Preview"
                                    style={{ width: '80%', height: '80%', objectFit: 'cover' }}
                                  />
                                  <IconButton
                                    onClick={handleRemove}
                                    sx={{
                                      position: 'absolute',
                                      top: 5,
                                      left: 5,
                                      backgroundColor: 'rgba(255,255,255,0.8)',
                                    }}
                                  >
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    sx={{
                                      position: 'absolute',
                                      top: 5,
                                      right: 5,
                                      backgroundColor: 'rgba(255,255,255,0.8)',
                                    }}
                                  >
                                    <RefreshIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              )}
                              {errors.qrCode && (
                                <Typography color="error" variant="body2">
                                  {errors.qrCode.message}
                                </Typography>
                              )}
                            </>
                          )}
                        />
                      </Box>

                      <Box sx={{ marginTop: 3 }}>
                        <MapComponent selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} setAddress={setAddress} address={address} clearErrors={clearErrors} />
                        {errors.selectedLocation && (
                          <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
                            {errors.selectedLocation.message}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Box>

            {/* Hotel Image Upload Section */}
            <Box sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "22px", fontWeight: 500, mb: 1 }}>
                Add hotel Images <span style={{ fontSize: "16px" }}>(Max 10) </span>
              </Typography>
              <Typography sx={{ fontSize: "16px", fontWeight: 400, mb: 1, fontStyle: "italic", color: "#4B5563" }}>
                The building's exterior, parking space(s), entrance, & any available facilities
              </Typography>

              <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 3
              }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable" >
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              style={{ display: "flex", flexWrap: 'wrap', gap: "10px" }}
                            >
                              {images?.map((image, index) => (
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
                                        onClick={() => handleRemoveImage(index)}
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



                      {images.length < maxImages && (
                        <Button
                          component="label"
                          variant="outlined"
                          sx={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "8px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            color: "#888",
                            padding: "0px",
                            border: "none"
                          }}
                        >
                          <img
                            style={{ width: "100%", height: "100%" }}
                            src={picture}
                            alt="Add Icon"
                          />
                          <input
                            type="file"
                            hidden
                            onChange={handleImageChange}
                            accept="image/*"
                          />
                        </Button>
                      )}
                    </Box>

                    {/* Display validation errors */}
                    {errors.images && (
                      <Typography color="error" variant="body2">
                        {errors.images.message}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Box
                      id="thresholdSection"
                      sx={{
                        marginTop: '50px',
                        display: "flex",
                        justifyContent: "end",
                      }}>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "#D0D5DD",
                          color: "#101828",
                          borderRadius: "8px",
                          padding: "12px 20px",
                          marginRight: "40px",
                        }}
                        onClick={handleBack}>
                        Back
                      </Button>
                      <Button
                        onClick={handleSubmit(onSubmit)}
                        type="submit"
                        variant="contained"
                        // disabled={!isValid}  
                        sx={{
                          // bgcolor: isValid ? "#C42A25" : "#C42A2580",  
                          // color: isValid ? "#fff" : "#C42A25", 
                          bgcolor: "#C42A25",
                          color: "#fff",
                          borderRadius: "8px",
                          padding: "12px 20px",

                        }}
                      >
                        Save and Continue
                      </Button>
                    </Box>
                  </Grid>

                </Grid>
              </Box>

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
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#D0D5DD",
                    color: "#101828",
                    borderRadius: "8px",
                    padding: "12px 20px",
                    marginRight: "40px",
                  }}
                  onClick={handleBack}>
                  Back
                </Button>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  type="submit"
                  variant="contained"
                  // disabled={!isValid}  
                  sx={{
                    // bgcolor: isValid ? "#C42A25" : "#C42A2580",  
                    // color: isValid ? "#fff" : "#C42A25", 
                    bgcolor: "#C42A25",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "12px 20px",

                  }}
                >
                  Save and Continue
                </Button>
                {/* </Box> */}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default BasicInfo;
