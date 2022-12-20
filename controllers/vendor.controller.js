//npm
const bcrypt = require('bcryptjs')
//models
const Vendor = require('../models/vendor.model')
//validatoins
const validateLogin = require('../validations/login.validation')
const validateVendor = require('../validations/vendor.validate')
const validateEditProfile = require('../validations/vendorEditProfile.validate')
//helpers
const joiHelper = require('../helpers/joi.helper')
const jwtSign = require('../helpers/jwtSign.helper')
const bufferConversion = require('../helpers/bufferConversion')
const cloudinary = require('../helpers/cloudinary')

module.exports = {
  login: async (req, res) => {
    try {
      const { password, email } = req.body
      joiHelper(validateLogin, req.body)
      const vendor = await Vendor.findOne({ email })
      if (!vendor) throw Error('Signup First')
      if (!vendor.isRegistered)
        throw Error('You Account is under registration process')
      if (vendor.isBlocked)
        throw Error('You Account has been blocked.')
      if (!(await bcrypt.compare(password, vendor.password)))
        throw Error('Incorrect Password')
      res.status(200).json({
        message: 'Login successfully',
        user: {
          id: vendor._id,
          username: vendor.company_name,
          email: vendor.email,
          address: vendor.address,
          contact: vendor.contact,
          avatar: vendor.logo,
          vehicales: vendor.vehicales,
          priceKG: vendor.price_per_kg,
          priceKM: vendor.price_per_km,
          discription: vendor.discription,
          mode: 'vendor',
        },
        token: jwtSign({ id: vendor.id, isVendor: true }),
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  register: async (req, res) => {
    try {
      const { email, password } = req.body
      joiHelper(validateVendor, req.body)
      if (!req?.file)
        throw Error('please upload your company logo')

      const { originalname, buffer } = req.file
      const vendor = await Vendor.findOne({ email })
      if (vendor)
        throw Error(
          `company is already registered with ${email}`
        )
      const { secure_url } = await cloudinary(
        bufferConversion(originalname, buffer)
      )
      req.body.logo = secure_url
      req.body.password = await bcrypt.hash(password, 10)
      await Vendor.create(req.body)
      res.status(200).json({
        message: 'Your request has been sent for approval',
      })
    } catch (error) {
      return res.status(400).json({
        message: error.message || 'Something went Wrong',
      })
    }
  },
  editProfile: async (req, res) => {
    try {
      joiHelper(validateVendor, req.body)
      req.body.password = await bcrypt.hash(
        req.body.password,
        10
      )
      const doc = await Vendor.findByIdAndUpdate(
        req.user.id,
        { $set: req.body },
        { new: true }
      )
      if (!doc) throw Error('something went wrong')
      res.status(200).json({ message: 'Profile Updated' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  editLogo: async (req, res) => {
    try {
      const { originalname, buffer } = req.file
      if (!originalname) throw Error('Please select a picture')
      const { secure_url } = await cloudinary(
        bufferConversion(originalname, buffer)
      )

      const doc = await Vendor.findByIdAndUpdate(
        req.user.id,
        { $set: { logo: secure_url } },
        { new: true }
      )
      if (!doc) throw Error('something went wrong')
      res.status(200).json({ message: 'Logo Updated' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
}
