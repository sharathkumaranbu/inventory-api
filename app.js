/**
 * The application entry point
 */

require('./src/bootstrap')
const _ = require('lodash')
const config = require('config')
const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')
const httpStatus = require('http-status-codes')
const path = require('path')

const helper = require('./src/common/helper')
const logger = require('./src/common/logger')
const routes = require('./src/routes')

const app = express()

app.set('port', config.PORT)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({ credentials: true, origin: true }))
app.use(express.static(path.join(__dirname, 'src/templates')))

const apiRouter = express.Router()

_.each(routes, (verbs, url) => {
  _.each(verbs, (def, verb) => {
    let actions = [
      (req, res, next) => {
        req.signature = `${def.controller}#${def.method}`
        next()
      }
    ]
    const method = require(`./src/controllers/${def.controller}`)[def.method] // eslint-disable-line

    if (!method) {
      throw new Error(
        `${def.method} is undefined, for controller ${def.controller}`
      )
    }

    if (def.middleware && def.middleware.length > 0) {
      actions = actions.concat(def.middleware)
    }

    actions.push(method)
    logger.info(`API : ${verb.toLocaleUpperCase()} ${config.API_PREFIX}${url}`)
    apiRouter[verb](
      `${config.API_PREFIX}${url}`,
      helper.autoWrapExpress(actions)
    )
  })
})

app.use('/', apiRouter)

// Error handling
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err.isJoi) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: err.details[0].message
    })
  } else if (err.errors) {
    res.status(httpStatus.BAD_REQUEST).json({ message: err.errors })
  } else {
    const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    res
      .status(statusCode)
      .json({ message: err.message || config.DEFAULT_MESSAGE })
  }
})

// Check if the route is not found or HTTP method is not supported
app.use('*', (req, res) => {
  const pathKey = req.baseUrl.replace(config.API_PREFIX, '')
  const route = routes[pathKey]
  if (route) {
    res
      .status(httpStatus.METHOD_NOT_ALLOWED)
      .json({ message: 'The requested HTTP method is not supported.' })
  } else {
    res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'The requested resource cannot be found.' })
  }
})

app.listen(app.get('port'), () => {
  logger.debug(`Express server listening on port ${app.get('port')}`)
})

module.exports = app
