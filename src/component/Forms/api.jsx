import React from 'react';
import axios from 'axios';

const HotelRegistration = () => {
    const sendHotelData = async () => {
        const hotelData = {
            hotelName: "Test 23",
            address: "schem No.77 MG Road Indore 452001",
            pinCode: "452001",
            lat: 23.00,
            log: 24.00,
            mobile: "8109488610",
            fullName: "swapnil patils",
            countryCode: 91,
            email: "swapnil@gmail.com",
            userType: "owner",
            isdCode: "07325",
            telephone: "2452365",
            propertyType: "this is test",
            landmark: ["sss", "rrrar"],
        };

        try {
            const response = await axios.post('API_ENDPOINT_HERE', hotelData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2>Register Your Hotel</h2>
            <button onClick={sendHotelData}>Submit</button>
        </div>
    );
};

export default HotelRegistration;
