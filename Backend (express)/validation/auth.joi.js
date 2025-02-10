const Joi = require("joi");
const {
    FieldError
} = require("../utils/error");
const ClientBookings = require("../model/clientBookings");
const constants = require("../utils/constants");

module.exports = {

    validateSignup: (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().optional(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().required(),
            acctType: Joi.string().required(),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return next(FieldError(error))
        }
        return next()
    },

    validateSignin: (req, res, next) => {
        const schema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
            acctType: Joi.string().required(),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return next(FieldError(error))
        }
        return next()
    },

    validateForgotPasword: (req, res, next) => {
        const schema = Joi.object({
            username: Joi.string().required(),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return next(FieldError(error))
        }
        return next()
    },
    validateChangePasword: (req, res, next) => {
        const schema = Joi.object({
            password: Joi.string().required(),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return next(FieldError(error))
        }
        return next()
    },
}
