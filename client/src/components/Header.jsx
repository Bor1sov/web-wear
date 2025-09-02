import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { selectCartItemsCount } from '../store/slices/cartSlice'
import { logout, selectUser, selectIsAuthenticated } from '../store/slices/authSlice'
import './Header.css'

const Header = () => {
  const dispatch = useAppDispatch()
  const cartItemsCount = useAppSelector(selectCartItemsCount)
  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const handleLogout = () => {
    dispatch(logout())
  }

  const isAdmin = () => {
    return user && user.role === 'admin'
  }

  return (
    <header>
      <nav>
        <div className="logo">
          <Link to="/">Магазин Одежды</Link>
        </div>
        <div className="nav-links">
          <Link to="/">Главная</Link>
          {isAuthenticated ? (
            <>
              <Link to="/cart">
                Корзина
                {cartItemsCount > 0 && (
                  <span className="cart-count">{cartItemsCount}</span>
                )}
              </Link>
              {isAdmin() && <Link to="/admin">Админ</Link>}
              <span>Добро пожаловать, {user.name}</span>
              <button onClick={handleLogout}>Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login">Вход</Link>
              <Link to="/register">Регистрация</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header