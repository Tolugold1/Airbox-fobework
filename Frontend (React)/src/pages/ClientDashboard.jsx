import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBusinessServices, bookService } from "../store/clientSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getClientProfile } from "../store/getClientProfile";

const ClientDashboard = () => {
  const dispatch = useDispatch();
  const { services, status, error } = useSelector((state) => state.client);
  const [searchTerm, setSearchTerm] = useState("");

  const { clientProfile  } = useSelector((state) => state.getClientProfile);

  const [showModal, setShowModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    businessId: "",
    clientProfileId: "CLIENT_ID_FROM_AUTH", // Replace with actual user ID from state
    appointmentDate: "",
    status: "scheduled",
    bookedItemId: "",
  });

  useEffect(() => {
    dispatch(fetchBusinessServices());
    // get profile as well
    const getprofile = async () => {
      let profile = await dispatch(getClientProfile());
      if (profile.data.data == null) {
        // redirect to profile page
        toast("Please complete your profile to continue.", {
          position: "top-center",
        });
        window.location.href = "/client-profile";
      }
    }

    getprofile();
  }, [dispatch]);

  const handleBookingClick = (service) => {
    setBookingData({
      ...bookingData,
      businessId: service.businessId,
      bookedItemId: service._id,
      clientProfileId: clientProfile._id,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let resp = await dispatch(bookService(bookingData));
      console.log("Booking response:", resp);
      if (resp.payload) {
        toast.success("Service booked successfully.");
        setShowModal(false);
      }
    } catch (error) {
      toast.error("Failed to book service.");
      // setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] text-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold text-purple-600">Client Dashboard</h2>
        <nav className="mt-6">
          <Link to="/client-dashboard" className="block p-3 rounded-md text-gray-700 hover:bg-gray-200">🏠 Overview</Link>
          <Link to="/client-bookings" className="block p-3 rounded-md text-gray-700 hover:bg-gray-200">📅 My Bookings</Link>
          <Link to="/client-profile" className="block p-3 rounded-md text-gray-700 hover:bg-gray-200">👤 Profile</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <input
            type="text"
            placeholder="Search for services..."
            className="p-2 border border-gray-300 rounded-md w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Featured Booking Service */}
        <div className="mt-6 bg-purple-600 text-white p-6 rounded-lg flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Featured Service</h2>
            <p>Get the best services near you.</p>
          </div>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-md">Book Now</button>
        </div>

        {/* Services List */}
        <h2 className="mt-6 text-lg font-semibold">Available Services</h2>
        {status === "loading" && <p>Loading services...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {services
            ?.filter((service) =>
              service.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((service) => (
              <div key={service._id} className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
                <p className="mt-2"><strong>Price:</strong> ${service.pricing}</p>
                <p><strong>Location:</strong> {service.location}</p>

                <button
                  onClick={() => handleBookingClick(service)}
                  className="mt-4 bg-purple-600 w-full py-2 rounded-md text-white hover:bg-purple-700"
                >
                  Book Now
                </button>
              </div>
            ))}
        </div>
      </div>
      <ToastContainer />

      {/* Booking Form Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Book Service</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="businessId" value={bookingData.businessId} />
              <input type="hidden" name="bookedItemId" value={bookingData.bookedItemId} />

              <label className="block text-gray-700">Booking Status:</label>
              <select
                name="status"
                value={bookingData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="scheduled">Scheduled</option>
                <option value="closed">Closed</option>
              </select>

              <label className="block text-gray-700">Appointment Date:</label>
              <input
                type="date"
                name="appointmentDate"
                className="w-full p-2 border border-gray-300 rounded"
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="w-full bg-purple-600 py-2 rounded-md text-white hover:bg-purple-700"
              >
                Confirm Booking
              </button>
            </form>
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-2 bg-gray-500 py-2 rounded-md text-white hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
