require("dotenv").config();
const ClientProfile = require("../model/clientAccount");
const BusinessProfile = require("../model/businessAccount")
const jwt = require("jsonwebtoken");
const User = require("../model/account");

exports.generateUniqueString = async (user) => {
    // you are not considering those that signed up with google or linkedin
    // we wait till they create a profile, and then from ther we can get their name.
    let name, profile;
    if (user.name === undefined) {
      // check if user have a profile
      if (user.AcctType === ACCOUNT_TYPE.CLIENT) {
        profile = await ClientProfile.findOne({userId: user._id});
        if (profile) {
          name = profile.Fullname.split(' ').join('_');
        } else {
          return;
        }
      } else if (user.AcctType === ACCOUNT_TYPE.EMPLOYER) {
        profile = await BusinessProfile.findOne({userId: user._id});
        if (profile) {
          name = profile.name.split(' ').join('_');
        } else {
          return;
        }
      }
    } else {
      name = user.name.split(' ').join('_')
    }
  
    let existingUser = await User.findOne({ profile_id: name }).lean().select('profile_id')
  
    if (!existingUser) return name
  
    name = user.name.split(' ').join('_') + nanoid(4) //new Date().getTime()
    return name
}

exports.handleResponse = ({ res, status, message, data }) => {
    try {
        if (data?.token !== undefined && data.refreshToken !== undefined) {
            // let token =  authenticate.getToken({ _id: user._id });
            res.cookie('jwt', data.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', /* sameSite: true */ });
            res.cookie('refreshToken', data.refreshToken, { httpOnly: false, secure: true, /* sameSite: true */ });
          }
        res.status(status).json({
            success: true,
            status: message,
            statusCodes: status,
            data: !!data ? data : null
        })
    } catch (error) {
        throw error;
    }
}

exports.SignToken = async function (id, override = {}) {
  return jwt.sign(id, process.env.SECRET_KEY);
};


// this function takes the User model and the user id
exports.handleRedirectLink = async (res, id, route, data) => {
  const user = await User.findOne({ _id: id });

  if (route === "Login page") {
    res.redirect(`${process.env.FRONTEND_URL}/login`);
  }

  if (route === "Expire") {
    res.redirect(process.env.FRONTEND_URL + `/login?exp="Your time has expired"`);
  }

  if (route === "Reset password page") {
    res.redirect(`${process.env.FRONTEND_URL}/reset?userId=${id}`);
  }
};
