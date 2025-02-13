const Service = require("../service/booking.service");
const { 
  handleResponse
} = require("../utils/helper");

exports.HTTPCreateBookingItems = async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const data = await Service.createBookingItem(req.body);

    handleResponse({
      res,
      status: 200,
      message: "Business booking item created successfully.",
      data,
    });
  } catch (error) {
    console.log("Error creating booking item", error);
    next(error);
  }
};

exports.HTTPEditBookingItems = async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const data = await Service.editBookingItem(req.body);

    handleResponse({
      res,
      status: 200,
      message: "Business booking item updated successfully.",
      data,
    });
  } catch (error) {
    console.log("Error creating booking item", error);
    next(error);
  }
};


exports.HTTPsGetBusinessCreatedBookingItems = async (req, res, next) => {
  try {
    let {    
      businessId
    } = req.params;
    const data = await Service.getBusinessCreatedBookingItems({ 
      businessId
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


exports.HTTPBookItem = async (req, res, next) => {
    try {
      let {    
        clientProfileId, 
        bookedItemId, 
        appointmentDate,
        businessId,
        status
      } = req.body;
      console.log("req.body", req.body);
      const data = await Service.bookItem({ 
        clientProfileId, 
        bookedItemId, 
        appointmentDate,
        businessId,
        status
      });
  
      handleResponse({
        res,
        status: 200,
        message: "Item booked successfully.",
        data,
      });
    } catch (error) {
      console.log("Booking for an item failed", error);
      next(error);
    }
};

exports.HTTPsGetAllBookingItems = async (req, res, next) => {
  try {
    const data = await Service.allBookingItemFromBusinesses();

    handleResponse({
      res,
      status: 200,
      message: "All booking Items gotten successfully.",
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
    } = req.params;
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

exports.HTTPUpdateBookingByBusiness = async (req, res, next) => {
    try {
      let {
        bookingId, 
        updateData
      } = req.body;
      const data = await Service.UpdateBookedItemByBusiness({ 
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

