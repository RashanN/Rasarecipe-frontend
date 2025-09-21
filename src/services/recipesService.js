import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

class RecipesService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
    });
    
    
    this.api.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  // Existing methods...
  async getAllRecipes(search = '') {
    try {
      const response = await this.api.get('/recipes', {
        params: { search },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recipes');
    }
  }

  async getRecipeById(id) {
    try {
      const response = await this.api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recipe');
    }
  }

  async getRecipeBySlug(slug) {
    try {
      console.log('Fetching recipe by slug:', slug);
      const response = await this.api.get(`/recipes/slug/${slug}`);
      console.log('Recipe data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching recipe by slug:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch recipe');
    }
  }
  
  async getCategories() {
    try {
      const response = await this.api.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  }

  async getLatestRecipes(limit = 6) {
    try {
      const response = await this.api.get('/recipes', {
        params: { 
          limit,
          sort: 'created_at',
          order: 'DESC',
          approved: 'true' // Only fetch approved recipes for Home page
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch latest recipes');
    }
  }

  async getRecipesByCategory(categoryId, limit = 4) {
    try {
      const response = await this.api.get(`/recipes/category/${categoryId}`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recipes by category');
    }
  }

  // Existing methods...
  async createRecipe(payload) {
    try {
      const formData = new FormData();
      
      Object.keys(payload).forEach(key => {
        if (key === 'ingredients' || key === 'categories') {
          formData.append(key, JSON.stringify(payload[key]));
        } else if (key === 'image' && payload[key] instanceof File) {
          formData.append(key, payload[key]);
        } else if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
          formData.append(key, payload[key]);
        }
      });

      const response = await this.api.post('/recipes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      const message = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(', ')
        : error.response?.data?.message || 'Failed to create recipe';
      throw new Error(message);
    }
  }

  async updateRecipe(id, payload) {
    try {
      const formData = new FormData();
      
      Object.keys(payload).forEach(key => {
        if (key === 'ingredients' || key === 'categories') {
          formData.append(key, JSON.stringify(payload[key]));
        } else if (key === 'image' && payload[key] instanceof File) {
          formData.append(key, payload[key]);
        } else if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
          formData.append(key, payload[key]);
        }
      });

      const response = await this.api.put(`/recipes/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      const message = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(', ')
        : error.response?.data?.message || 'Failed to update recipe';
      throw new Error(message);
    }
  }

  async deleteRecipe(id) {
    try {
      await this.api.delete(`/recipes/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete recipe');
    }
  }

  async approveRecipe(id) {
    try {
      const response = await this.api.put(`/recipes/${id}/approve`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to approve recipe');
    }
  }

  // Helper method to get image URL
  getImageUrl(imagePath, type = 'recipe') {
    if (!imagePath) return '/api/placeholder/300/200';
    
    let cleanPath = imagePath;
    
    // Remove leading slash if present
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.substring(1);
    }
    
    
    if (type === 'recipe') {
      
      if (cleanPath.startsWith('uploads/')) {
        return `${API_BASE_URL.replace('/api', '')}/${cleanPath}`;
      }
      
      return `${API_BASE_URL.replace('/api', '')}/uploads/${cleanPath}`;
    } else {
      
      if (cleanPath.startsWith('uploads/')) {
        return `${API_BASE_URL.replace('/api', '')}/${cleanPath}`;
      }
      return `${API_BASE_URL.replace('/api', '')}/uploads/${cleanPath}`;
    }
  }

  
  getRecipeImageUrl(imagePath) {
    return this.getImageUrl(imagePath, 'recipe');
  }

  
  getCategoryImageUrl(imagePath) {
    return this.getImageUrl(imagePath, 'category');
  }
}

  







export default new RecipesService();