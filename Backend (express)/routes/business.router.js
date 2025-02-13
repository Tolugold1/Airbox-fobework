var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
var authenticate = require("../authentication.js");
const controller = require("../controller/business.controller.js");
const { 
    validateBusinessSchema,
 } = require("../validation/business.joi.js")

router.post("/create-profile",  validateBusinessSchema,  authenticate.authenticateJWT,  controller.HTTPCreateProfile)

router.get("/get-profile", authenticate.authenticateJWT, controller.HTTPGetProfile)

router.put("/update-profile", authenticate.authenticateJWT, controller.HTTPUpdateProfile)

module.exports = router;
