var express = require('express');
var router = express.Router();
var authenticate = require("../authentication.js");
const controller = require("../controller/account.controller.js")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/signup",  /* validate input using joi */ controller.HTTPUserSignUp)

router.post("/signin", /* valid input using joi */ controller.HTTPUserSignIn)

router.post("/forgot-password", /* validate input using joi */ controller.HTTPUserForgotPassword)

router.post("/refresh-token", /* validate inputs using joi */ authenticate.authenticateJWT, controller.HTTPRequestFrestToken)

router.get("/get-account-info", /* validate input using joi */ authenticate.authenticateJWT, controller.HTTPGetMyInfo)

router.post("/change-password", /* validate using joi */  controller.HTTPChangeMyPassword)

router.post("/verify-uniquestring/:token",  controller.HTTPVerifyOtpString)

router.post("/validate-token/:token",  controller.HTTPValidateToken)

module.exports = router;



