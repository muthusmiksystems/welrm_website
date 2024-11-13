import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Input,
  Button,
  MenuItem,
  Grid,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import basicbg from "../../Assests/basicbg.png"; // Ensure this path is correct
import location from "../../Assests/location.png";
import picture from "../../Assests/picture.png";
import SideImg from "../../Assests/side.png";
import BasicInfo from "./BasicInfo";
import RoomDetails from "./RoomDetails";
import SubscriptionDetails from "./SubscriptionDetails";
import SubscriptionDetails2 from "./subscriptionDetails2";
import ChooseAmenities from "./SelectAmenities";
import MyProperties from "./Myproperties";

const propertyTypes = ["Hotel", "Guest House", "Resort", "Motel"]; // Add more if needed

function BasicInformation() {
  const location = useLocation()
  const registrationStatus = localStorage.getItem("registrationStatus") === 'true'
  const localregistrationstate = parseInt(localStorage.getItem("registrationstate"))
  const registrationstate = location?.state?.registrationstate
  // const [formOne, setFrom] = useState(3);
  const [formOne, setFrom] = useState(parseInt(registrationstate) ? parseInt(registrationstate) : !registrationStatus ? localregistrationstate : 1);
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0] && images.length < 3) {
      setImages([...images, URL.createObjectURL(e.target.files[0])]);
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <>
      {formOne === 1 && <BasicInfo setFrom={setFrom} />}

      {formOne === 2 && <RoomDetails setFrom={setFrom} />}
      {formOne === 3 && <SubscriptionDetails setFrom={setFrom} />}
      {formOne === 4 && <SubscriptionDetails2 setFrom={setFrom} />}
      {formOne === 5 && <ChooseAmenities setFrom={setFrom} />}
      {formOne === 6 && <MyProperties setFrom={setFrom} />}
    </>
  );
}

export default BasicInformation;
