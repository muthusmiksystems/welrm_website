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
import qr from "../../Assests/qr-code.png";
import picture from "../../Assests/picture.png";
import SideImg from "../../Assests/side.png";
import toast from "react-hot-toast";
import { HotelData } from "../../API/Hotel";
import { useDispatch, useSelector } from "react-redux";
// import BasicInformation from "./BasicInformationNav";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { apiUrl } from "../../Shared/shared";
import MapComponent from "../Map";
import QrScanner from "qr-scanner";
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
const HotelProfile = () => {
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

        // qrCode: yup
        //     .mixed()
        //     .required("QR Code is required")
        //     .test("qrCodeValue", "QR code value cannot be empty", (value) => {
        //         return qrCodeValue && qrCodeValue.trim() !== ""; // Check that qrCodeValue is not empty
        //     }),
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
    const [uploadeimages, setUploadeimages] = useState([]);
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
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const reorderedImages = reorder(images, result.source.index, result.destination.index);
        setImages(reorderedImages);
    };
    useEffect(() => {
        console.log('qrCodeValue', qrCodeValue)
    }, [qrCodeValue])
    const onLoad = useCallback((ref) => setSearchBox(ref), [])
    const maxImages = 10;
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page
    };
    // React Hook Form setup
    const {
        control,
        handleSubmit,
        reset,
        setValue, clearErrors,
        formState: { errors },
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
    // Handle image uploads
    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setImages((prevImages) => [...prevImages, reader.result]);
    //             setUploadeimages((prevImages) => [...prevImages, reader.result]);
    //         };
    //         reader.readAsDataURL(file);
    //         // handleImageUpload()
    //     }
    // };
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > maxImages) {
            toast.error(`You can upload up to ${maxImages} images.`);
            return;
        }

        const newImages = [];
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newImages.push(reader.result);
                // Update both images and uploadedImageURLs state upon loading
                setImages(prevState => [...prevState, reader.result]);
                setUploadeimages(prevState => [...prevState, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    // Remove selected image

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
    async function getMainData() {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;
        const hotelid = user?.hotel?.id;
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Authentication token not found. Please log in again.");
            return;
        }

        const config = {
            headers: {
                "oauth-token": token,
                "Content-Type": "application/json",
            },
        };
        const response = await axios.get(`${apiUrl}/customer/hotel/${hotelid}?userId=${userId}`, config); // Replace 'API_ENDPOINT' with actual URL

        if (response.data.success) {
            const hotelData = response?.data?.data?.rows[0];
            console.log(hotelData)
            const avgRating = hotelData?.avgRating; // e.g., 3, meaning "3 star"

            // Reset form values with fetched data
            reset({
                hotelName: hotelData?.hotelName || '',
                fullName: hotelData?.user?.fullName || '',
                propertyType: hotelData?.propertyType || propertyTypes[0],
                hotelRates: avgRating ? hotelRates[avgRating - 1] : hotelRates[0],
                email: hotelData?.user?.email || '',
                stdCode: hotelData?.isdCode || '',
                landlineNumber: hotelData?.telephone || '',
            });
            let landmarks = [];
            // Set the tags from the landmark data
            try {
                landmarks = hotelData?.landmark ? JSON.parse(hotelData?.landmark) : [];
                // Ensure it's an array after parsing
                if (!Array.isArray(landmarks)) {
                    landmarks = [];
                }
            } catch (error) {
                // Handle the error gracefully if the landmark is not a valid JSON string
                console.error("Error parsing landmark field:", error);
                landmarks = [];
            }

            // Set tags
            setTags(landmarks);

            // Set the selected location and address
            setSelectedLocation({ lat: hotelData?.lat, lng: hotelData?.log });
            setAddress(hotelData?.address || '');
            setQrCodeValue(hotelData?.qrCode || '');
            setQrImage(hotelData?.qrCode ? qr : '')
            const coverImage = hotelData?.images.find(image => image.type === 'cover');
            const otherImages = hotelData?.images.filter(image => image.type !== 'cover');

            // Reassemble the array with the cover image at the start, followed by the other images
            const updatedImages = coverImage ? [coverImage, ...otherImages] : otherImages;

            setImages(updatedImages);


            // setImages(
            //     hotelData.data?.data?.rows[0]?.map(hotel => 
            //       hotel?.hotelRooms?.map(room => room?.imageUrls).flat()
            //     ).flat() || []
            //   );
        }
    }
    useEffect(() => {

        getMainData();

    }, [reset]);

    // Handle form submission
    const onSubmit = async (data) => {
        if (qrCodeValue == "") {
            toast.error("please add valid qr")
            return;
        }
        // Ensure that images is properly defined if you intend to send it
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;
        const hotelid = user?.hotel?.id;
        // const images = data.images || []; // Adjust this depending on your form input for images
        // Prepare the payload for submission
        console.log("dtaaa", data)
        const payload = {
            hotelName: data?.hotelName,
            fullName: data?.fullName,
            address: address,
            propertyType: data?.propertyType,
            email: data?.email,
            isdCode: data?.stdCode,
            avgRating: data?.hotelRates.split(' ')[0],
            telephone: data?.landlineNumber,
            images: uploadeimages?.map((item, index) => {
                if (!item.hasOwnProperty('oldObj')) {
                    const isCoverImage = item === images[0]
                    return {
                        base64Img: item, // Assuming `completeData` holds the base64 string
                        size: 11586, // Assuming size is available
                        originalName: "test.png", // Assuming the original name is available
                        type: isCoverImage ? 'cover' : 'post' // First image as cover, the rest as post
                    };
                }
                return null; // Return null for old objects if needed
            }).filter(Boolean), // Filter out any null values from old images
            lat: selectedLocation?.lat,
            log: selectedLocation?.lng,
            mobile: usermobile,
            landmark: tags,
            qrCode: qrCodeValue
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
            const response = await axios.put(`${apiUrl}/hotel/mupdate`, payload, config); // Replace 'API_ENDPOINT' with actual URL
            // const response = await axios.put('https://api.welrm.com/api/hotel/', payload, config); // Replace 'API_ENDPOINT' with actual URL
            HotelData()
            if (uploadeimages.length == 0) {
                const response = await axios.put(`${apiUrl}/hotel/img/${hotelid}/${images[0]?.id}`, config);
            }
            setUploadeimages([])
            dispatch(HotelData(response.data))
            // Log the API response
            getMainData();
            setLoading(false);
            // Show success toast notification
            toast.success("Hotel information submitted successfully!");

            // Navigate to the next form step if successful
            // setFrom(6);
        } catch (error) {
            // Log error details for debugging
            console.error("Error:", error.response ? error.response.data : error.message);
            setLoading(false);
            // Show error toast notification
            toast.error("Submission failed. Please try again.");
        }
    };
    // const handleRemoveImage = (index) => {
    //     const updatedImages = images.filter((_, i) => i !== index);
    //     const updatedUploadedImages = uploadeimages.filter((_, i) => i !== index);

    //     setImages(updatedImages);
    //     setUploadeimages(updatedUploadedImages);
    // };

    const handleRemoveImage = async (index) => {
        // Assuming `index` is the base64 image string and not the position (integer).
        if (!index?.id) {

            // Find the correct index using the base64 string
            const imgIndex = images.findIndex((img) => img === index);
            const uploadimgIndex = uploadeimages.findIndex((img) => img === index);
            if (uploadimgIndex !== -1) {
                // Remove the image based on the found index
                // setImages(images.filter((_, i) => i !== imgIndex));
                setUploadeimages(uploadeimages.filter((_, i) => i !== uploadimgIndex));
            } else {
                console.error('Image not found');
            }
            if (imgIndex !== -1) {
                // Remove the image based on the found index
                setImages(images.filter((_, i) => i !== imgIndex));
                // setUploadeimages(uploadeimages.filter((_, i) => i !== uploadimgIndex));
            } else {
                console.error('Image not found');
            }
            return;
        }

        setImages(images.filter((_, i) => i !== index.id));
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?.id;
            const hotelid = user?.hotel?.id;
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authentication token not found. Please log in again.");
                return;
            }

            const config = {
                headers: {
                    "oauth-token": token,
                    "Content-Type": "application/json",
                },
            };
            const response = await axios.delete(`${apiUrl}/hotel/img/${hotelid}/${index.id}`, config); // Replace 'API_ENDPOINT' with actual URL

            getMainData()
        } catch (error) {
            console.error("Upload failed:", error.response ? error.response.data : error.message);
            toast.error("Image delete failed!");
        }
    };
    return (
        <div>
            {/* <BasicInformation /> */}
            <Box
                sx={{
                    padding: { xs: "0px 0px", sm: "0px 0px", md: "20px  80px", lg: "20px  80px" },
                    backgroundColor: "#F1F1F1",
                }}>

                <Box
                    sx={{
                        padding: { xs: "20px", md: "40px" },
                        borderRadius: "10px",
                        backgroundColor: "#ffffff",
                    }}>


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
                                                {propertyTypes?.map((type, index) => (
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

                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={6} lg={6} container spacing={1}>
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
                                        <Typography sx={{ fontSize: "22px", fontWeight: 500, mb: 1, color: "#000" }}>
                                            <b>Landmark </b>
                                        </Typography>
                                        <Box sx={{
                                            border: '1px solid #D0D5DD', borderRadius: '8px', padding: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px',
                                        }}>
                                            {/* Render existing tags */}
                                            <div style={{ maxHeight: "70px", overflowY: "auto", gap: '8px', padding: '8px' }}>
                                                {tags?.map((tag, index) => (

                                                    <Chip
                                                        key={index}
                                                        label={tag}
                                                        onDelete={() => handleDeleteTag(tag)}
                                                        sx={{ backgroundColor: 'lightgrey', borderRadius: '8px', padding: '4px' }}
                                                        deleteIcon={<CloseIcon fontSize="small" />}
                                                    />

                                                ))}
                                            </div>

                                            {/* Input field to add new tags */}
                                            <TextField
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyPress={handleAddTag}  // Add tag on 'Enter' key press
                                                variant="outlined"
                                                placeholder="Type here"
                                                size="small"
                                                sx={{ flexGrow: 1, minWidth: '150px' }}

                                            />
                                        </Box>
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

                                        <Typography sx={{ fontSize: { xs: "18px", sm: "18px", md: "20px", lg: "22px" }, fontWeight: 500, mt: 5, mb: 1 }}>
                                            Upload Payment QR Code Image (Only 1)
                                        </Typography>
                                        <Box sx={{ paddingX: { xs: "0px", sm: "30px", md: "50px", lg: "60px" } }}>
                                            <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                                                <Controller
                                                    name="qrCode"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <>
                                                            {!qrImage ? (
                                                                <Button
                                                                    component="label"
                                                                    fullWidth
                                                                    startIcon={<img src={qr} alt="qrcode" />}
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
                        <Box sx={{ p: 1 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={12} md={12} lg={12} container spacing={1}>
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
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: "16px", // Space between images
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
                                                onClick={handleGoBack}
                                                variant="contained"
                                                sx={{
                                                    bgcolor: "#D0D5DD",
                                                    color: "#101828",
                                                    borderRadius: "8px",
                                                    padding: "12px 20px",
                                                    marginRight: "40px",
                                                }}
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                onClick={handleSubmit(onSubmit)}
                                                type="submit"
                                                variant="contained"
                                                sx={{
                                                    bgcolor: "#C42A25",
                                                    color: "#fff",
                                                    borderRadius: "8px",
                                                    padding: "12px 20px",

                                                }}
                                            >
                                                Update
                                            </Button>
                                        </Box>
                                    </Grid>

                                </Grid>
                            </Box>

                        </Box>
                    </form>
                </Box>
            </Box>
        </div>
    );
};

export default HotelProfile;
