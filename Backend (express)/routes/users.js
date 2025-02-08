var express = require('express');
var router = express.Router();
var authenticate = require("../authentication.js");
const {
  HTTPUserSignUp,
  HTTPUserSignIn,
  HTTPUserForgotPassword,
  HTTPRequestFrestToken,
  HTTPGetMyInfo,
  HTTPChangeMyPassword
} = require("../controller/account.controller.js")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/signup", authenticate.authenticateJWT, HTTPUserSignUp)

router.post("/signin", authenticate.authenticateJWT, HTTPUserSignIn)

router.post("/forgot-password", authenticate.authenticateJWT, HTTPUserForgotPassword)

router.post("/refresh-token", authenticate.authenticateJWT, HTTPRequestFrestToken)

router.get("/get-account-info", authenticate.authenticateJWT, HTTPGetMyInfo)

router.post("/change-password", authenticate.authenticateJWT, HTTPChangeMyPassword)

module.exports = router;
