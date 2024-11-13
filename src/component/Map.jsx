import React, { useState, useCallback } from 'react'
import { GoogleMap, Marker, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api'
import { Box, Button, Modal, Typography } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'

const containerStyle = {
    width: '100%',
    height: '400px',
}

const center = {
    lat: 28.6139,
    lng: 77.209,
}

const libraries = ['places']

export default function MapComponent({ selectedLocation, setSelectedLocation, setAddress, address ,clearErrors}) {
    const [modalOpen, setModalOpen] = useState(false)
    const [searchBox, setSearchBox] = useState(null)
    const [tempLocation, setTempLocation] = useState(null) // Temporary location
    const [tempAddress, setTempAddress] = useState('') // Temporary address
    const [error, setError] = useState('') // Validation error state

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyCJ6NqGpAz3uhAC9XB7MaNrkQmS0EV1Mzo',
        libraries,
    })

    const onLoad = useCallback((ref) => setSearchBox(ref), [])

    const onPlacesChanged = () => {
        if (searchBox) {
            const places = searchBox.getPlaces()
            if (places && places.length > 0) {
                const place = places[0]
                const newLocation = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                }
                setTempLocation(newLocation) // Set temporary location when search result is selected
                setTempAddress(place.formatted_address) // Set temporary address
                setError('') // Clear error on valid selection
            }
        }
    }

    const handleSelectLocation = (event) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        setTempLocation({ lat, lng }) // Update temp location on manual click
        getAddressFromCoordinates(lat, lng)
        setError('') // Clear error on manual selection
    }

    const getAddressFromCoordinates = (lat, lng) => {
        const geocoder = new window.google.maps.Geocoder()
        const location = { lat, lng }

        geocoder.geocode({ location }, (results, status) => {
            if (status === 'OK' && results[0]) {
                setTempAddress(results[0].formatted_address)
            } else {
                console.error('Geocoder failed due to: ', status)
            }
        })
    }

    const openMapModal = () => setModalOpen(true)
    const closeMapModal = () => setModalOpen(false)

    const handleOkClick = () => {
        if (tempLocation) {
            setSelectedLocation(tempLocation) // Set the final location when OK is clicked
            setAddress(tempAddress)
            clearErrors('selectedLocation')
            closeMapModal()
        } else {
            setError('Please select a location.') // Show error if no location is selected
        }
    }

    return (
        <Box>
            <Box sx={{ marginTop: 3 }}>
                <Button
                    fullWidth
                    startIcon={<LocationOnIcon sx={{ color: 'red' }} />}
                    onClick={openMapModal}
                    sx={{
                        p: 1,
                        backgroundColor: '#F1F5F9',
                        color: '#000',
                        border: '1px solid #CBD5E1',
                    }}
                >
                    {selectedLocation ? address : 'Add Hotel Location'}
                </Button>

                <Modal open={modalOpen} onClose={closeMapModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxWidth: '600px',
                            bgcolor: 'white',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: '8px',
                        }}
                    >
                        {isLoaded && (
                            <>
                                <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
                                    <input
                                        type="text"
                                        placeholder="Press enter for search location"
                                        style={{
                                            boxSizing: 'border-box',
                                            border: '1px solid transparent',
                                            width: '100%',
                                            height: '40px',
                                            padding: '0 12px',
                                            borderRadius: '3px',
                                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                                            fontSize: '14px',
                                            outline: 'none',
                                            textOverflow: 'ellipses',
                                            marginBottom: '8px',
                                        }}
                                    />
                                </StandaloneSearchBox>
                                {error && (
                                    <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
                                        {error}
                                    </Typography>
                                )}
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={tempLocation || selectedLocation || center}
                                    zoom={10}
                                    onClick={handleSelectLocation} // Allows manual selection on map click
                                >
                                    {tempLocation && <Marker position={tempLocation} />}
                                </GoogleMap>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                                    <Button variant="outlined" onClick={closeMapModal} sx={{ marginRight: 1 }}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" onClick={handleOkClick}>
                                        OK
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                </Modal>
            </Box>
        </Box>
    )
}
