const BusinessAnalytics = require("../model/businessAnalytics");
const Bookings = require("../model/businessBookingSchema");
const {
    ForbiddenError,
    InvalidDetailsError,
    UnauthorizedError,
    FieldError,
    NotFoundError,
    ExpiredError,
    AlreadyExistError,
    ApplicationError,
    ExtractionFailed,
    OperationFailedError,
} = require("../utils/error");
const mongoose = require("mongoose");

exports.updateBusinessAnalytics = async ({
    businessId,
    revenue,
    TotalCompletedBooking,
    totalScheduledBooking,
    TotalCancelledBooking
}) => {
    try {
        let businessAnalytics = await BusinessAnalytics.findOne({ businessId }).lean();
        if ( !businessAnalytics ) throw NotFoundError(`Analytics for the business Id ${businessId} not found.`);
        if (revenue) {
            businessAnalytics.revenue += revenue
        };
        if (TotalCompletedBooking) {
            businessAnalytics.TotalCompletedBooking += TotalCompletedBooking
        };
        if (totalScheduledBooking) {
            businessAnalytics.totalScheduledBooking += totalScheduledBooking
        };
        if (TotalCancelledBooking) {
            businessAnalytics.TotalCancelledBooking += TotalCancelledBooking
        };

        await businessAnalytics.save();
    } catch (error) {
      throw error;
    }
}

/**
 * Get booking analytics formatted for charts.
 * @param {String} businessId - The business ID.
 * @param {String} timeframe - "daily", "weekly", or "monthly".
 * @returns {Promise<Array>} - Aggregated analytics.
 */

exports.getBookingAnalytics = async ({ businessId, timeframe }) => {
  try {
    if (!["Daily", "Weekly", "Monthly"].includes(timeframe)) {
      throw new Error("Invalid timeframe. Use 'Daily', 'Weekly', or 'Monthly'.");
    }

    let overallAnalytics = await BusinessAnalytics.findOne({ businessId }).lean();
    console.log("overallAnalytics", overallAnalytics);

    let groupByFormat;
    let startDate = new Date();

    // Determine grouping format for aggregation
    if (timeframe === "Daily") {
      startDate.setDate(startDate.getDate() - 7); // Last 7 days
      groupByFormat = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
    } else if (timeframe === "Weekly") {
      startDate.setDate(startDate.getDate() - 30); // Last 30 days
      groupByFormat = {
        year: { $year: "$createdAt" },
        week: { $week: "$createdAt" },
      };
    } else if (timeframe === "Monthly") {
      startDate.setMonth(startDate.getMonth() - 6); // Last 6 months
      groupByFormat = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
    }

    // Aggregate booking data and compute revenue
    const analyticsData = await Bookings.aggregate([
      {
        $match: {
          businessId: new mongoose.Types.ObjectId(businessId),
          createdAt: { $gte: startDate }, // Filter by date
        },
      },
      {
        $lookup: {
          from: "bookingitems", // Collection name in MongoDB
          localField: "bookedItemId",
          foreignField: "_id",
          as: "bookedItem",
        },
      },
      {
        $unwind: "$bookedItem", // Unwind booked item to access pricing
      },
      {
        $group: {
          _id: groupByFormat,
          totalBookings: { $sum: 1 },
          scheduledBookings: {
            $sum: { $cond: [{ $eq: ["$status", "scheduled"] }, 1, 0] },
          },
          completedBookings: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
          totalRevenue: { $sum: "$bookedItem.pricing" }, // Compute total revenue
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.week": 1 },
      },
    ]);

    // Format data for frontend charts
    const formattedData = analyticsData.map((item) => {
      let dateLabel;
      if (timeframe === "Daily") {
        dateLabel = `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`;
      } else if (timeframe === "Weekly") {
        dateLabel = `Week ${item._id.week}, ${item._id.year}`;
      } else {
        dateLabel = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
      }

      return {
        date: dateLabel,
        totalBookings: item.totalBookings,
        scheduledBookings: item.scheduledBookings,
        completedBookings: item.completedBookings,
        cancelledBookings: item.cancelledBookings,
        totalRevenue: item.totalRevenue, // Add computed revenue per day
      };
    });

    return { formattedData, overallAnalytics };
  } catch (error) {
    throw error;
  }
};
