import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Added /api prefix

class CategoriesService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
    });
  }

  async getAllCategories(search = '') {
    try {
      const response = await this.api.get('/categories', {
        params: { search },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  }

  async getCategoryById(id) {
    try {
      const response = await this.api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch category');
    }
  }

  async createCategory(categoryData) {
    try {
      const response = await this.api.post('/categories', categoryData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      const message = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(', ')
        : error.response?.data?.message || 'Failed to create category';
      throw new Error(message);
    }
  }

  async updateCategory(id, categoryData) {
    try {
      const response = await this.api.put(`/categories/${id}`, categoryData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      const message = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(', ')
        : error.response?.data?.message || 'Failed to update category';
      throw new Error(message);
    }
  }

  async deleteCategory(id) {
    try {
      await this.api.delete(`/categories/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
  }
}

export default new CategoriesService();