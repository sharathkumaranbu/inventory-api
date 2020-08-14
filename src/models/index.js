/*
 * Init Mongo DB models
 */

const config = require('config')
const fs = require('fs')
const path = require('path')

require('../datasource').getDb(config.MONGODB_URL)

const models = {}

// Bootstrap models
fs.readdirSync(__dirname).forEach((file) => {
  if (file !== 'index.js') {
    const filename = file.split('.')[0]
    const model = require(path.join(__dirname, filename))
    models[filename] = model
    if (model.schema) {
      model.schema.options.minimize = false
      // If toJSON is not defined at Model level, define general rule
      if (!model.schema.options.toJSON) {
        model.schema.options.toJSON = {
          transform: (doc, ret) => {
            if (ret._id) {
              ret.id = String(ret._id)
              delete ret._id
            }
            delete ret.__v
            return ret
          }
        }
      }
    }
  }
})

module.exports = models
