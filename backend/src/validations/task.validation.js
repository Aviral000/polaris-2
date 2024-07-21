const Joi = require('joi');
const { StatusCodes } = require('http-status-codes')

const taskAddBody = Joi.object({
    status: Joi.string().valid('todo', 'in-progress', 'done').optional(),
    description: Joi.string().required(),
})

const taskAddValidBody = (req, res, next) => {
    const { error } = taskAddBody.validate(req.body);

    if(error) {
        res.status(StatusCodes.BAD_GATEWAY).json(error.details[0].message);
    }

    next();
}

module.exports = { taskAddValidBody }