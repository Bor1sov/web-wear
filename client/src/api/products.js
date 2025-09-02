import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Функция для проверки доступности API
const isApiAvailable = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`, {
      timeout: 3000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.status === 200;
  } catch (error) {
    console.warn("API проверка не удалась:", error.message);
    return false;
  }
};

// Функции API
export const productsAPI = {
  getAll: async (params = {}) => {
    try {
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        const response = await axios.get(`${API_URL}/products`, {
          params,
          timeout: 5000,
        });

        // Правильно обрабатываем структуру ответа
        let productsData = [];

        if (Array.isArray(response.data)) {
          productsData = response.data;
        } else if (response.data && Array.isArray(response.data.products)) {
          productsData = response.data.products;
        } else if (response.data && Array.isArray(response.data.data)) {
          productsData = response.data.data;
        }

        console.log("API products response:", productsData);
        return { data: productsData };
      }
    } catch (error) {
      console.error("Error fetching products from API:", error);
    }

    // Fallback на пустой массив
    console.warn("Using empty products array as fallback");
    return { data: [] };
  },

  getById: async (id) => {
    try {
      console.log("Fetching product with ID:", id);
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        const response = await axios.get(`${API_URL}/products/${id}`);
        console.log("Raw API response:", response);

        // Обрабатываем разные форматы ответа
        let productData = null;

        if (response.data) {
          // Вариант 1: { product: {...} }
          if (response.data.product) {
            productData = response.data.product;
          }
          // Вариант 2: { data: {...} }
          else if (response.data.data) {
            productData = response.data.data;
          }
          // Вариант 3: прямой объект товара
          else if (response.data._id || response.data.id) {
            productData = response.data;
          }
          // Вариант 4: { success: true, product: {...} }
          else if (response.data.success && response.data.product) {
            productData = response.data.product;
          }
        }

        console.log("Extracted product data:", productData);
        return { data: productData };
      }
    } catch (error) {
      console.error("Error fetching product from API:", error);
      console.error("Error response:", error.response);

      // Показываем больше информации об ошибке
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      }
    }

    return { data: null };
  },

  getCategories: async () => {
    try {
      const apiAvailable = await isApiAvailable();
      if (apiAvailable) {
        const response = await axios.get(`${API_URL}/products/categories`);

        // Правильно обрабатываем структуру ответа
        let categoriesData = [];

        if (Array.isArray(response.data)) {
          categoriesData = response.data;
        } else if (response.data && Array.isArray(response.data.categories)) {
          categoriesData = response.data.categories;
        } else if (response.data && Array.isArray(response.data.data)) {
          categoriesData = response.data.data;
        }

        console.log("API categories response:", categoriesData);
        return { data: categoriesData };
      }
    } catch (error) {
      console.error("Error fetching categories from API:", error);
    }

    // Fallback на пустой массив
    return { data: [] };
  },

  create: async (product, token) => {
    try {
      const response = await axios.post(`${API_URL}/products`, product, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });
      return response;
    } catch (error) {
      console.error("Error creating product via API:", error);
      throw error;
    }
  },

  update: async (id, product, token) => {
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, product, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });
      return response;
    } catch (error) {
      console.error("Error updating product via API:", error);
      throw error;
    }
  },

  delete: async (id, token) => {
    try {
      const response = await axios.delete(`${API_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });
      return response;
    } catch (error) {
      console.error("Error deleting product via API:", error);
      throw error;
    }
  },
};
