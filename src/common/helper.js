/**
 * Contains generic helper methods
 */

const _ = require('lodash')
const errors = require('http-errors')
const util = require('util')

/**
 * Wrap async function to standard express function
 *
 * @param {Function} fn the async function
 * @returns {Function} the wrapped function
 */
const wrapExpress = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next)
}

/**
 * Wrap all functions from object
 *
 * @param {object} obj the object (controller exports)
 * @returns {object|Array} the wrapped object
 */
const autoWrapExpress = (obj) => {
  if (_.isArray(obj)) {
    return obj.map(autoWrapExpress)
  }
  if (_.isFunction(obj)) {
    if (obj.constructor.name === 'AsyncFunction') {
      return wrapExpress(obj)
    }
    return obj
  }
  _.each(obj, (value, key) => {
    obj[key] = autoWrapExpress(value) //eslint-disable-line
  })
  return obj
}

/**
 * Ensure entity exists for given criteria
 *
 * @param {object} Model the mongoose model to query
 * @param {object|string|number} criteria the criteria (if object) or id (if string/number)
 * @param {boolean} throwError Boolean variable indicating if error need to be thrown if data is not found
 * @param {string[]} populate Array of references to be populated
 * @returns {object} the found entity or false
 */
const ensureExists = async (
  Model,
  criteria,
  throwError = true,
  populate = []
) => {
  let query
  let byId = true
  if (_.isObject(criteria)) {
    byId = false
    query = Model.findOne(criteria)
  } else {
    query = Model.findById(criteria)
  }

  if (populate && populate.length) {
    _.forEach(populate, (p) => {
      query = query.populate(p)
    })
  }

  const result = await query
  if (!result) {
    let msg
    if (byId) {
      msg = util.format('%s not found with id: %s', Model.modelName, criteria)
    } else {
      msg = util.format(
        '%s not found with criteria: %j',
        Model.modelName,
        criteria
      )
    }
    if (throwError) {
      throw new errors.NotFound(msg)
    } else {
      return false
    }
  }
  return result
}

module.exports = {
  wrapExpress,
  autoWrapExpress,
  ensureExists
}
