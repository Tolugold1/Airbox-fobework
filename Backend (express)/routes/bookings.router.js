var express = require('express');
var router = express.Router();
var authenticate = require("../authentication.js");
const controller = require("../controller/booking.controller.js");
const { 
    validateClientBookings,
    validateBookingItems,
    validateBusinessBookedItem
 } = require("../validation/booking.joi.js")


router.post("/create-booking-item",  validateBookingItems,  authenticate.authenticateJWT,  controller.HTTPCreateBookingItems)

router.put("/update-booking-item",  validateBookingItems,  authenticate.authenticateJWT,  controller.HTTPEditBookingItems)

router.post("/book-item", validateClientBookings, authenticate.authenticateJWT, controller.HTTPBookItem)

router.get("/created-booking-item/:businessId", validateClientBookings, authenticate.authenticateJWT, controller.HTTPsGetBusinessCreatedBookingItems)

router.get("/get-all-Booking-Items", authenticate.authenticateJWT, controller.HTTPsGetAllBookingItems)

router.get("/get-client-bookings", authenticate.authenticateJWT, controller.HTTPGetClientBookings)

router.get("/get-business-bookings/:businessId", authenticate.authenticateJWT, controller.HTTPGetBusinessBookings)

router.put("/update-booking-by-customer",  authenticate.authenticateJWT,  controller.HTTPEditBookingByClient)

router.post("/update-booking-by-business", authenticate.authenticateJWT, controller.HTTPUpdateBookingByBusiness)

module.exports = router;
