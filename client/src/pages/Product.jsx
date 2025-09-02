import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../hooks/redux'
import { addToCart } from '../store/slices/cartSlice'
import { productsAPI } from '../api/products'
import './Product.css'

const Product = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('Product ID from URL:', id)
    
    const fetchProduct = async () => {
      try {
        setLoading(true)
        console.log('Fetching product from API...')
        
        const response = await productsAPI.getById(id)
        console.log('API response:', response)
        console.log('Product data:', response.data)
        
        if (response.data) {
          setProduct(response.data)
        } else {
          setError('Товар не найден в ответе API')
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching product:', error)
        setError('Ошибка загрузки товара: ' + error.message)
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    } else {
      setError('ID товара не указан')
      setLoading(false)
    }
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity }))
      navigate('/cart')
    }
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="product-page">
        <div className="loading">Загрузка товара...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="product-page">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/')}>Вернуться на главную</button>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-page">
        <div className="not-found">Товар не найден</div>
        <button onClick={() => navigate('/')}>Вернуться на главную</button>
      </div>
    )
  }

  console.log('Rendering product:', product)

  return (
    <div className="product-page">
      <div className="breadcrumb">
        <button onClick={() => navigate('/')}>Главная</button> 
        {product.category && <span> / {product.category}</span>}
        <span> / {product.name}</span>
      </div>
      
      <div className="product-details">
        <div className="product-image">
          <img 
            src={product.image || 'https://via.placeholder.com/400x500?text=Нет+изображения'} 
            alt={product.name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x500?text=Ошибка+загрузки'
            }}
          />
        </div>
        
        <div className="product-info">
          <h1>{product.name || 'Без названия'}</h1>
          <p className="product-id">ID: {product._id || product.id}</p>
          <p className="product-price">
            {product.price ? `${product.price} руб.` : 'Цена не указана'}
          </p>
          
          {product.description && (
            <p className="product-description">{product.description}</p>
          )}
          
          <div className="product-stock">
            {product.stock > 0 ? `В наличии: ${product.stock} шт.` : 'Нет в наличии'}
          </div>
          
          {product.stock > 0 && (
            <>
              <div className="quantity-selector">
                <button onClick={() => handleQuantityChange(-1)}>-</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>
              
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Добавить в корзину
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Product