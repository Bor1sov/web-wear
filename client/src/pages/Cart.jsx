import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { 
  selectCartItems, 
  updateQuantity, 
  removeFromCart, 
  selectCartTotal, 
  clearCart 
} from '../store/slices/cartSlice'
import { selectIsAuthenticated } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { ordersAPI } from '../api/orders'
import './Cart.css'

const Cart = () => {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setProcessing(true)
    setError('')
    
    try {
      const order = {
        items: items.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        total: total
      }

      await ordersAPI.create(order, localStorage.getItem('token'))
      dispatch(clearCart())
      alert('Заказ успешно оформлен!')
      navigate('/')
    } catch (error) {
      console.error('Error creating order:', error)
      setError(error.response?.data?.message || 'Ошибка при оформлении заказа')
    } finally {
      setProcessing(false)
    }
  }

  const handleQuantityChange = (id, change) => {
    const item = items.find(item => item._id === id)
    if (item) {
      const newQuantity = item.quantity + change
      if (newQuantity >= 1) {
        dispatch(updateQuantity({ id, quantity: newQuantity }))
      }
    }
  }

  const handleRemove = (id) => {
    dispatch(removeFromCart(id))
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Корзина пуста</h2>
        <p>Добавьте товары в корзину, чтобы продолжить покупки</p>
        <button onClick={() => navigate('/')}>Вернуться к покупкам</button>
      </div>
    )
  }

  return (
    <div className="cart">
      <h2>Корзина</h2>
      {error && <div className="error">{error}</div>}
      <div className="cart-items">
        {items.map(item => (
          <div key={item._id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="item-category">{item.category}</p>
              <p className="item-price">{item.price} руб.</p>
            </div>
            <div className="quantity-controls">
              <button 
                onClick={() => handleQuantityChange(item._id, -1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => handleQuantityChange(item._id, 1)}
                disabled={item.quantity >= 10}
              >
                +
              </button>
            </div>
            <div className="item-total">{item.price * item.quantity} руб.</div>
            <button 
              className="remove-btn"
              onClick={() => handleRemove(item._id)}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Итого: {total} руб.</h3>
        <button 
          className="checkout-btn" 
          onClick={handleCheckout}
          disabled={processing}
        >
          {processing ? 'Обработка...' : 'Оформить заказ'}
        </button>
      </div>
    </div>
  )
}

export default Cart