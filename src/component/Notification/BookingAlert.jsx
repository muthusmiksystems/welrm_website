import React, { useState } from 'react';

function BookingAlert() {
  const [bookingAlert, setBookingAlert] = useState(false);
  const [promotionalAlert, setPromotionalAlert] = useState(false);
  const [reviewAlert, setReviewAlert] = useState(false);

  return (
    <div className="bg-white rounded-xl  shadow-lg w-full mx-auto mx-14 mt-8 font-medium">
      <h2 className="text-2xl font-semibold  mb-6 border-b-2 p-2">Booking Alerts</h2>

      <div className="space-y-4 p-6">
        {/* Booking Notifications */}
        <div className="flex justify-between items-center">
          <li className="text-lg">Booking Notifications:</li>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={bookingAlert}
              onChange={(e) => setBookingAlert(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-primary peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
        </div>

        {/* Promotional Offers */}
        <div className="flex justify-between items-center">
          <li className="text-lg">Promotional Offers:</li>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={promotionalAlert}
              onChange={(e) => setPromotionalAlert(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-primary peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        {/* New Review Alerts */}
        <div className="flex justify-between items-center">
          <li className="text-lg ">New Review Alerts:</li>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={reviewAlert}
              onChange={(e) => setReviewAlert(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-primary peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
        </div>
      </div>
    </div>
  );
}

export default BookingAlert;
