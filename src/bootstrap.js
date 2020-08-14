/**
 * Initialize application and build services
 */

require('dotenv').config()

global.Promise = require('bluebird')
const fs = require('fs')
const joi = require('@hapi/joi')
const path = require('path')
const logger = require('./common/logger')

// Object ID validation
joi.id = () =>
  joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .trim()
    .length(24)
    .error((err) => {
      return {
        message: `ID ${err[0].context.value} is not a valid Object ID`
      }
    })

/** Build services by applying validator and logger
 *
 * @param {string} dir Directory in which service code is residing
 */
const buildServices = (dir) => {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const curPath = path.join(dir, file)
    fs.stat(curPath, (err, stats) => {
      if (err) return
      if (stats.isDirectory()) {
        buildServices(curPath)
      } else if (path.extname(file) === '.js') {
        logger.buildService(require(curPath))
      }
    })
  })
}

buildServices(path.join(__dirname, 'services'))
