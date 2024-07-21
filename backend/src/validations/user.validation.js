const Joi = require('joi');
const { StatusCodes } = require('http-status-codes')

const userSignupBody = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    confirmPassword: Joi.string()
})

const userLoginBody = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
})

const userSignupValidBody = (req, res, next) => {
    const { error } = userSignupBody.validate(req.body);

    if(error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message);
    }

    next();
}

const userLoginValidBody = (req, res, next) => {
    const { error } = userLoginBody.validate(req.body);

    if(error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message);
    }

    next();
}

module.exports = { userSignupValidBody, userLoginValidBody }