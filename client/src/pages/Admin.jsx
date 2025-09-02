import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks/redux' // Добавьте этот импорт
import { selectUser, selectIsAuthenticated } from '../store/slices/authSlice'
import { selectProducts, selectCategories, selectProductsLoading, setProducts, setCategories } from '../store/slices/productsSlice'
import { productsAPI } from '../api/products'
import './Admin.css'

const Admin = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const products = useAppSelector(selectProducts)
  const categories = useAppSelector(selectCategories)
  const loading = useAppSelector(selectProductsLoading)
  
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user && isAdmin()) {
      fetchProducts()
    }
  }, [user])

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll()
      const productsData = Array.isArray(response.data) ? response.data : []
      dispatch(setProducts(productsData))
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Ошибка загрузки товаров')
    }
  }

  const isAdmin = () => {
    return user && user.role === 'admin'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    const token = localStorage.getItem('token')
    const productData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0
    }
    
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct._id, productData, token)
        setSuccess('Товар успешно обновлен')
      } else {
        await productsAPI.create(productData, token)
        setSuccess('Товар успешно добавлен')
      }
      
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        stock: ''
      })
      setEditingProduct(null)
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      setError(error.response?.data?.message || 'Ошибка сохранения товара')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      category: product.category || '',
      image: product.image || '',
      stock: product.stock?.toString() || ''
    })
    setError('')
    setSuccess('')
  }

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await productsAPI.delete(id, localStorage.getItem('token'))
        setSuccess('Товар успешно удален')
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
        setError('Ошибка удаления товара')
      }
    }
  }

  const handleCancel = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      stock: ''
    })
    setError('')
    setSuccess('')
  }

  if (!user || !isAdmin()) {
    return <div className="access-denied">Доступ запрещен</div>
  }

  if (loading) {
    return <div className="loading">Загрузка...</div>
  }

  return (
    <div className="admin">
      <h2>Панель администратора</h2>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <div className="admin-form">
        <h3>{editingProduct ? 'Редактировать товар' : 'Добавить товар'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Название"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Описание"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Цена"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Категория"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="url"
              placeholder="URL изображения"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Количество на складе"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit">
              {editingProduct ? 'Обновить' : 'Добавить'}
            </button>
            {editingProduct && (
              <button type="button" onClick={handleCancel}>
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="products-table">
        <h3>Список товаров ({products.length})</h3>
        {products.length === 0 ? (
          <div className="no-products">Нет товаров</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Категория</th>
                  <th>Цена</th>
                  <th>Количество</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.price} руб.</td>
                    <td>{product.stock}</td>
                    <td>
                      <button 
                        onClick={() => handleEdit(product)}
                        className="edit-btn"
                      >
                        Редактировать
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="delete-btn"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin