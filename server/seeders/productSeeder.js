const mongoose = require('mongoose')
const Product = require('../models/Product')
require('dotenv').config()

const products = [
  {
    name: 'Футболка классическая',
    description: 'Хлопковая футболка премиум-качества, удобная и стильная',
    price: 1999,
    category: 'Футболки',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3',
    stock: 42,
    featured: true,
    tags: ['хлопок', 'повседневная', 'базовая']
  },
  {
    name: 'Джинсы slim fit',
    description: 'Современные джинсы облегающего кроя, отличное качество пошива',
    price: 3499,
    category: 'Джинсы',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3',
    stock: 25,
    featured: true,
    tags: ['деним', 'облегающие', 'премиум']
  },
  {
    name: 'Куртка демисезонная',
    description: 'Стильная куртка для межсезонья, защита от ветра и дождя',
    price: 5999,
    category: 'Верхняя одежда',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3',
    stock: 15,
    tags: ['демисезон', 'ветровка', 'стильная']
  },
  {
    name: 'Свитшот oversize',
    description: 'Уютный свитшот свободного кроя, идеален для отдыха',
    price: 2799,
    category: 'Свитшоты',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3',
    stock: 30,
    tags: ['уютный', 'oversize', 'повседневный']
  },
  {
    name: 'Платье коктейльное',
    description: 'Элегантное платье для вечеринок и особых occasions',
    price: 4599,
    category: 'Платья',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3',
    stock: 18,
    featured: true,
    tags: ['вечернее', 'элегантное', 'коктейльное']
  },
  {
    name: 'Рубашка офисная',
    description: 'Классическая рубашка для делового стиля, premium cotton',
    price: 2299,
    category: 'Рубашки',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3',
    stock: 35,
    tags: ['офис', 'классика', 'деловая']
  }
]
const seedProducts = async () => {
  try {

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    await Product.deleteMany({})
    console.log('Cleared existing products')

  
    await Product.insertMany(products)
    console.log('Products seeded successfully')

    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
    
    process.exit(0)
  } catch (error) {
    console.error('Error seeding products:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  seedProducts()
}

module.exports = seedProducts