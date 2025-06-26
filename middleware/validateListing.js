const { listingSchema} = require("../schems.js");
const ExpressError = require("../utils/ExpressError.js");

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};

module.exports = validateListing;
