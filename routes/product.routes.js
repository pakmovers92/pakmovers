const express = require('express')
const router = express.Router()
const product = require('../controllers/product.controller')

//middlewares
const upload = require('../middleware/multer.middleware')
const { isCustomer, isLogin } = require('../middleware')
router.post(
  '/add',
  isLogin,
  isCustomer,
  upload.single('product'),
  product.add
)
router.get('/get/my', isLogin, product.getMy)
router.put('/edit/:productId', isLogin, product.edit)
router.delete('/delete/:productId', isLogin, product.delete)
router.get('/get/all', isLogin, product.getAll)
module.exports = router
