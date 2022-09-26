const Joi = require('joi'); 

const schema = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().min(1).required(),
    message: Joi.string().min(1).max(250).required()
})

const validatePostToMessageRoute = (postPayload) => {
    const result = schema.validate(postPayload, {
        abortEarly: false
    }); 
    return result; 
}

module.exports = validatePostToMessageRoute; 