import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Grid,
} from "@mui/material";

import BasicInformation from "./BasicInformationNav";
import { useDispatch, useSelector } from "react-redux";
import { Amenities } from "../../API/Hotel";

const ChooseAmenities = ({ setFrom }) => {
  const amenitiesData = useSelector((state) => state?.AmenitiesData?.amenitiesData?.data?.amenities || []);
  const [selectedAmenities, setSelectedAmenities] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const dispatch = useDispatch();

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

  // Handle form submission
  const handleSubmit = () => {
    if (validateSelection()) {
      // Proceed with form submission or next steps
    }
  };

  return (
    <>
      <BasicInformation />
      <Box sx={{ padding: "20px 80px", backgroundColor: "#F1F1F1", position: "relative" }}>
        <Box sx={{ padding: { xs: "20px", md: "40px" }, borderRadius: "10px", backgroundColor: "#ffffff" }}>
          <Box sx={{ p: 3 }}>
            <Typography
              sx={{ fontSize: { xs: "18px", sm: "20px", md: "22px" }, fontWeight: 600, color: "#000", mb: 2 }}>
              Choose the amenities your hotel offers to enhance guest experience
            </Typography>
            <Grid container spacing={2}>
              {/* Render each amenity type with checkboxes */}
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

            </Grid>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row", md: "row" },
                justifyContent: { xs: "center", sm: "center", md: "flex-end" },
                gap: 10,
                mt: 4,
              }}>
              <Button
                onClick={() => setFrom(2)}
                sx={{
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "#475569",
                  bgcolor: "#F1F5F9",
                  borderRadius: "10px",
                  padding: "10px 40px",
                }}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  bgcolor: "#C42A25",
                  borderRadius: "10px",
                  padding: "10px 40px",
                }}
              // disabled={Object.keys(validationErrors).length > 0}
              >
                {Object.values(selectedAmenities).flat().length} Add Amenities
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ChooseAmenities;
