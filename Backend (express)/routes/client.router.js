var express = require('express');
var router = express.Router();
var authenticate = require("../authentication.js");
const controller = require("../controller/client.controller.js")


router.post("/create-profile",  /* validate input using joi */  authenticate.authenticateJWT,  controller.HTTPCreateProfile)

router.get("/get-profile", /* valid input using joi */ authenticate.authenticateJWT, controller.HTTPGetProfile)

router.post("/update-profile", /* validate input using joi */ authenticate.authenticateJWT, controller.HTTPUpdateProfile)

module.exports = router;
