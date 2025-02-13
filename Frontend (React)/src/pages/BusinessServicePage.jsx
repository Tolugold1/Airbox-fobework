import React, { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiX } from "react-icons/fi";
import axios from "axios";
import BusinessSideBar from "./businessSideBar";
import {getBusinessBooking} from "../store/getBusinessBookings";
import {getBusinessBookingItem} from "../store/getBusinessBookingItems";
import {createBookingItem} from "../store/createBookingItem";
import { useDispatch, useSelector } from "react-redux";
import { setBusinessBookingItem } from "../store/getBusinessBookingItems";
import api from "../services/api";

const availableDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ServicePage = () => {
  const dispatch = useDispatch();

  const [ showEditModal, setShowEditModal ] = useState(false);
  const [services, setServices] = useState([]); // ✅ Default to an empty array
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Toggle modal
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    slots: "",
    startTime: "",
    endTime: "",
    pricing: "",
    open_days: [],
    location: "",
  });

  let { items, itemsError } = useSelector((state) => state.getBusinessBookingItem);

  let { businessProfile } = useSelector((state) => state.getBusinessProfile);

  // Fetch services from the backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await dispatch(getBusinessBookingItem(businessProfile?._id)); // ✅ Adjust API endpoint if necessary
        console.log("response", response);
        console.log("items", items);
        if (Array.isArray(items)) {
          setServices(items);
        } else {
          console.error("Unexpected API response:", items);
          setServices([]); // ✅ Ensure services is always an array
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        console.log("Error fetching services store:", itemsError);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (items) {
      setServices(items);
    }
  }, [items]);
  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox selection for open days
  const handleDaySelection = (day) => {
    setFormData((prev) => ({
      ...prev,
      open_days: prev.open_days.includes(day)
        ? prev.open_days.filter((d) => d !== day) // Remove if already selected
        : [...prev.open_days, day], // Add if not selected
    }));
  };

  let { createBusinessBookingItem, createBusinessBookingItemError } = useSelector((state) => state.createBookingItem);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      businessId: businessProfile._id,
      name: formData.name,
      description: formData.description,
      type: formData.type || "General",
      slots: Number(formData.slots) || 0,
      availableSlots: {
        startTime: formData.startTime,
        endTime: formData.endTime,
      },
      open_days: formData.open_days || [],
      pricing: Number(formData.pricing),
      location: formData.location || "N/A",
    };

    try {
      const response = await dispatch(createBookingItem(bookingData));
      // save the response into the business booking items state
      dispatch(setBusinessBookingItem(response.payload));
      setServices([...services, response]); // Update UI
      setShowModal(false); // Close modal
      setFormData({
        name: "",
        description: "",
        type: "",
        slots: "",
        startTime: "",
        endTime: "",
        pricing: "",
        open_days: [],
        location: "",
      });
    } catch (err) {
      console.error("Error adding service:", err);
      console.error("Error adding service store:", createBusinessBookingItem);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      _id: formData._id,
      businessId: businessProfile._id,
      name: formData.name,
      description: formData.description,
      type: formData.type || "General",
      slots: Number(formData.slots) || 0,
      availableSlots: {
        startTime: formData.startTime,
        endTime: formData.endTime,
      },
      open_days: formData.open_days || [],
      pricing: Number(formData.pricing),
      location: formData.location || "N/A",
      // bookItem
    };

    try {
      const response = await api.put('/api/booking/update-booking-item', bookingData);
      // save the response into the business booking items state
      console.log("response update", response);
      dispatch(setBusinessBookingItem(response.data.data.businessItems));
      setServices([...services, response]); // Update UI
      setShowEditModal(false); // Close modal
      setFormData({
        name: "",
        description: "",
        type: "",
        slots: "",
        startTime: "",
        endTime: "",
        pricing: "",
        open_days: [],
        location: "",
      });
    } catch (err) {
      console.error("Error adding service:", err);
      console.error("Error adding service store:", createBusinessBookingItem);
    }
  }

  const [ data, setSData ] = useState(null);
  const handleEdit = (service) => {
    console.log("service", service);
    setFormData({
      _id: service._id,
      name: service.name,
      description: service.description,
      type: service.type,
      slots: service.slots,
      startTime: service.availableSlots.startTime,
      endTime: service.availableSlots.endTime,
      pricing: service.pricing,
      location: service.location,
      open_days: service.open_days,
    });
    setShowEditModal(true);
  }

  return (
    <div className="flex min-h-screen bg-gray-100 w-full">

      {/* Main Content */}
      <main className="flex-1 p-6 bg-[#29293f] text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="vsm:text-base text-2xl font-bold">My Services</h1>
          <button className="flex items-center bg-pink-500 px-4 py-2 rounded-lg hover:bg-pink-600"  onClick={() => setShowModal(true)}>
            <FiPlus className="mr-2" /> Add New
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <p className="text-gray-400">Loading services...</p>
        ) : itemsError ? (
          <p className="text-red-400">{itemsError}</p>
        ) : services.length === 0 ? (
          <p className="text-gray-400">No services added yet.</p>
        ) : (
          <div className="vsm:grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((service) => (
              <div key={service._id} className="bg-[#1a1a2e] p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <p className="text-gray-400 text-sm">{service.description}</p>
                <p className="text-gray-300 text-xs mt-1">📌 {service.type || "General"}</p>
                <p className="text-gray-300 text-xs mt-1">📦 {service.slots} Slots</p>
                <p className="text-gray-300 text-xs mt-1">📍 {service.location || "No location"}</p>
                <p className="text-green-400 text-sm mt-1">💲 {service.pricing} USD</p>

                <div className="text-gray-400 text-xs mt-2">
                  ⏰ {service.availableSlots?.startTime} - {service.availableSlots?.endTime}
                </div>

                <p className="text-gray-300 text-xs mt-1">🗓 Open: {service.open_days?.join(", ")}</p>

                <button className="w-full mt-3 flex items-center justify-center bg-gray-700 py-1 rounded-md text-sm hover:bg-gray-600" onClick={() => handleEdit(service)}>
                  <FiEdit2 className="mr-2" /> Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal for Adding Service */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1a1a2e] p-6 rounded-lg shadow-lg w-[80vw] max-w-md max-h-[80vh] overflow-y-auto text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Service</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-400">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="name" placeholder="Service Name" className="w-full p-2 bg-gray-800 text-white rounded" onChange={handleChange} required />
              <input type="text" name="description" placeholder="Description" className="w-full p-2 bg-gray-800 text-white rounded" onChange={handleChange} required />
              <input type="text" name="type" placeholder="Type (e.g., Room, Equipment)" className="w-full p-2 bg-gray-800 text-white rounded" onChange={handleChange} />
              <input type="number" name="slots" placeholder="Slots" className="w-full p-2 bg-gray-800 text-white rounded" onChange={handleChange} required />
              <input type="time" name="startTime" className="w-full p-2 bg-gray-800 text-white rounded" onChange={handleChange} required />
              <input type="time" name="endTime" className="w-full p-2 bg-gray-800 text-white rounded" onChange={handleChange} required />
              <input type="number" name="pricing" placeholder="Price in USD" className="w-full p-2 bg-gray-800 text-white rounded" onChange={handleChange} required />
              <input type="text" name="location" placeholder="Location" className="w-full p-2 bg-gray-800 text-white rounded" onChange={handleChange} />
              {/* Open Days Selection */}
              <div className="flex flex-wrap gap-2">
                {availableDays.map((day) => (
                  <label key={day} className="text-sm flex items-center gap-2 bg-gray-700 p-2 rounded">
                    <input type="checkbox" checked={formData.open_days.includes(day)} onChange={() => handleDaySelection(day)} />
                    {day}
                  </label>
                ))}
              </div>
              <button type="submit" className="w-full bg-pink-500 py-2 rounded-lg hover:bg-pink-600">Add Service</button>
            </form>
          </div>
        </div>
      )}

`     {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1a1a2e] p-6 rounded-lg shadow-lg w-[80vw] max-w-md max-h-[80vh] overflow-y-auto text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Service</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-red-400">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <input type="text" name="name" placeholder="Service Name" className="w-full p-2 bg-gray-800 text-white rounded" onChange={handleChange} value={formData.name} required />
              <textarea type="text" row="8" name="description" placeholder="Description" className="w-full p-2 bg-gray-800 text-white rounded" onChange={handleChange}  value={formData.description}  required />
              <input type="text" name="type" placeholder="Type (e.g., Room, Equipment)" className="w-full p-2 bg-gray-800 text-white rounded" onChange={handleChange} value={formData.type}  />
              <input type="number" name="slots" placeholder="Slots" className="w-full p-2 bg-gray-800 text-white rounded" onChange={handleChange} required  value={formData.slots}  />
              <input type="time" name="startTime" className="w-full p-2 bg-gray-800 text-white rounded" onChange={handleChange} required  value={formData.startTime}  />
              <input type="time" name="endTime" className="w-full p-2 bg-gray-800 text-white rounded" onChange={handleChange} required  value={formData.endTime}  />
              <input type="number" name="pricing" placeholder="Price in USD" className="w-full p-2 bg-gray-800 text-white rounded" onChange={handleChange} value={formData.pricing}  required />
              <input type="text" name="location" placeholder="Location" value={formData.location} className="w-full p-2 bg-gray-800 text-white rounded" onChange={handleChange} />
              {/* Open Days Selection */}
              <div className="flex flex-wrap gap-2">
                {availableDays.map((day) => (
                  <label key={day} className="text-sm flex items-center gap-2 bg-gray-700 p-2 rounded">
                    <input type="checkbox" checked={formData.open_days.includes(day)} onChange={() => handleDaySelection(day)} />
                    {day}
                  </label>
                ))}
              </div>
              <button type="submit" className="w-full bg-pink-500 py-2 rounded-lg hover:bg-pink-600">Add Service</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePage;
