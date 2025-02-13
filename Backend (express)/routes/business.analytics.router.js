var express = require('express');
var router = express.Router();
var authenticate = require("../authentication.js");
const controller = require("../controller/analytics.controller.js");


router.put("/update-analytics",  authenticate.authenticateJWT,  controller.HTTPUpdateAnalytics)

router.get("/get-analytics/:businessId/:timeframe", authenticate.authenticateJWT, controller.HTTPGetAnalytics)

module.exports = router;
