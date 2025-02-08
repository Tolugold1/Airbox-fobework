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
        throw new Error(`Error occured while updating business analytics, ${error.message}`);
    }
}

const BusinessAnalytics = require("../models/businessAnalytics");


/**
 * Get booking analytics formatted for charts.
 * @param {String} businessId - The business ID.
 * @param {String} timeframe - "daily", "weekly", or "monthly".
 * @returns {Promise<Array>} - Aggregated analytics.
 */
exports.getBookingAnalytics = async (businessId, timeframe) => {
    try {
        if (!["daily", "weekly", "monthly"].includes(timeframe)) {
            throw new Error("Invalid timeframe. Use 'daily', 'weekly', or 'monthly'.");
        }

        let groupByFormat;
        let startDate = new Date();
        
        // Determine grouping format for aggregation
        if (timeframe === "daily") {
            startDate.setDate(startDate.getDate() - 7); // Last 7 days
            groupByFormat = { year: { $year: "$appointmentDate" }, month: { $month: "$appointmentDate" }, day: { $dayOfMonth: "$appointmentDate" } };
        } else if (timeframe === "weekly") {
            startDate.setDate(startDate.getDate() - 30); // Last 30 days
            groupByFormat = { year: { $year: "$appointmentDate" }, week: { $week: "$appointmentDate" } };
        } else if (timeframe === "monthly") {
            startDate.setMonth(startDate.getMonth() - 6); // Last 6 months
            groupByFormat = { year: { $year: "$appointmentDate" }, month: { $month: "$appointmentDate" } };
        }

        // Aggregate booking data
        const analyticsData = await Bookings.aggregate([
            {
                $match: {
                    businessId: new mongoose.Types.ObjectId(businessId),
                    appointmentDate: { $gte: startDate } // Filter by date
                }
            },
            {
                $group: {
                    _id: groupByFormat,
                    totalBookings: { $sum: 1 },
                    scheduledBookings: { 
                        $sum: { $cond: [{ $eq: ["$status", "scheduled"] }, 1, 0] } 
                    },
                    completedBookings: { 
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } 
                    },
                    cancelledBookings: { 
                        $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } 
                    }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.week": 1 }
            }
        ]);

        // Format data for frontend charts
        const formattedData = analyticsData.map((item) => {
            let dateLabel;
            if (timeframe === "daily") {
                dateLabel = `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`;
            } else if (timeframe === "weekly") {
                dateLabel = `Week ${item._id.week}, ${item._id.year}`;
            } else {
                dateLabel = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
            }

            return {
                date: dateLabel,
                totalBookings: item.totalBookings,
                scheduledBookings: item.scheduledBookings,
                completedBookings: item.completedBookings,
                cancelledBookings: item.cancelledBookings
            };
        });

        return formattedData;
    } catch (error) {
        throw new Error(`Error fetching booking analytics: ${error.message}`);
    }
};