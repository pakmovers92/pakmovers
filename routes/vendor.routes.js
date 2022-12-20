const express = require('express')
const router = express.Router()
const vendor = require('../controllers/vendor.controller')
const upload = require('../middleware/multer.middleware')
const { isLogin, isVendor } = require('../middleware')

router.post('/login', vendor.login)
router.post('/register', upload.single('logo'), vendor.register)
router.put(
  '/edit/profile',
  isLogin,
  isVendor,
  vendor.editProfile
)
router.put(
  '/edit/profile-pic',
  isVendor,
  isLogin,
  upload.single('image'),
  vendor.editLogo
)

module.exports = router
