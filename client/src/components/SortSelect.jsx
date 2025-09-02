import './SortSelect.css'

const SortSelect = ({ onChange }) => {
  const options = [
    { value: '', label: 'По умолчанию' },
    { value: 'price_asc', label: 'Цена по возрастанию' },
    { value: 'price_desc', label: 'Цена по убыванию' },
    { value: 'name_asc', label: 'Название А-Я' },
    { value: 'name_desc', label: 'Название Я-А' }
  ]

  return (
    <div className="sort-select">
      <label htmlFor="sort">Сортировка:</label>
      <select id="sort" onChange={(e) => onChange(e.target.value)}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SortSelect