import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClientBookings } from "../store/clientSlice";
import { Link } from "react-router-dom";

const HistoryPage = () => {
  const dispatch = useDispatch();
  const { bookings, status, error } = useSelector((state) => state.client);

  useEffect(() => {
    dispatch(fetchClientBookings());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#f5f6fa] text-gray-900 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Booking History</h1>
        <Link to="/dashboard" className="bg-purple-600 px-4 py-2 rounded-md text-white hover:bg-purple-700">
          Back to Dashboard
        </Link>
      </div>

      {status === "loading" && <p>Loading bookings...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">{booking.serviceName}</h2>
            <p className="text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {booking.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
