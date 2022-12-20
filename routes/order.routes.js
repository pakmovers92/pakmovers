const express = require('express')
const router = express.Router()

const order = require('../controllers/order.controller')

const {
  isLogin,
  isCustomer,
  isVendor,
} = require('../middleware')

router.post('/add/:vendorId', isLogin, isCustomer, order.add)
router.put(
  '/respond/:orderId',
  isLogin,
  isVendor,
  order.respondToOrder
)
router.get(
  '/get/responded',
  isLogin,
  isVendor,
  order.fetchOrders
)
router.get('/get/my', isLogin, isCustomer, order.fetchMyOrders)
module.exports = router
