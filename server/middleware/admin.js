const admin = (req, res, next) => {
  console.log('User role:', req.user.role) 
  console.log('User:', req.user) 
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Доступ запрещен. Требуются права администратора.' 
    })
  }
  next()
}

module.exports = admin