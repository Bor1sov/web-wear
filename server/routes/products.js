const express = require('express')
const Product = require('../models/Product')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

const router = express.Router()

// Получение всех товаров с фильтрацией и сортировкой
router.get('/', async (req, res) => {
  try {
    const { category, sort, search, page = 1, limit = 100 } = req.query
    
    let query = {}

    // Фильтр по категории
    if (category && category !== 'undefined') {
      query.category = new RegExp(category, 'i')
    }

    // Поиск по названию или описанию
    if (search && search !== 'undefined') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // Настройки сортировки
    const sortOptions = {
      'price_asc': { price: 1 },
      'price_desc': { price: -1 },
      'name_asc': { name: 1 },
      'name_desc': { name: -1 },
      'newest': { createdAt: -1 },
      'oldest': { createdAt: 1 }
    }

    const sortBy = sortOptions[sort] || { createdAt: -1 }

    // Получаем товары
    const products = await Product.find(query)
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit)

    // Получаем общее количество для пагинации
    const total = await Product.countDocuments(query)

    res.json({
      success: true,
      products, // Убедитесь, что возвращаем массив products
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении товаров'
    })
  }
})
// Получение всех категорий
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category')
    res.json({
      success: true,
      categories: categories.filter(cat => cat).sort()
    })
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении категорий'
    })
  }
})
// Получение товара по ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Товар не найден'
      })
    }

    res.json({
      success: true,
      product
    })
  } catch (error) {
    console.error('Get product error:', error)
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Товар не найден'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении товара'
    })
  }
})



// Создание товара (только для администраторов)
router.post('/', auth, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body)
    
    res.status(201).json({
      success: true,
      message: 'Товар успешно создан',
      product
    })
  } catch (error) {
    console.error('Create product error:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании товара'
    })
  }
})

// Обновление товара (только для администраторов)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Товар не найден'
      })
    }

    res.json({
      success: true,
      message: 'Товар успешно обновлен',
      product
    })
  } catch (error) {
    console.error('Update product error:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      })
    }
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Товар не найден'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении товара'
    })
  }
})

// Удаление товара (только для администраторов)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Товар не найден'
      })
    }

    res.json({
      success: true,
      message: 'Товар успешно удален'
    })
  } catch (error) {
    console.error('Delete product error:', error)
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Товар не найден'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении товара'
    })
  }
})

module.exports = router