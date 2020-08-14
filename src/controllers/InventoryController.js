/**
 * Inventory Controller
 */

const InventoryService = require('../services/InventoryService')

/**
 * List items
 *
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 */
const listItems = async (req, res) => {
  res.json(await InventoryService.listItems())
}

/**
 * Create items
 *
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 */
const createItems = async (req, res) => {
  res.json(await InventoryService.createItems(req.body))
}

/**
 * Update items
 *
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 */
const updateItems = async (req, res) => {
  res.json(await InventoryService.updateItems(req.body))
}

/**
 * Delete items
 *
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 */
const deleteItems = async (req, res) => {
  res.json(await InventoryService.deleteItems(req.body))
}

/**
 * Consume entry for items
 *
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 */
const consumeItems = async (req, res) => {
  res.json(await InventoryService.consumeItems(req.body))
}

module.exports = {
  listItems,
  createItems,
  updateItems,
  deleteItems,
  consumeItems
}
