/**
 * Init MongoDB datasource
 */

// The mongoose instance.
const mongoose = require('mongoose')

// use bluebird promise library instead of mongoose default promise library
mongoose.Promise = global.Promise

// Database variable
let db

/**
 * Gets db connection for the given URL.
 *
 * @param {string} url Database URL
 * @returns {object} Mongo DB connection for the given URL
 */
const getDb = (url) => {
  if (!db) {
    db = mongoose.connect(url, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }
  return db
}

// exports the functions
module.exports = {
  getDb
}
