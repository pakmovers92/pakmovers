const { Schema, model } = require('mongoose')
module.exports = model(
  'order',
  new Schema({
    name: { type: String, required: true },
    vehicales: { type: String, required: true },
    weight: { type: Number, required: true },
    distance: { type: Number, required: true },
    address: { type: String, required: true },
    boxes: { type: Number, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'rejected', 'accepted'],
      default: 'pending',
    },
    orderedBy: { type: Schema.Types.ObjectId, ref: 'user' },
    vendor: { type: Schema.Types.ObjectId, ref: 'vendor' },
  })
)
