const Service = require("../service/business.service");
const { 
  handleResponse
} = require("../utils/helper");

exports.HTTPCreateProfile = async (req, res, next) => {
  try {
    let body = req.body;
    body.userId = req.user._id;
    const data = await Service.createProfile(body);

    handleResponse({
      res,
      status: 200,
      message: "Business profile created successfully.",
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
        message: "Business profile gotten successfully.",
        data,
      });
    } catch (error) {
      console.log("Getting profile error", error);
      next(error);
    }
};
  
exports.HTTPUpdateProfile = async (req, res, next) => {
    try {
      let updateData = req.body;
      const data = await Service.updateProfile({ 
        userId: req.user._id,
        updateData
      });
  
      handleResponse({
        res,
        status: 200,
        message: "Business profile updated successfully.",
        data,
      });
    } catch (error) {
      console.log("signup error", error);
      next(error);
    }
};

