const Service = require("../service/account.service");
const { 
  handleResponse
} = require("../utils/helper");
const authenticate = require("../authenticate");

exports.HTTPUserSignUp = async (req, res, next) => {
  try {
    let { name, email, password, confirmPassword, acctType } = req.body;
    const data = await Service.SignUp({ 
      name, 
      email, 
      password, 
      confirmPassword, 
      acctType 
    });

    handleResponse({
      res,
      status: 200,
      message: "User registered successfully, An OTP has been sent to your email for confirmation",
      data,
    });
  } catch (error) {
    console.log("signup error", error);
    next(error);
  }
};

exports.HTTPUserSignIn = async (req, res, next) => {
  try {
    console.log("body", req.body)
    const data = await Service.SignIn({ res, username: req.body.username, password: req.body.password });

    console.log("data", data)
    handleResponse({
      res,
      status: data.statusCode,
      message: data.status,
      data: data,
    });
  } catch (error) {
    console.log("signin error", error);
    next(error);
  }
};

exports.HTTPRequestFrestToken = async (req, res, next) => {
  try {
    let token = req.cookies.refreshToken;
    const data = await Service.insueRefreshToken({ refreshToken: token, userId: req.user._id });
    console.log("data", data);
    handleResponse({
      res,
      status: data?.statusCode,
      message: data?.status,
      data: data,
    });
  } catch (error) {
    console.log("signin error", error);
    next(error);
  }
};

exports.HTTPGetMyInfo = async (req, res, next) => {
  try {
    const data = await Service.GetMyInfo({ id: req.user._id });
    handleResponse({
      res,
      status: 200,
      message: "User information fetched",
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.HTTPChangeMyPassword = async (req, res, next) => {
  try {
    let { password } = req.body;
    const data = await Service.ChangeMyPassword({
      id: req.user._id,
      password,
    });
    handleResponse({
      res,
      status: 200,
      message: "Password changed successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

exports.HTTPUserForgotPassword = async (req, res, next) => {
  try {
    const data = await Service.ForgotPassword({ username: req.body.username });
    handleResponse({
      res,
      status: 200,
      message: "A link has been sent to your mail for password reset",
      data,
    });
  } catch (error) {
    next(error)
  }
};
