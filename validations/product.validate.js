const Joi = require('joi')
module.exports = function (data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    category: Joi.string()
      .valid(
        'office',
        'vehicle',
        'jewelery',
        'electronic',
        'furniture'
      )
      .required(),
    price: Joi.number().min(0).required(),
    discription: Joi.string().required(),
    onRent: Joi.bool().default(false),
  })
  return schema.validate(data)
}
