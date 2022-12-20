const Joi = require('joi')
module.exports = function (data) {
  const schema = Joi.object({
    name: Joi.string().required(),
    vehicales: Joi.string().required(),
    weight: Joi.number().min(0).required(),
    distance: Joi.number().required(),
    boxes: Joi.number().required(),
    address: Joi.string().required(),
    message: Joi.string().required(),
  })
  return schema.validate(data)
}
