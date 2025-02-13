const Service = require("../service/client.service");
const { 
  handleResponse
} = require("../utils/helper");

exports.HTTPCreateProfile = async (req, res, next) => {
  try {
    console.log("body", req.body);
    let body = req.body;
    body.userId = req.user._id;
    const data = await Service.createProfile(body);

    handleResponse({
      res,
      status: 200,
      message: "Client profile created successfully.",
      data,
    });
  } catch (error) {
    console.log("signup error", error);
    next(error);
  }
};


exports.HTTPGetProfile = async (req, res, next) => {
    try {
      const data = await Service.getProfile({ 
        userId: req.user._id
      });
  
      handleResponse({
        res,
        status: 200,
        message: "Client profile gotten successfully.",
        data,
      });
    } catch (error) {
      console.log("signup error", error);
      next(error);
    }
};
  
exports.HTTPUpdateProfile = async (req, res, next) => {
    try {
      let updateData = req.body;
      console.log("updateData", updateData);
      const data = await Service.updateProfile({ 
        userId: req.user._id,
        updateData
      });
  
      handleResponse({
        res,
        status: 200,
        message: "Client profile updated successfully.",
        data,
      });
    } catch (error) {
      console.log("signup error", error);
      next(error);
    }
};