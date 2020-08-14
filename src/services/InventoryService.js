/**
 * Inventory Service
 */

const _ = require('lodash')
const errors = require('http-errors')
const joi = require('@hapi/joi')
const { Inventory } = require('../models')
const { ensureExists } = require('../common/helper')

/**
 * List items
 */
const listItems = async () => {
  return Inventory.find({})
}

/**
 * Create items
 *
 * @param {object} data Request body
 */
const createItems = async (data) => {
  let output = []
  const items = data.items
  for (const item in items) {
    if (await ensureExists(Inventory, { name: items[item].name }, false)) {
      throw new errors.Conflict(
        `Item with name ${items[item].name} already exists`
      )
    }
    output.push(await Inventory.create(items[item]))
  }
  return output
}

createItems.schema = {
  data: joi.object().keys({
    items: joi.array().items(
      joi.object().keys({
        name: joi.string().trim().required(),
        quantity: joi.number().integer().required()
      })
    )
  })
}

/**
 * Update items
 *
 * @param {object} data Request body
 */
const updateItems = async (data) => {
  let output = []
  const items = data.items
  for (const item in items) {
    const dbItem = await ensureExists(
      Inventory,
      { name: items[item].name },
      false
    )
    if (!dbItem) {
      throw new errors.BadRequest(
        `Item with name ${items[item].name} is not found`
      )
    }
    _.assignIn(dbItem, items[item])
    output.push(await dbItem.save())
  }
  return output
}

updateItems.schema = createItems.schema

/**
 * Delete items
 *
 * @param {object} data Request body
 */
const deleteItems = async (data) => {
  const items = data.items
  for (const item in items) {
    const dbItem = await ensureExists(
      Inventory,
      { name: items[item].name },
      false
    )
    if (!dbItem) {
      throw new errors.BadRequest(
        `Item with name ${items[item].name} is not found`
      )
    }
    await dbItem.remove()
  }
  return { message: `${data.items.length} Items removed successfully` }
}

deleteItems.schema = {
  data: joi.object().keys({
    items: joi.array().items(
      joi.object().keys({
        name: joi.string().trim().required()
      })
    )
  })
}

/**
 * Consume items
 * @param {object} data Request body
 */
const consumeItems = async (data) => {
  let output = []
  const items = data.items
  for (const item in items) {
    const dbItem = await ensureExists(
      Inventory,
      { name: items[item].name },
      false
    )
    if (!dbItem) {
      throw new errors.BadRequest(
        `Item with name ${items[item].name} is not found`
      )
    }
    if (dbItem.quantity < items[item].quantity) {
      throw new errors.BadRequest(
        `Item with name ${items[item].name} availability is lesser than requested consumption.`
      )
    }
    _.assignIn(dbItem, { quantity: dbItem.quantity - items[item].quantity })
    output.push(await dbItem.save())
  }
  return output
}

consumeItems.schema = createItems.schema

module.exports = {
  listItems,
  createItems,
  updateItems,
  deleteItems,
  consumeItems
}
