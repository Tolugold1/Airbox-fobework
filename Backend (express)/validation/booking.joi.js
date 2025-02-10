const Joi = require("joi");
const {
    FieldError
} = require("../utils/error");
const ClientBookings = require("../model/clientBookings");
const constants = require("../utils/constants");

module.exports = {

    validateClientBookings: (req, res, next) => {
        const schema = Joi.object({
            _id: Joi.any(),
            clientProfileId: Joi.any(),
            appointmentDate: Joi.string(),
            company_name: Joi.string(),
            company_Contact: Joi.string(),
            status: Joi.string().valid(...Object.values(constants.BOOKING_STATUS)),
            bookedItemId: Joi.any(),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return next(FieldError(error))
        }
        return next()
    },

    validateBookingItems: (req, res, next) => {
        const schema = Joi.object({
            _id: Joi.any(),
            businessId: Joi.any(),
            name: Joi.string(),
            description: Joi.string(),
            type: Joi.string(),
            slots: Joi.number(),
            availableSlots: Joi.object({
                startTime: Joi.string(),
                endTime: Joi.string()
            }),
            open_days: Joi.array().items(Joi.string()),
            pricing: Joi.number(),
            location: Joi.string()
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return next(FieldError(error))
        }
        return next()
    },

    validateBusinessBookedItem: (req, res, next) => {
        const schema = Joi.object({
            _id: Joi.any(),
            clientProfileId: Joi.any(),
            businessId: Joi.any(),
            appointmentDate: Joi.string(),
            status: Joi.string().valid(...Object.values(constants.BOOKING_STATUS)),
            bookedItemId: Joi.any(),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return next(FieldError(error))
        }
        return next()
    }
}