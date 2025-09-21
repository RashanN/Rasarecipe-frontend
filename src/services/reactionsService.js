import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

class ReactionsService {
  constructor() {
    this.api = axios.create({ baseURL: API_BASE_URL });

    this.api.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  // ===== USER REACTIONS =====

  async getRecipeReactions(recipeId) {
    try {
      const response = await this.api.get(`/reactions/recipe/${recipeId}`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to fetch recipe reactions');
    }
  }

  async addRecipeReaction(recipeId, reactionId) {
    try {
      const response = await this.api.post(`/reactions/recipe/${recipeId}/react/${reactionId}`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add reaction');
    }
  }

  async removeRecipeReaction(recipeId, reactionId) {
    try {
      const response = await this.api.delete(`/reactions/recipe/${recipeId}/react/${reactionId}`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to remove reaction');
    }
  }

  async getAllReactions() {
    try {
      const response = await this.api.get('/reactions');
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to fetch reactions');
    }
  }

  // ===== ADMIN PANEL (CRUD) =====

  async createReaction(payload) {
    try {
      const response = await this.api.post('/reactions', payload);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create reaction');
    }
  }

  async updateReaction(id, payload) {
    try {
      const response = await this.api.put(`/reactions/${id}`, payload);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update reaction');
    }
  }

  async deleteReaction(id) {
    try {
      const response = await this.api.delete(`/reactions/${id}`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete reaction');
    }
  }

  async searchReactionByName(name) {
    try {
      const response = await this.api.get(`/reactions/search?name=${name}`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to search reactions');
    }
  }

  // ===== HELPER =====

  getReactionImageUrl(imagePath) {
    if (!imagePath) return '/api/placeholder/30/30';

    let cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    if (!cleanPath.startsWith('uploads/')) cleanPath = `uploads/${cleanPath}`;
    return `${API_BASE_URL.replace('/api', '')}/${cleanPath}`;
  }
}

export default new ReactionsService();
