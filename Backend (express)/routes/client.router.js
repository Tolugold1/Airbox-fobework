var express = require('express');
var router = express.Router();
var authenticate = require("../authentication.js");
const controller = require("../controller/client.controller.js")
const { 
    validateClientSchema,
 } = require("../validation/client.joi.js")


router.post("/create-profile",  /* validateClientSchema, */  authenticate.authenticateJWT,  controller.HTTPCreateProfile)

router.get("/get-profile", authenticate.authenticateJWT, controller.HTTPGetProfile)

router.put("/update-profile", authenticate.authenticateJWT, controller.HTTPUpdateProfile)

module.exports = router;
