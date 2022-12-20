const Joi = require('joi')
module.exports = function (vendor) {
  const userSchema = Joi.object({
    company_name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    contact: Joi.string().length(11).required(),
    address: Joi.string().min(5).required(),
    discription: Joi.string().min(5).required(),
    vehicales: Joi.string().required(),
    price_per_km: Joi.number().min(1).required(),
    price_per_kg: Joi.number().min(1).required(),
  })
  return userSchema.validate(vendor)
}
