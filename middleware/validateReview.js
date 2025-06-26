const { reviewSchema } = require("../schems.js");
const ExpressError = require("../utils/ExpressError.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};

module.exports = validateReview;