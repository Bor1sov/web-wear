import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
  currentProduct: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload
    },
    setCategories: (state, action) => {
      state.categories = action.payload
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    addProduct: (state, action) => {
      state.products.push(action.payload)
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p._id === action.payload._id)
      if (index !== -1) {
        state.products[index] = action.payload
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p._id !== action.payload)
    },
  },
})

export const {
  setProducts,
  setCategories,
  setCurrentProduct,
  setLoading,
  setError,
  clearError,
  addProduct,
  updateProduct,
  deleteProduct,
} = productsSlice.actions

export const selectProducts = (state) => state.products.products
export const selectCategories = (state) => state.products.categories
export const selectProductsLoading = (state) => state.products.loading
export const selectProductsError = (state) => state.products.error
export const selectCurrentProduct = (state) => state.products.currentProduct

export default productsSlice.reducer