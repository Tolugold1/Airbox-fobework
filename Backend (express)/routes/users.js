var express = require('express');
var router = express.Router();
var authenticate = require("../authentication.js");
const {
  HTTPUserSignUp,
  HTTPUserSignIn,
  HTTPUserForgotPassword,
  HTTPRequestFrestToken,
  HTTPGetMyInfo,
  HTTPChangeMyPassword,
  HTTPVerifyOtpString,
  HTTPValidateToken
} = require("../controller/account.controller.js")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/signup",  /* validate input using joi */ HTTPUserSignUp)

router.post("/signin", /* valid input using joi */ HTTPUserSignIn)

router.post("/forgot-password", /* validate input using joi */ HTTPUserForgotPassword)

router.post("/refresh-token", /* validate inputs using joi */ authenticate.authenticateJWT, HTTPRequestFrestToken)

router.get("/get-account-info", /* validate input using joi */ authenticate.authenticateJWT, HTTPGetMyInfo)

router.post("/change-password", /* validate using joi */  HTTPChangeMyPassword)

router.post("/verify-uniquestring/:token",  HTTPVerifyOtpString)

router.post("/validate-token/:token",  HTTPValidateToken)

module.exports = router;
