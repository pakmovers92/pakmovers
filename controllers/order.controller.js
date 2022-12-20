//models
const Order = require('../models/order.model')
//validations
const validateOrder = require('../validations/order.validate')
//helpers
const joiHelper = require('../helpers/joi.helper')

module.exports = {
  add: async (req, res) => {
    try {
      console.log(req.body)
      joiHelper(validateOrder, req.body)
      req.body.vendor = req.params.vendorId
      req.body.orderedBy = req.user.id
      await Order.create(req.body)
      res
        .status(201)
        .json({ message: 'your ordered has been placed' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  respondToOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId)
      if (!order) throw Error('order not exists')
      if (req.body.response) order.status = 'accepted'
      else order.status = 'rejected'
      await order.save()
      res.status(200).json({ message: `order ${order.status}` })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  fetchOrders: async (req, res) => {
    try {
      const orders = await Order.find({
        vendor: req.user.id,
        status: req.query.status,
      }).populate(
        'orderedBy',
        'name address contact email avatar'
      )
      if (!orders.length) throw Error('No orders available')
      res.status(200).json(orders)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  fetchMyOrders: async (req, res) => {
    try {
      const orders = await Order.find({
        orderedBy: req.user.id,
      }).populate('vendor', '-password')
      if (!orders.length) throw Error('No orders available')
      res.status(200).json(orders)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
}
