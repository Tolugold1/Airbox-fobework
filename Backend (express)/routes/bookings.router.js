var express = require('express');
var router = express.Router();
var authenticate = require("../authentication.js");
const controller = require("../controller/booking.controller.js");


router.post("/create-bookin-item",  /* validate input using joi */  authenticate.authenticateJWT,  controller.HTTPCreateBookingItems)

router.post("/book-item", /* valid input using joi */ authenticate.authenticateJWT, controller.HTTPBookItem)

router.get("/get-client-bookings", /* valid input using joi */ authenticate.authenticateJWT, controller.HTTPGetClientBookings)

router.get("/get-business-bookings", /* valid input using joi */ authenticate.authenticateJWT, controller.HTTPGetBusinessBookings)

router.post("/update-booking-customer",  /* validate input using joi */  authenticate.authenticateJWT,  controller.HTTPEditBookingByClient)

router.post("/cancel-booking", /* valid input using joi */ authenticate.authenticateJWT, controller.HTTPCancelBooking)

module.exports = router;
