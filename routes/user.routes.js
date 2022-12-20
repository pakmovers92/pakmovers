const express = require('express')
const router = express.Router()
const user = require('../controllers/user.controller')
const upload = require('../middleware/multer.middleware')
const { isLogin } = require('../middleware')

router.post('/login', user.login)
router.post('/register', upload.single('profile'), user.register)
router.get('/fetch/vendors', isLogin, user.fetchVendors)
router.put('/edit/profile', isLogin, user.editProfile)
router.put(
  '/edit/profile-pic',
  upload.single('image'),
  isLogin,
  user.editProfilePic
)

module.exports = router
