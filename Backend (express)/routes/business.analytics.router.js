var express = require('express');
var router = express.Router();
var authenticate = require("../authentication.js");
const controller = require("../controller/analytics.controller.js");


router.post("/update-analytics",  /* validate input using joi */  authenticate.authenticateJWT,  controller.HTTPUpdateAnalytics)

router.get("/get-analytics", /* valid input using joi */ authenticate.authenticateJWT, controller.HTTPGetAnalytics)

module.exports = router;
