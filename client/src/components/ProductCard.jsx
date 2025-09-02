import { Link } from 'react-router-dom'
import { useAppDispatch } from '../hooks/redux'
import { addToCart } from '../store/slices/cartSlice'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const dispatch = useAppDispatch()

  // Защита от отсутствующих свойств
  if (!product) {
    return null
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart(product))
  }

  return (
    <div className="product-card">
      <Link to={`/product/${product._id || product.id || '1'}`}>
        <div className="product-image">
          <img 
            src={product.image || 'https://via.placeholder.com/300x400?text=Нет+изображения'} 
            alt={product.name || 'Товар'} 
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x400?text=Нет+изображения'
            }}
          />
        </div>
        <div className="product-info">
          <h3>{product.name || 'Без названия'}</h3>
          <p className="product-category">{product.category || 'Без категории'}</p>
          <p className="product-price">{product.price ? `${product.price} руб.` : 'Цена не указана'}</p>
          <p className="product-stock">
            {product.stock > 0 ? `В наличии: ${product.stock}` : 'Нет в наличии'}
          </p>
        </div>
      </Link>
      <button 
        onClick={handleAddToCart}
        disabled={!product.stock || product.stock === 0}
        className="add-to-cart-btn"
      >
        {product.stock > 0 ? 'В корзину' : 'Нет в наличии'}
      </button>
    </div>
  )
}

export default ProductCard