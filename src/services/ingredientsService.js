import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Added /api prefix

class IngredientsService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
    });
  }

  async getAllIngredients(search = '') {
    try {
      const response = await this.api.get('/ingredients', {
        params: { search }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch ingredients');
    }
  }

  async getIngredientById(id) {
    try {
      const response = await this.api.get(`/ingredients/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch ingredient');
    }
  }

  async createIngredient(ingredientData) {
    try {
      const response = await this.api.post('/ingredients', ingredientData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create ingredient');
    }
  }

  async updateIngredient(id, ingredientData) {
    try {
      const response = await this.api.put(`/ingredients/${id}`, ingredientData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update ingredient');
    }
  }

  async deleteIngredient(id) {
    try {
      await this.api.delete(`/ingredients/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete ingredient');
    }
  }
}

export default new IngredientsService();