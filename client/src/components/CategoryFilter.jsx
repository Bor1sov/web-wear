import './CategoryFilter.css'

const CategoryFilter = ({ categories, selectedCategory, onChange }) => {
  // Убедимся, что categories всегда является массивом
  const safeCategories = Array.isArray(categories) ? categories : []
  
  return (
    <div className="category-filter">
      <h3>Категории</h3>
      <div className="category-buttons">
        <button
          className={!selectedCategory ? 'active' : ''}
          onClick={() => onChange('')}
        >
          Все товары
        </button>
        {safeCategories.map(category => (
          <button
            key={category}
            className={selectedCategory === category ? 'active' : ''}
            onClick={() => onChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilter