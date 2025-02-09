const Service = require("../service/booking.service");
const { 
  handleResponse
} = require("../utils/helper");

exports.HTTPCreateBookingItems = async (req, res, next) => {
  try {
    const data = await Service.createBookingItem({ 
        ...req.body
    });

    handleResponse({
      res,
      status: 200,
      message: "Business booking item created successfully.",
      data,
    });
  } catch (error) {
    console.log("signup error", error);
    next(error);
  }
};


exports.HTTPBookItem = async (req, res, next) => {
    try {
      let {    
        clientProfileId, 
        bookedItemId, 
        bookingDetails
      } = req.body;
      const data = await Service.bookItem({ 
        clientProfileId, 
        bookedItemId, 
        bookingDetails
      });
  
      handleResponse({
        res,
        status: 200,
        message: "Business analytics gotten successfully.",
        data,
      });
    } catch (error) {
      console.log("signup error", error);
      next(error);
    }
};
  
exports.HTTPEditBookingByClient = async (req, res, next) => {
    try {
      let {    
        clientProfileId, 
        bookingId, 
        updateData
      } = req.body;
      const data = await Service.editBookedItemByClient({ 
        clientProfileId, 
        bookingId, 
        updateData
      });
  
      handleResponse({
        res,
        status: 200,
        message: "Business analytics gotten successfully.",
        data,
      });
    } catch (error) {
      console.log("signup error", error);
      next(error);
    }
};

exports.HTTPGetClientBookings = async (req, res, next) => {
  try {
    let {    
      clientProfileId,
    } = req.body;
    const data = await Service.getbookingsByClient({ 
      clientProfileId,
    });

    handleResponse({
      res,
      status: 200,
      message: "Client bookings record gotten successfully.",
      data,
    });
  } catch (error) {
    console.log("signup error", error);
    next(error);
  }
};

exports.HTTPGetBusinessBookings = async (req, res, next) => {
  try {
    let {    
      businessId,
    } = req.body;
    const data = await Service.getBusinessBookingsRecord({ 
      businessId,
    });

    handleResponse({
      res,
      status: 200,
      message: "Business bookings record gotten successfully.",
      data,
    });
  } catch (error) {
    console.log("signup error", error);
    next(error);
  }
};

exports.HTTPCancelBooking = async (req, res, next) => {
    try {
      let {
        bookingId, 
        updateData
      } = req.body;
      const data = await Service.cancelBookedItem({ 
        bookingId, 
        updateData
      });
  
      handleResponse({
        res,
        status: 200,
        message: "Business analytics gotten successfully.",
        data,
      });
    } catch (error) {
      console.log("signup error", error);
      next(error);
    }
};

