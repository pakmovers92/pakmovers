const Product = require('../models/product.model')
//validations
const validateProduct = require('../validations/product.validate')
//helpers
const joiHelper = require('../helpers/joi.helper')
const bufferConversion = require('../helpers/bufferConversion')
const cloudinary = require('../helpers/cloudinary')
module.exports = {
  add: async (req, res) => {
    try {
      console.log(req.body)
      joiHelper(validateProduct, req.body)
      if (!req?.file) throw Error('Please Upload Product Image')
      const { originalname, buffer } = req.file
      const { secure_url } = await cloudinary(
        bufferConversion(originalname, buffer)
      )
      req.body.picture = secure_url
      req.body.postedBy = req.user.id
      await Product.create(req.body)
      res.status(201).json({ message: 'Product uploaded' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  getAll: async (req, res) => {
    try {
      const { onRent } = req.query
      const products = await Product.find({ onRent }).populate({
        path: 'postedBy',
        select: '-password -__v',
      })
      if (!products.length)
        return res
          .status(404)
          .json({ message: 'No product available' })

      res.status(200).json({ products })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  edit: async (req, res) => {
    try {
      const { productId } = req.params
      joiHelper(validateProduct, req.body)
      const product = await Product.findByIdAndUpdate(
        productId,
        { $set: req.body },
        { new: true }
      )
      if (!product) throw Error('something went wrong')
      res.status(200).json({
        product,
        message: 'Product updated successfully',
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  delete: async (req, res) => {
    try {
      const { productId } = req.params
      const product = await Product.deleteOne({ _id: productId })
      if (!product) throw Error('something went wrong')
      res
        .status(204)
        .json({ message: 'Product Deleted Successfully' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  getMy: async (req, res) => {
    try {
      const products = await Product.find({
        postedBy: req.user.id,
      }).populate({
        path: 'postedBy',
        select: '-password -__v',
      })
      if (!products.length) throw Error('No Product Available')
      res.status(200).json({
        products,
        message: 'Product updated successfully',
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
}
