const express = require('express')
const Order = require('../models/Order')
const Product = require('../models/Product')
const auth = require('../middleware/auth')

const router = express.Router()


router.post('/', auth, async (req, res) => {
  try {
    const { items, total, shippingAddress, paymentMethod } = req.body


    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Заказ должен содержать товары'
      })
    }

    if (!total || total <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Некорректная сумма заказа'
      })
    }


    for (const item of items) {
      const product = await Product.findById(item.product)
      
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Товар с ID ${item.product} не найден`
        })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Недостаточно товара "${product.name}" на складе`
        })
      }


      product.stock -= item.quantity
      await product.save()
    }

 
    const order = await Order.create({
      user: req.user._id,
      items,
      total,
      shippingAddress,
      paymentMethod
    })


    await order.populate('items.product')

    res.status(201).json({
      success: true,
      message: 'Заказ успешно создан',
      order
    })
  } catch (error) {
    console.error('Create order error:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании заказа'
    })
  }
})


router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    
    const query = { user: req.user._id }
    
    if (status) {
      query.status = status
    }

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    const orders = await Order.find(query)
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)

    const total = await Order.countDocuments(query)
    const totalPages = Math.ceil(total / limitNum)

    res.json({
      success: true,
      orders,
      pagination: {
        current: pageNum,
        pages: totalPages,
        total
      }
    })
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении заказов'
    })
  }
})


router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user', 'name email')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Заказ не найден'
      })
    }


    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещен'
      })
    }

    res.json({
      success: true,
      order
    })
  } catch (error) {
    console.error('Get order error:', error)
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Заказ не найден'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении заказа'
    })
  }
})


router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Заказ не найден'
      })
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещен. Требуются права администратора'
      })
    }

    order.status = status
    await order.save()

    res.json({
      success: true,
      message: 'Статус заказа обновлен',
      order
    })
  } catch (error) {
    console.error('Update order status error:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении статуса заказа'
    })
  }
})

module.exports = router