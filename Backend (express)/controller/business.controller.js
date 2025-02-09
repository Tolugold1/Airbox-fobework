const Service = require("../service/business.service");
const { 
  handleResponse
} = require("../utils/helper");

exports.HTTPCreateProfile = async (req, res, next) => {
  try {
    const data = await Service.createProfile({ 
        ...req.body
    });

    handleResponse({
      res,
      status: 200,
      message: "Business booking item created successfully.",
      data,
    });
  } catch (error) {
    console.log("signup error", error);
    next(error);
  }
};


exports.HTTPGetProfile = async (req, res, next) => {
    try {
      let {    
        userId
      } = req.body;
      const data = await Service.getProfile({ 
        clientProfileId, 
        bookedItemId, 
        bookingDetails
      });
  
      handleResponse({
        res,
        status: 200,
        message: "Business analytics gotten successfully.",
        data,
      });
    } catch (error) {
      console.log("signup error", error);
      next(error);
    }
};
  
exports.HTTPUpdateProfile = async (req, res, next) => {
    try {
      let {    
        userId,
        updateData
      } = req.body;
      const data = await Service.updateProfile({ 
        userId,
        updateData
      });
  
      handleResponse({
        res,
        status: 200,
        message: "Business analytics gotten successfully.",
        data,
      });
    } catch (error) {
      console.log("signup error", error);
      next(error);
    }
};

