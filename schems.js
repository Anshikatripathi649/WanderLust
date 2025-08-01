const Joi = require("joi");

module.exports.listingSchema = Joi.object ({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string().allow("",null)
}).required()

});

module.exports.reviewSchema = Joi.object ({
    review : Joi.object({
        comment: Joi.string().required(),
        rating: Joi.string().required(),
}).required()

});