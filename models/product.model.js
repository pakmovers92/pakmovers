const { Schema, model } = require('mongoose')
const productSchema = new Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: [
      'office',
      'vehicle',
      'jewelery',
      'electronic',
      'furniture',
    ],
  },
  price: { type: Number, min: 0 },
  discription: { type: String, required: true },
  picture: { type: String, required: true },
  postedBy: { type: Schema.Types.ObjectId, ref: 'user' },
  onRent: { type: Boolean, default: false },
})

module.exports = model('product', productSchema)
