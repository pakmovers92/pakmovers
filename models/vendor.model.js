const { Schema, model } = require('mongoose')

module.exports = model(
  'vendor',
  new Schema({
    company_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    contact: { type: Number, required: true },
    address: { type: String, required: true },
    logo: { type: String },
    discription: { type: String },
    vehicales: { type: String },
    price_per_km: { type: Number, required: true },
    price_per_kg: { type: Number, required: true },
    isRegistered: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  })
)
