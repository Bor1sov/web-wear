const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Название товара обязательно'],
    trim: true,
    maxlength: [100, 'Название не может быть длиннее 100 символов']
  },
  description: {
    type: String,
    required: [true, 'Описание товара обязательно'],
    maxlength: [1000, 'Описание не может быть длиннее 1000 символов']
  },
  price: {
    type: Number,
    required: [true, 'Цена товара обязательна'],
    min: [0, 'Цена не может быть отрицательной']
  },
  category: {
    type: String,
    required: [true, 'Категория товара обязательна'],
    trim: true,
    index: true
  },
  image: {
    type: String,
    required: [true, 'Изображение товара обязательно'],
    validate: {
      validator: function(url) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(url)
      },
      message: 'Некорректный URL изображения'
    }
  },
  stock: {
    type: Number,
    required: [true, 'Количество товара обязательно'],
    min: [0, 'Количество не может быть отрицательным'],
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
})


productSchema.index({ 
  name: 'text', 
  description: 'text',
  category: 'text',
  tags: 'text'
})

productSchema.index({ category: 1, price: 1 })

productSchema.virtual('discountedPrice').get(function() {
  return this.price
})

productSchema.methods.decreaseStock = function(quantity) {
  this.stock = Math.max(0, this.stock - quantity)
  return this.save()
}

productSchema.methods.increaseStock = function(quantity) {
  this.stock += quantity
  return this.save()
}

productSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v
    return ret
  }
})

module.exports = mongoose.model('Product', productSchema)