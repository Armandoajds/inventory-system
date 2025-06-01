const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Índices para búsquedas avanzadas
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, brand: 1 });

module.exports = mongoose.model('Product', productSchema); 