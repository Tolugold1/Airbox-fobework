const Joi = require("joi");
const {
    FieldError
} = require("../utils/error");
const ClientBookings = require("../model/clientBookings");
const constants = require("../utils/constants");

module.exports = {

    validateClientSchema: (req, res, next) => {
        const schema = Joi.object({
            _id: Joi.any(),
            userId: Joi.any(),
            Fullname: Joi.string(),
            Address: Joi.string(),
            Email: Joi.string(),
            Phone_number: Joi.string(),
            About: Joi.any(),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return next(FieldError(error))
        }
        return next()
    },

}
