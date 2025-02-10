var express = require('express');
var router = express.Router();
var authenticate = require("../authentication.js");
const controller = require("../controller/booking.controller.js");
const { 
    validateClientBookings,
    validateBookingItems,
    validateBusinessBookedItem
 } = require("../validation/booking.joi.js")


router.post("/create-bookin-item",  validateBookingItems,  authenticate.authenticateJWT,  controller.HTTPCreateBookingItems)

router.post("/book-item", validateClientBookings, authenticate.authenticateJWT, controller.HTTPBookItem)

router.get("/get-client-bookings", authenticate.authenticateJWT, controller.HTTPGetClientBookings)

router.get("/get-business-bookings", authenticate.authenticateJWT, controller.HTTPGetBusinessBookings)

router.put("/update-booking-customer",  authenticate.authenticateJWT,  controller.HTTPEditBookingByClient)

router.post("/cancel-booking", authenticate.authenticateJWT, controller.HTTPCancelBooking)

module.exports = router;
