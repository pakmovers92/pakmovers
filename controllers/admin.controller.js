//npm
const bcrypt = require('bcryptjs')
//models
const Admin = require('../models/user.model')
const Vendor = require('../models/vendor.model')
//validatoins
const validateLogin = require('../validations/login.validation')
//helpers
const joiHelper = require('../helpers/joi.helper')
const jwtSign = require('../helpers/jwtSign.helper')

module.exports = {
  login: async (req, res) => {
    try {
      const { password, email } = req.body

      joiHelper(validateLogin, req.body)

      const admin = await Admin.findOne({ email })

      if (!admin)
        return res
          .status(404)
          .json({ message: 'incorrect email' })
      if (!(await bcrypt.compare(password, admin.password)))
        return res
          .status(400)
          .json({ message: 'Incorrect Password' })

      res.status(200).json({
        message: 'Login successfully',
        token: jwtSign({ id: admin.id, isAdmin: true }),
        admin: {
          username: admin.username,
          email: admin.email,
          avatar: admin.avatar,
        },
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  fetchRequests: async (req, res) => {
    try {
      const vendors = await Vendor.find({
        isRegistered: false,
        isBlocked: false,
      })
      if (!vendors.length) throw Error('No pending requests')
      res.status(200).json(vendors)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  fetchWorkingVendors: async (req, res) => {
    try {
      const vendors = await Vendor.find({
        isRegistered: true,
        isBlocked: false,
      })
      if (!vendors.length) throw Error('vendors not available')
      // const response = vendors.map((v, i) => {
      //   return {
      //     id: i,
      //     company_name: v.company_name,
      //     contact: v.contact,
      //     email: v.email,
      //     vehicales: v.vehicales,
      //     price_per_kg: v.price_per_kg,
      //     price_per_km: v.price_per_km,
      //     logo: v.logo,
      //   }
      // })

      res.status(200).json(vendors)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  fetchBlockedVendors: async (req, res) => {
    try {
      const vendors = await Vendor.find({ isBlocked: true })
      if (!vendors.length) throw Error('vendors not available')
      res.status(200).json(vendors)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  respondToVendor: async (req, res) => {
    try {
      const { vendorId } = req.params
      const { response } = req.body
      const vendor = await Vendor.findById(vendorId)

      if (response) vendor.isRegistered = true
      else vendor.isBlocked = true
      await vendor.save()
      res.status(200).json({ message: 'vendor is updated' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  blockVendor: async (req, res) => {
    try {
      const { vendorId } = req.params
      const vendor = await Vendor.findById(vendorId)
      if (vendor.isBlocked)
        throw Error('vendor is already blocked')
      vendor.isBlocked = true
      await vendor.save()
      res.status(200).json({ message: 'vendor is blocked' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  unblockVendor: async (req, res) => {
    try {
      const { vendorId } = req.params
      const vendor = await Vendor.findById(vendorId)
      if (!vendor.isBlocked)
        throw Error('vendor is already unblocked')
      vendor.isBlocked = false
      await vendor.save()
      res.status(200).json({ message: 'vendor is unblocked' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
}
