/**
 * Inventory API Routes
 */

module.exports = {
  '/inventories': {
    get: {
      controller: 'InventoryController',
      method: 'listItems'
    },
    post: {
      controller: 'InventoryController',
      method: 'createItems'
    },
    patch: {
      controller: 'InventoryController',
      method: 'updateItems'
    },
    delete: {
      controller: 'InventoryController',
      method: 'deleteItems'
    }
  },
  '/consume': {
    post: {
      controller: 'InventoryController',
      method: 'consumeItems'
    }
  }
}
