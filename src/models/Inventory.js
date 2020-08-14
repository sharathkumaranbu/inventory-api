/**
 * Inventory schema
 */

const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    quantity: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        if (ret._id) {
          ret.id = String(ret._id)
          delete ret._id
        }
        delete ret.__v
        delete ret.createdAt
        delete ret.updatedAt
        return ret
      }
    }
  }
)

module.exports = mongoose.model('Inventory', inventorySchema)
