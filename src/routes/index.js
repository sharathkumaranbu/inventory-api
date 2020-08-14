/**
 * Define API routes
 */

const _ = require('lodash')
const fs = require('fs')

const routes = {}

// Load routes
fs.readdirSync(__dirname).forEach((file) => {
  if (file !== 'index.js') {
    _.extend(routes, require(`./${file}`))
  }
})

module.exports = routes
