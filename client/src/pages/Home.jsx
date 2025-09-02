import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { 
  selectProducts, 
  selectCategories, 
  selectProductsLoading, 
  selectProductsError,
  setProducts,
  setCategories,
  setLoading,
  setError
} from '../store/slices/productsSlice'
import { productsAPI } from '../api/products'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import SortSelect from '../components/SortSelect'
import CategoryFilter from '../components/CategoryFilter'
import './Home.css'

const Home = () => {
  const dispatch = useAppDispatch()
  const products = useAppSelector(selectProducts)
  const categories = useAppSelector(selectCategories)
  const loading = useAppSelector(selectProductsLoading)
  const error = useAppSelector(selectProductsError)
  
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortOption, setSortOption] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true))
        const [productsResponse, categoriesResponse] = await Promise.all([
          productsAPI.getAll(),
          productsAPI.getCategories()
        ])
        
        const productsData = productsResponse.data || []
        const categoriesData = categoriesResponse.data || []
        
        dispatch(setProducts(productsData))
        dispatch(setCategories(categoriesData))
        setFilteredProducts(productsData)
        dispatch(setLoading(false))
      } catch (error) {
        console.error('Error fetching data:', error)
        dispatch(setError('Ошибка загрузки данных'))
        dispatch(setLoading(false))
      }
    }

    fetchData()
  }, [dispatch])

  useEffect(() => {
    let result = products

    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term))
      )
    }

    if (sortOption === 'price_asc') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sortOption === 'price_desc') {
      result = [...result].sort((a, b) => b.price - a.price)
    } else if (sortOption === 'name_asc') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortOption === 'name_desc') {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name))
    }

    setFilteredProducts(result)
  }, [products, selectedCategory, searchTerm, sortOption])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  const handleSortChange = (option) => {
    setSortOption(option)
  }

  if (loading) {
    return <div className="loading">Загрузка товаров...</div>
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Попробовать снова
        </button>
      </div>
    )
  }

  return (
    <div className="home">
      <div className="filters">
        <SearchBar onSearch={handleSearch} />
        <SortSelect onChange={handleSortChange} />
        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory}
          onChange={handleCategoryChange}
        />
      </div>
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="no-products">
            {products.length === 0 ? 'Нет товаров' : 'Товары не найдены'}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home