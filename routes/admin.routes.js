const express = require('express')
const router = express.Router()
const admin = require('../controllers/admin.controller')

const { isLogin, isAdmin } = require('../middleware')

router.post('/login', admin.login)
router.put(
  '/respond/vendor/:vendorId',
  // isLogin,
  // isAdmin,
  admin.respondToVendor
)
router.put(
  '/block/vendor/:vendorId',
  // isLogin,
  // isAdmin,
  admin.blockVendor
)
router.put(
  '/unblock/vendor/:vendorId',
  // isLogin,
  // isAdmin,
  admin.unblockVendor
)
router.get('/fetch/vendors', admin.fetchWorkingVendors)
router.get('/fetch/blocked/vendors', admin.fetchBlockedVendors)
router.get('/fetch/requests', admin.fetchRequests)

module.exports = router
