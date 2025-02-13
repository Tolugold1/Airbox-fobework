require("dotenv").config();
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const jwtExtract = require("passport-jwt").ExtractJwt;
const jwtStrategy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken");
const User = require("./model/account");
const { ACCOUNT_TYPE, AUTH_TYPE } = require("./utils/constants");
const helper = require("./utils/helper");
const { redisClient } = require("./utils/redis/redisConf");
const { hashSync, compare } = require("bcrypt");

//require google strategy
var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  }).maxTimeMS(60000);
});

exports.getToken = function (user) {
  return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME });
};

exports.getRefreshToken = function (user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: process.env.REFRESH_TOKEN_LIFETIME });
};

exports.encryptToken = function (token) {
  let salt = 10;
  return hashSync(token, salt);
};

const opt = {};
opt.jwtFromRequest = jwtExtract.fromAuthHeaderAsBearerToken();
opt.secretOrKey = process.env.SECRET_KEY;

exports.jwtPassport = passport.use(
  new jwtStrategy(opt, (jwt_payload, done) => {
    // console.log("jwt_payload", jwt_payload);

    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    }).maxTimeMS(60000);
  })
);

exports.verifyUser = passport.authenticate("jwt", { session: "false" });

// google client authentication middleware

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CURRENT_URL + "/api/Oauth/google/airboxClient",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ username: profile.emails[0].value }, async (err, user) => {
        if (err) {
          return done(err, false);
        } else if (!err && user !== null) {
          // ckeck if user has a profile_id
          if (user.profile_id !== undefined && user.profile_id !== null) {
            return done(null, user);
          } else {
            user.profile_id = await helper.generateUniqueString(user);
            user.save();
          }
        } else {
          // create a new user document for the current user.
          user = new User({ username: profile.emails[0].value });
          if (profile.displayName) {
            user.name = profile.displayName;
          }
          if (profile.emails[0].value) {
            user.email = profile.emails[0].value.toLowerCase();
          }

          user.AcctType = "Client";
          let profile_id = await helper.generateUniqueString(user);
          user.profile_id = profile_id;
          user.authType = AUTH_TYPE.OAUTH;
        //   let analytics = new Analytics({userId: user._id});
        //   await analytics.save();
        //   user.analytics = analytics._id;
          user.Confirmed = true;
          user.save((err, user) => {
            if (err) {
              return done(err, false);
            } else {
              return done(null, user);
            }
          });
        }
      }).maxTimeMS(60000);
    }
  )
);

// official google auth
passport.use(
  "google-alt",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CURRENT_URL + "/api/Oauth/google/official/airbox",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ username: profile.emails[0].value }, async (err, user) => {
        if (err) {
          console.log(err);
          return done(err, false);
        } else if (!err && user !== null) {
          // ckeck if user has a profile_id
          if (user.profile_id !== undefined && user.profile_id !== null) {
            return done(null, user);
          } else {
            user.profile_id = await helper.generateUniqueString(user);
            user.save();
          }
        } else {
          // create a new user document for the current user.
          user = new User({ username: profile.emails[0].value });
          if (profile.displayName) {
            user.name = profile.displayName;
          }
          if (profile.emails[0].value) {
            user.email = profile.emails[0].value.toLowerCase();
          }
          if (profile.photos[0].value) {
            user.profile_pics = profile.photos[0].value;
          }
          user.AcctType = "Official";
          user.last7daysMail.push({ count: 0 });
          user.last24hoursMail.push({ count: 0 });
          user.last14daysMail.push({ count: 0 });
          user.last30daysMail.push({ count: 0 });
          let profile_id = await helper.generateUniqueString(user);
          user.profile_id = profile_id;
          user.authType = AUTH_TYPE.OAUTH;
          let analytics = new Analytics({userId: user._id});
          await analytics.save();
          user.analytics = analytics._id;
          user.Confirmed = true;
          user.save((err, user) => {
            if (err) {
              return done(err, false);
            } else {
              return done(null, user);
            }
          });
        }
      }).maxTimeMS(60000);
    }
  )
);

exports.authenticateJWT = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("token", token);
  if (token) {
    try {
      // Verify JWT token
      const user = await jwt.verify(token, process.env.SECRET_KEY);

      // Check refreshToken from redis
      const refreshToken = await redisClient.get("refreshToken-" + user._id);

      if (refreshToken && req.cookies.refreshToken !== refreshToken) {
        console.log("Incorrect refresh token");
        res.clearCookie('session_id');
        res.clearCookie('jwt');
        res.clearCookie('refreshToken');
        return res.status(403).json({
          success: false,
          status: process.env.FRONTEND_URL,
          message: "Refresh token mismatch",
        });
      }

      // If everything is good, attach user to request
      req.user = user;
      next();

    } catch (err) {
      console.log("JWT verification error:", err.message);

      // Clear cookies if token is invalid or expired
      res.clearCookie('session_id');
      res.clearCookie('jwt');
      res.clearCookie('refreshToken');

      return res.status(403).json({
        success: false,
        message: err.name === "TokenExpiredError" ? "Token expired" : "Unauthorized",
        status: process.env.FRONTEND_URL,
      });
    }
  } else {
    console.log("No token provided");
    res.status(401).json({
      success: false,
      status: process.env.FRONTEND_URL,
      message: "No token provided",
    });
  }
};

