var express = require('express');
var router = express.Router();
var authenticate = require("../authentication.js");
const controller = require("../controller/account.controller.js")
const { 
  validateSignup,
  validateSignin,
  validateForgotPasword,
  validateChangePasword
} = require("../validation/auth.joi");
const jwt = require("jsonwebtoken");
const User = require("../model/account.js")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/signup",  validateSignup, controller.HTTPUserSignUp)

router.post("/signin", validateSignin, controller.HTTPUserSignIn)

router.post("/forgot-password", validateForgotPasword, controller.HTTPUserForgotPassword)

router.post("/refresh-token", authenticate.authenticateJWT, controller.HTTPRequestFrestToken)

router.get("/get-account-info", authenticate.authenticateJWT, controller.HTTPGetMyInfo)

router.post("/change-password", validateChangePasword,  authenticate.authenticateJWT, controller.HTTPChangeMyPassword)

router.get("/verify-uniquestring/:token",  controller.HTTPVerifyOtpString)

router.get("/validate-token/:token",  controller.HTTPValidateToken)

// route to logout
router.post("/logout", async (req, res, next) => {
  if (req.cookies.jwt) {
    let UserJwt = jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);
    let user = await User.findOne({_id: UserJwt._id});
    // remove the refresh token from the db
    // user.refreshTokens = user.refreshTokens.filter(t => t != req.cookies.refreshToken);
    user.refreshTokens = []; // empty the refresh token
    user.save();
  }

  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      } else {
        req.user = null;
        res.clearCookie('session_id');
        res.clearCookie('jwt');
        res.clearCookie("refreshToken");
        
        console.log("req.user", req.user)
        console.log("req.body", req.body)
        res.json({
          success: true,
          message: "Logout out successful",
          status: "http://loclhost:3000",
        });
      }
    });
  });
});

module.exports = router;

