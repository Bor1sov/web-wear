import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: false,
  modalOpen: false,
  modalType: null,
  notification: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    openModal: (state, action) => {
      state.modalOpen = true
      state.modalType = action.payload
    },
    closeModal: (state) => {
      state.modalOpen = false
      state.modalType = null
    },
    showNotification: (state, action) => {
      state.notification = action.payload
    },
    hideNotification: (state) => {
      state.notification = null
    },
  },
})

export const {
  toggleSidebar,
  openModal,
  closeModal,
  showNotification,
  hideNotification,
} = uiSlice.actions

export const selectSidebarOpen = (state) => state.ui.sidebarOpen
export const selectModalOpen = (state) => state.ui.modalOpen
export const selectModalType = (state) => state.ui.modalType
export const selectNotification = (state) => state.ui.notification

export default uiSlice.reducer