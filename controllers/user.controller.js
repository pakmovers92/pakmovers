//npm
const bcrypt = require('bcryptjs')
//models
const User = require('../models/user.model')
const Vendor = require('../models/vendor.model')
//validatoins
const validateLogin = require('../validations/login.validation')
const validateUser = require('../validations/userRegister.validate')
const validateEditProfile = require('../validations/userEditProfile.validate')
//helpers
const joiHelper = require('../helpers/joi.helper')
const jwtSign = require('../helpers/jwtSign.helper')
const cloudinary = require('../helpers/cloudinary')
const bufferConversion = require('../helpers/bufferConversion')

module.exports = {
  login: async (req, res) => {
    try {
      const { password, email } = req.body
      joiHelper(validateLogin, req.body)
      const user = await User.findOne({ email })

      if (!user)
        return res.status(404).json({ message: 'Signup First' })

      if (!(await bcrypt.compare(password, user.password)))
        throw Error('Incorrect Password')

      res.status(200).json({
        message: 'Login successfully',
        token: jwtSign({ id: user.id, isCustomer: true }),
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          address: user.address,
          contact: user.contact,
          avatar: user.avatar,
          mode: 'user',
        },
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  register: async (req, res) => {
    try {
      const { password, email } = req.body

      const { originalname, buffer } = req.file
      if (!originalname)
        throw Error('please upload profile image')
      //VALIDATE REQUEST BODY
      joiHelper(validateUser, req.body)
      const user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({
          message: 'Email already exist',
        })
      }
      const { secure_url } = await cloudinary(
        bufferConversion(originalname, buffer)
      )
      req.body.avatar = secure_url
      req.body.password = await bcrypt.hash(password, 10)
      await User.create(req.body)
      res.status(200).json({
        message: 'Your account has been created',
      })
    } catch (error) {
      return res.status(400).json({
        message: error.message || 'Something went Wrong',
      })
    }
  },
  fetchVendors: async (req, res) => {
    try {
      const vendors = await Vendor.find({
        isRegistered: true,
        isBlocked: false,
      }).select('-password')
      if (!vendors.length) throw Error('no vendor available')

      res.status(200).json(vendors)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  editProfile: async (req, res) => {
    try {
      joiHelper(validateUser, req.body)
      req.body.password = await bcrypt.hash(password, 10)
      const doc = await User.findByIdAndUpdate(
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
  editProfilePic: async (req, res) => {
    try {
      if (!req.file) throw Error('Please select a picture')
      const { originalname, buffer } = req.file
      const { secure_url } = await cloudinary(
        bufferConversion(originalname, buffer)
      )

      const doc = await User.findByIdAndUpdate(
        req.user.id,
        { $set: { avatar: secure_url } },
        { new: true }
      )
      if (!doc) throw Error('something went wrong')
      res.status(200).json({ message: 'Picture Updated' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
}
