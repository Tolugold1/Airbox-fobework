// src/pages/BusinessDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Link } from 'react-router-dom';
import BusinessSideBar from './businessSideBar';
// ✅ Register Chart.js components
// ✅ Register all required ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

import { getBusinessProfile } from '../store/getBusinessProfile';
import { getBusinessBooking } from '../store/getBusinessBookings';
import { getBusinessAnalytics } from '../store/businessAnalytics';
// import { getBusinessAnalytics } from '../store/';
import { useDispatch, useSelector } from 'react-redux';
import { MdArrowDropDown } from "react-icons/md";

const BusinessDashboard = () => {
  let dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [bookableItems, setBookableItems] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  let { businessProfile, businessProfileError } = useSelector((state) => state.getBusinessProfile);
  const [period, setPeriod] = useState("Daily"); // Default selection
  const [isOpen, setIsOpen] = useState(false); // Dropdown state
  const [ schedule, setSchedule ] = useState(0);
  const [ cancel, setCancel ] = useState(0);
  const [ complete, setComplete ] = useState(0);


  const handleSelect = (value) => {
    setPeriod(value);
    setIsOpen(false); // Close dropdown after selection
  };

  const { analyticsStore } = useSelector((state) => state.getBusinessAnalytics);

  let businessBooking  = useSelector((state) => state.getBusinessBooking);

  useEffect(() => {
    dispatch(getBusinessAnalytics({businessId: businessProfile._id, timeframe: period}));
  }, [period])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const profileResponse = await api.get('/api/business/get-profile');
        const profileResponse = await dispatch(getBusinessProfile())
        setProfile(profileResponse.data);

        // const itemsResponse = await api.get('/api/booking/get-business-bookings');
        const itemsResponse = await dispatch(getBusinessBooking(businessProfile._id));
        console.log("bookableItems", itemsResponse);
        setBookableItems(itemsResponse.data);

        const analyticsResponse = await dispatch(getBusinessAnalytics({businessId: businessProfile._id, timeframe: period}));
        setAnalytics(analyticsResponse.payload.formattedData || analyticsStore);

        setSchedule(analyticsResponse.payload.overallAnalytics.TotalScheduledBooking);

        setCancel(analyticsResponse.payload.overallAnalytics.TotalCancelledBooking);

        setComplete(analyticsResponse.payload.overallAnalytics.TotalCompletedBooking);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  // Handler to add a new bookable item
  const onAddItem = async (data) => {
    try {
      const response = await api.post('/api/booking/create-bookin-item', data);
      setBookableItems([...bookableItems, response.data]);
      reset();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const barChartRef = useRef(null);
  const lineChartRef  = useRef(null);

  // Clean up charts on unmount
  useEffect(() => {
    return () => {
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
    };
  }, []);

  const bookingData = {
    // labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    labels: analytics.map((data) => data.date),
    datasets: [
      {
        label: "Total Bookings",
        backgroundColor: "#2D85DE",
        data: analytics?.map((data) => data.totalBookings), //[80, 90, 30, 60, 50, 100, 70],
      },
      {
        label: "Total Scheduled",
        backgroundColor: "#E74C3C",
        data: analytics?.map((data) => data.scheduledBookings) // [20, 25, 10, 15, 20, 35, 15],
      },
      {
        label: "Total Completed",
        backgroundColor: "#3BAF6F",
        data: analytics?.map((data) => data.completedBookings) // [20, 25, 10, 15, 20, 35, 15],
      },
      {
        label: "Total Cancelled",
        backgroundColor: "#FF9800",
        data: analytics?.map((data) => data.cancelledBookings) // [20, 25, 10, 15, 20, 35, 15],
      },
    ],
  };

  // ✅ Corrected Data for Line Chart
  const lineChartData = {
    labels: analytics.map((data) => data.date),
    datasets: [
      {
        label: "Total Bookings",
        data: analytics.map((data) => data.totalBookings),
        borderColor: "#2D85DE",
        backgroundColor: "rgba(45, 133, 222, 0.2)",
        fill: true,
      },
      {
        label: "Scheduled",
        data: analytics.map((data) => data.scheduledBookings),
        borderColor: "#E74C3C",
        backgroundColor: "rgba(231, 76, 60, 0.2)",
        fill: true,
      },
      {
        label: "Completed",
        data: analytics.map((data) => data.completedBookings),
        borderColor: "#3BAF6F",
        backgroundColor: "rgba(59, 175, 111, 0.2)",
        fill: true,
      },
      {
        label: "Cancelled",
        data: analytics.map((data) => data.cancelledBookings),
        borderColor: "#FF9800",
        backgroundColor: "rgba(255, 152, 0, 0.2)",
        fill: true,
      },
    ],
  };
  const analyticsData = {
    labels: analytics.map((data) => data.date) || ["Confirm", "Pending", "Cancel", "Success"],
    datasets: [
      {
        data: [35, 35, 15, 15],
        backgroundColor: ["#4A90E2", "#FF9800", "#E74C3C", "#2ECC71"],
      },
    ],
  };
   console.log("businessBooking", businessBooking.businessBookings);
   businessBooking = businessBooking.businessBookings;
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className=''>
        <BusinessSideBar />
      </div>

      {/* Main Dashboard */}
      <main className="flex-1 p-6">
        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-white shadow rounded-lg">
            <h3 className="text-gray-500">Scheduled</h3>
            <p className="text-xl font-bold">{schedule}</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <h3 className="text-gray-500">Cancelled</h3>
            <p className="text-xl font-bold">{cancel}</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <h3 className="text-gray-500">Completed</h3>
            <p className="text-xl font-bold">{complete}</p>
          </div>
          <div className="p-4 shadow rounded-lg">
          <div className="relative inline-block text-left">
          {/* Dropdown Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg flex items-center justify-between min-w-[120px] hover:bg-pink-600"
          >
            {period} <MdArrowDropDown className='w-[30px] h-[30px]' />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute mt-2 bg-white text-gray-800 shadow-md rounded-lg w-40">
              <button
                onClick={() => handleSelect("Daily")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Daily
              </button>
              <button
                onClick={() => handleSelect("Weekly")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Weekly
              </button>
              <button
                onClick={() => handleSelect("Monthly")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Monthly
              </button>
            </div>
          )}
        </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          {/* Weekly Bookings */}
          <div className="bg-white shadow rounded-lg p-6 col-span-2">
            <h3 className="text-lg font-bold text-gray-700">This Week Booking</h3>
            <Bar ref={barChartRef} key={JSON.stringify(bookingData)} data={bookingData} />
          </div>

          {/* Analytics */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-700">Analytics</h3>
            <Line ref={lineChartRef} key={JSON.stringify(lineChartData)} data={lineChartData} />
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h3 className="text-lg font-bold text-gray-700">Recent Bookings</h3>
          <table className="w-full mt-4">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Customer Name</th>
                <th className="py-3 px-6 text-left">Appointment date</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Service Name</th>
                {/* <th className="py-3 px-6 text-left">Payment Method</th> */}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {businessBooking?.map(booking => {
                return (
                  <tr className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left">{booking.clientProfileId.Fullname}</td>
                    <td className="py-3 px-6 text-left">{booking.appointmentDate}</td>
                    <td className="py-3 px-6 text-left text-green-500">{booking.status}</td>
                    <td className="py-3 px-6 text-left">{booking.bookedItemId.name}</td>
                    {/* <td className="py-3 px-6 text-left">{booking.paymentMethod}</td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default BusinessDashboard;
