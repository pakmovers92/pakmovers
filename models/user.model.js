const { Schema, model } = require('mongoose')

module.exports = model(
  'user',
  new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    contact: { type: Number, required: true },
    address: { type: String, required: true },
    avatar: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer',
    },
  })
)
