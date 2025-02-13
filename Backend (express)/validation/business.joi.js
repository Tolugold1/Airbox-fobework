const Joi = require("joi");
const {
    FieldError
} = require("../utils/error");
const ClientBookings = require("../model/clientBookings");
const constants = require("../utils/constants");

module.exports = {

    validateBusinessSchema: (req, res, next) => {
        const schema = Joi.object({
            _id: Joi.any(),
            name: Joi.string().required(),
            location: Joi.string(),
            Email: Joi.string().required(),
            type_of_business: Joi.string(),
            Phone_number: Joi.string(),
            About: Joi.string().required(),
            hours: Joi.object({
                opening: Joi.string().required(),
                closing: Joi.string().required()
            }),
            open_days: Joi.array().items(Joi.string()),
            website: Joi.string().optional(),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return next(FieldError(error))
        }
        return next()
    },

}