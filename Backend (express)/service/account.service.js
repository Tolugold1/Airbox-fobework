require("dotenv").config();
const User = require("../model/account");
const {
    ForbiddenError,
    InvalidDetailsError,
    UnauthorizedError,
    FieldError,
    NotFoundError,
    ExpiredError,
    AlreadyExistError,
    ApplicationError,
    ExtractionFailed,
    ResumeNotSaved,
    OperationFailedError,
} = require("../utils/error");
const { AUTH_TYPE } = require("../utils/constants");
const { redisClient } = require("../utils/redis/redisConf");

exports.SignUp = async function ({ name, email, password, confirmPassword, acctType }) {
    try {
      email = email.trim().toLowerCase();
      name = name.trim();
      password = password.trim();
      confirmPassword = confirmPassword.trim();

      if (await User.findOne({ email }).lean().select("email")) {
        throw AlreadyExistError("User with this email already exists");
      }

      let user = new User({ username: email });
      if (password) {
        user.password = password;
        user.authType = AUTH_TYPE.PASSWORD;
      }
      // create this user analytics schema
    //   let analytics = new Analytics({userId: user._id});
    //   await analytics.save();
      user.email = email;
      user.AcctType = acctType;
    //   user.analytics = analytics._id;
      user.name = name;
      user.phone_number = phone_number;
  
      let profile_id = await helper.generateUniqueString(user);
      console.log(user, profile_id)
  
      user.profile_id = profile_id;
   

      // await sendVerificationMail.sendVerificationMail({
      //   _id: user._id,
      //   username: user.username,
      //   flag: user
      //   type: "verification"
      // });
  
      // make a mailing API call here
    //   const mailBody = {
    //     recipient: user.email,
    //     userId: user._id,
    //     flow
    //   };
    //   axios.post(`${process.env.MAILING_SERVICE_URL}/mail/in-app/send-verification-mail`, mailBody, {
    //     headers: {
    //       "Content-Type": "application/json"
    //     }
    //   });
  
      await user.save();
  
    } catch (error) {
      console.log("sigining error", error);
      throw error;
    }
}; 

exports.SignIn = async function ({ res, username, password }) {
    try {
      username = username.trim().toLowerCase();
      let user = await User.findOne({ username: username });
      // compare password
      if (!user) {
        console.log("No data")
        throw NotFoundError("Account not found.", 404);
      } else {
        if (user.authType !== "PASSWORD" || user.Confirmed !== true) {
          if (user.Confirmed !== true) {
            // resend verification mail
            // make a mailing API call here
            let mailBody = {
              recipient: user.email,
              userId: user._id,
            }
            axios.post(`${process.env.MAILING_SERVICE_URL}/mail/in-app/send-verification-mail`, mailBody, {
              headers: {
                "Content-Type": "application/json"
              }
            });
          }
          const data = {
            success: false,
            statusCode: 404,
            status: user.Confirmed !== true ?  "Please you need to verify your email. The verification mail has been sent again to your email": "This email have been registered on another account.."
          }
          return data;
        } else if (user.authType === "PASSWORD") {
          const pwdStat = await compareHashed(password, user.password);
          console.log("PwdStat", pwdStat);
  
          if (pwdStat) {
            user.lastAccess = Date.now() / 1000;
            if (user.profile_id === undefined) {
              user.profile_id = await helper.generateUniqueString(user);
            }
            // await user.save();
            if (user.signed_in == 0 || user.signed_in == false) {
              // send an email and update the signed_in flag to true
              user.signed_in = 1;
            } else {
              user.signed_in = user.signed_in + 1;
            } 
            user.refreshTokens.pop();
            let token =  authenticate.getToken({ _id: user._id });
            let refreshToken = authenticate.getRefreshToken({ _id: user._id });
            // let encrytedRefreshToken = authenticate.encryptToken(refreshToken);
            user.refreshTokens.push(refreshToken);
            user.save();
            let profile_status;
  
            // store tokens into redis cache
            await redisClient.set("token-"+ user._id, token);
            await redisClient.set("refreshToken-"+ user._id, refreshToken);

            if (user.AcctType === "Client") {
              const client = await ClientProfile.findOne({ userId: user._id });
  
              if (client !== null) {
                profile_status = true;
                let lastpage = await redisClient.get("lastPage-" + user._id);
                let linkDirection;
                if (lastpage && lastpage.length !== 0) {
                    if (JSON.parse(lastpage).includes("messages")) {
                    linkDirection = "/user/messages";
                    } else if (JSON.parse(lastpage).includes("/form") || JSON.parse(lastpage).includes("/user/profile/update")) {
                    linkDirection = "/user/dashboard";
                    } else {
                    linkDirection = JSON.parse(lastpage);
                    }
                    console.log("lastpage after parse", lastpage)
                } else {
                    linkDirection = "/user/dashboard";
                }
                  // if (!referral) {
                  //   // create a referrer link or model here
                  //   await createReferralLink({userId: user._id, baseUrl: process.env.MOIL_FRONTEND_URL, email: user.email});
                  // }
                  // // await redisClient.set("token-" + user._id, token);
                  // res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                  const data = {
                    success: true,
                    statusCode: 200,
                    status: "Sign in successful",
                    token: token,
                    refreshToken: refreshToken,
                    lastpage: linkDirection,
                    profile_status: { profile_status: profile_status, AcctType: user.AcctType,
                    referral: referral?.link }
                  };
                  // check if signed_in flag is true
                  return data;
              } else {
                let lastpage = await redisClient.get("lastPage-" + user._id);
                  let linkDirection;
                  if (lastpage && lastpage.length !== 0) {
                      if (JSON.parse(lastpage).includes("messages")) {
                        linkDirection = "/user/messages";
                      } else if (JSON.parse(lastpage).includes("/form") || JSON.parse(lastpage).includes("/user/profile/update")) {
                        linkDirection = "/user/welcome";
                      } else {
                        linkDirection = JSON.parse(lastpage);
                      }
                      console.log("lastpage after parse", lastpage)
                  } else {
                    linkDirection = "/user/welcome";
                  }
                  // if (!referral) {
                  //   // create a referrer link or model here
                  //   await createReferralLink({userId: user._id, baseUrl: process.env.MOIL_FRONTEND_URL, email: user.email});
                  // }
                  profile_status = false;
                  // // await redisClient.set("token-" + user._id, token);
                  // res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                const data = {
                  success: true,
                  statusCode: 200,
                  status: "Sign in successful",
                  token: token,
                  refreshToken: refreshToken,
                  lastpage: linkDirection,
                  profile_status: { profile_status: profile_status, AcctType: user.AcctType,
                  referral: referral?.link }
                };
                return data;
              } 
            } else if (user.AcctType === "Official") {
              const employer = await EmployerProfile.findOne({ userId: user._id });
              if (employer) {
                profile_status = true;
                  let lastpage = await redisClient.get("lastPage-" + user._id);
                  let linkDirection;
                  if (lastpage && lastpage.length !== 0) {
                      if (JSON.parse(lastpage).includes("inbox")) {
                          linkDirection = "/employer/inbox";
                      } else if (JSON.parse(lastpage).includes("welcome")) {
                        linkDirection = "/employer/dashboard";
                      } else {
                          linkDirection = JSON.parse(lastpage);
                      }
                  } else {
                      linkDirection = "/employer/dashboard";
                  }
                  console.log("lastpage after parse", lastpage)
                  console.log("lastpage after parse", linkDirection)
                const data = {
                  success: true,
                  statusCode: 200,
                  status: "Sign in successful",
                  token: token,
                  refreshToken: refreshToken,
                  lastpage: linkDirection,
                  profile_status: { profile_status: profile_status, AcctType: user.AcctType,
                  referral: referral?.link }
                };
                return data;
              } else {
                profile_status = false;
                let lastpage = await redisClient.get("lastPage-" + user._id);
                let linkDirection;
                  if (lastpage && lastpage.length !== 0) {
                      if (JSON.parse(lastpage).includes("inbox")) {
                          linkDirection = "/employer/inbox";
                      } else {
                          linkDirection = JSON.parse(lastpage);
                      }
                      console.log("lastpage after parse", lastpage)
                  } else {
                      linkDirection = "/employer/welcome";
                  }
                const data = {
                  success: true,
                  statusCode: 200,
                  status: "Sign in successful",
                  token: token,
                  refreshToken: refreshToken,
                  lastpage: linkDirection,
                  profile_status: { profile_status: profile_status, AcctType: user.AcctType,
                  referral: referral?.link }
                };
                return data;
              }
            }
          } else {
            const data = {
              success: false,
              statusCode: 404,
              status: "Incorrect password."
            };
            return data;
          }
        }
      }
  
    } catch (error) {
      console.log("sigining error", error);
      throw error;
    }
};
  

exports.insueRefreshToken = async function ({refreshToken, userId}) {
    try {
      if (!refreshToken) {
        return new ForbiddenError("No refresh token provided");
      }
  
      // verify the refresh token
      let user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
      if (!user) {
        return new ForbiddenError("Invalid refresh token");
      }
      console.log("user info from token validation", user);
      // check if the user id in the refresh token is the same as the current user id
      if (user._id !== userId) {
        return new ForbiddenError("Invalid refresh token");
      }
  
      // get user 
      let userInfo = await User.findById({_id: user._id}).select("refreshTokens").lean();
      let refreshTokens = userInfo.refreshTokens;
      refreshTokens = refreshTokens.filter(token => token !== refreshToken);
  
      let newToken = authenticate.getToken({_id: user._id});
      let newRefreshToken = authenticate.getRefreshToken({_id: user._id});
  
      refreshTokens.push(newRefreshToken);
      await User.updateOne({_id: user._id}, {refreshTokens: refreshTokens});
  
      // store tokens into redis cache
      await redisClient.set("token-"+ user._id, newToken);
      await redisClient.set("refreshToken-"+ user._id, newRefreshToken);
  
  
      return {
        status: "refresh token gotten successfuly",
        statusCode: 200,
        token: newToken,
        refreshToken: newRefreshToken
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  
  
  exports.resendVerification = async function ({ email }) {
    try {
      const user = await User.findOne({ email }).lean();
      if (!user) throw NotFoundError("User with this email does not exist");
      console.log(user);
      // TODO: resent mail to user when they tried to login but havn't verify mail.
      // return await sendVerificationMail({
      //   _id: user._id,
      //   username: user.username,
      //   type: "verification",
      // });
    } catch (error) {
      throw error;
    }
  };
  
  exports.GetMyInfo = async function ({ id }) {
    try {
      const user = await User.findOne({_id: id}); // .populate("analytics");
      if (!user) {
        throw NotFoundError("User not found");
      }
      // console.log("user", user);
      return user;
    } catch (error) {
      throw NotFoundError("User not found");
    }
  };
  
  exports.ChangeMyPassword = async function ({ id, password }) {
    try {
      // Get the user
      const user = await User.findById(id);
      user.setPassword(password);
      user.refreshTokens = [];
      await user.save();
      console.log("user", user)
      return user.AcctType;
    } catch (error) {
      throw error;
    }
};



// THE FORGOT PASSWORD SHOULD TAKE THE USER EMAIL AND SEND AN OTP TO THAT EMAIL
// THIS EMAIL WILL BE USED TO RESET THE PASSWORD....
exports.ForgotPassword = async function ({ username }) {
    try {
      const user = await User.findOne({ username: username });
      console.log("user", user);
      if (user == null) {
        throw NotFoundError("User not found");
      }
  
      let reset_token = await helper.SignToken({ id: user._id });
  
      user.reset_password_token = reset_token;
      user.reset_password_expiresAt = Date.now() + 300000;
  
      // await sendVerificationMail.sendVerificationMail({
      //   _id: user._id,
      //   username: user.username,
      //   token: reset_token,
      //   flag: user.AcctType,
      //   type: "reset_password"
      // });

      // make a mailing API call here
    //   let mailBody = {
    //     recipient: user.username,
    //     userId: user._id,
    //     token: reset_token
    //   }
    //   axios.post(`${process.env.MAILING_SERVICE_URL}/mail/in-app/forgot-password-mail`, mailBody, {
    //     headers: {
    //       "Content-Type": "application/json"
    //     }
    //   });
  
      await user.save();
    } catch (error) {
      throw error;
    }
};

exports.resetPassword = async function ({ id, password }) {
    try {
      const user = await User.findById(id);
      if (!user) throw NotFoundError("User not found");
  
      user.password = password;
      await user.save();
      return user.AcctType;
    } catch (error) {
      throw error;
    }
};