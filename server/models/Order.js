const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Товар обязателен']
  },
  quantity: {
    type: Number,
    required: [true, 'Количество товара обязательно'],
    min: [1, 'Количество не может быть меньше 1']
  },
  price: {
    type: Number,
    required: [true, 'Цена товара обязательна'],
    min: [0, 'Цена не может быть отрицательной']
  }
})

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Пользователь обязателен']
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: [true, 'Общая сумма обязательна'],
    min: [0, 'Общая сумма не может быть отрицательной']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'bank_transfer'],
    default: 'card'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true
})


orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ status: 1 })

orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0)
})


orderSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Order', orderSchema)