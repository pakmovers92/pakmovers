const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
module.exports = function (app, express) {
  app.use(express.urlencoded({ extended: false }))
  app.use(cors())
  app.use(helmet())
  app.use(compression())
  app.use(morgan('dev'))
}
