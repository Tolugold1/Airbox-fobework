require("dotenv").config();
var express = require('express');
var router = express.Router();
const passport = require('passport');
const authenticate = require("../authentication");
const User = require("../model/account");
const ClientProfile = require("../model/clientAccount");
const BusinessProfile = require("../model/businessAccount");
const helper = require("../utils/helper");
const { redisClient } = require("../utils/redis/redisConf");

// authenticate client using google
router.get("/google", passport.authenticate("google", { scope: ["profile", 'email'] }));

router.get('/google/airboxClient', passport.authenticate('google'),
    async (req, res, next) => {
        try {
            const [user, profile] = await Promise.all([
                User.findOne({ _id: req.user._id }),
                ClientProfile.findOne({ userId: req.user._id })
            ]);
            console.log("req user from google", req.user);
            if (user && user.AcctType == "Client") {
                if (user.signed_in == 0 || user.signed_in == false) {
                    // send an email and update the signed_in flag to true
                    user.signed_in = 1;
                    user.save();
                } else {
                    user.signed_in = user.signed_in + 1;
                    user.save();
                    console.log("user after signed_in increment")
                }

                const token = authenticate.getToken({ _id: req.user._id });
                let refreshToken = authenticate.getRefreshToken({ _id: user._id });
                res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                res.cookie('refreshToken', refreshToken, { httpOnly: false, secure: true, /* sameSite: true */ });
                await redisClient.set("token-" + user._id, token);
                await redisClient.set("refreshToken-" + user._id, refreshToken);

                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.redirect("http://localhost:3000/client-dashboard") // process.env.MOIL_FRONTEND_URL
            } else {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.redirect("http://localhost:3000/client-dashboard") // process.env.MOIL_FRONTEND_URL
            }
        } catch (error) {
            next(error);
        }
    });
    
// authenticate officials using google
router.get("/google2", passport.authenticate("google-alt", { scope: ["profile", 'email'] }));

router.get('/google/official/airbox', passport.authenticate('google-alt'),
    async (req, res, next) => {
        try {
            console.log(req.user);
            const [user, profile] = await Promise.all([
                User.findOne({ _id: req.user._id }),
                BusinessProfile.findOne({ userId: req.user._id })
            ]);
            if (user && user.AcctType == "Official") {

                if (user.signed_in == 0 || user.signed_in == false) {
                    // send an email and update the signed_in flag to true
                    user.signed_in = 1;
                    user.save();
                } else {
                    user.signed_in = user.signed_in + 1;
                    user.save();
                }

                const token = authenticate.getToken({ _id: req.user._id });
                let refreshToken = authenticate.getRefreshToken({ _id: user._id });
                res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                res.cookie('refreshToken', refreshToken, { httpOnly: false, secure: true, /* sameSite: true */ });
                // store tokens into redis cache
                await redisClient.set("token-" + user._id, token);
                await redisClient.set("refreshToken-" + user._id, refreshToken);

                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.redirect("http://localhost:3000/business-dashboard") // process.env.MOIL_FRONTEND_URL
            } else {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.redirect("http://localhost:3000/business-dashboard/login")
            }
        } catch (error) {
            next(error);
        }
});

router.get("/success", authenticate.authenticateJWT, async (req, res, next) => {
    console.log("request user", req.user)
    if (req.user) {
        const user = await User.findOne({ _id: req.user._id });
        if (user) {
            if (user.AcctType === "Client") {
                const profile = await ClientProfile.findOne({ userId: req.user._id });
                if (profile == null) {
                    const token = authenticate.getToken({ _id: req.user._id });
                    
                    profile_status = false;
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json({ success: true, token: token, AcctType: "Client", profile_status: profile_status })
                } else {
                    const token = authenticate.getToken({ _id: req.user._id });
                    profile_status = true;
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json({ success: true, token: token, AcctType: "Client", profile_status: profile_status })
                }
            } else if (user.AcctType === "Official") {
                const BusinessProfile = await BusinessProfile.findOne({ userId: req.user._id });
                if (BusinessProfile == null) {
                    const token = authenticate.getToken({ _id: req.user._id });
                    
                    profile_status = false;
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json({ success: true, token: token, AcctType: "Official", profile_status: profile_status });
                } else {
                    const token = authenticate.getToken({ _id: req.user._id });
                    profile_status = true;
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json({ success: true, token: token, AcctType: "Official", profile_status: profile_status });
                    
                }
            }
        }
    } else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false })
    }
})

module.exports = router;