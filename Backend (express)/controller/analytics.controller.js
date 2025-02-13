const Service = require("../service/business.analytics.service");
const { 
  handleResponse
} = require("../utils/helper");

exports.HTTPUpdateAnalytics = async (req, res, next) => {
  try {
    let {    
        businessId,
        revenue,
        TotalCompletedBooking,
        totalScheduledBooking,
        TotalCancelledBooking 
    } = req.body;
    const data = await Service.updateBusinessAnalytics({ 
        businessId,
        revenue,
        TotalCompletedBooking,
        totalScheduledBooking,
        TotalCancelledBooking 
    });

    handleResponse({
      res,
      status: 200,
      message: "Business analytics updated successfully.",
      data,
    });
  } catch (error) {
    console.log("Error getting business updating business analytics", error);
    next(error);
  }
};


exports.HTTPGetAnalytics = async (req, res, next) => {
    try {
      
      let {    
        businessId,
        timeframe,
      } = req.params;
      const data = await Service.getBookingAnalytics({ 
        businessId,
        timeframe,
      });
  
      handleResponse({
        res,
        status: 200,
        message: "Business analytics gotten successfully.",
        data,
      });
    } catch (error) {
      console.log("Error getting business analytics successfully.", error);
      next(error);
    }
};
  
