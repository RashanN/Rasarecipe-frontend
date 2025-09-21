import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

class CommentService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
    });
    
    // Add token to requests
    this.api.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  // ✅ NEW: Get all comments for admin dashboard
  async getAllComments(searchTerm = '') {
    try {
      console.log('Fetching all comments with search term:', searchTerm);
      const response = await this.api.get('/comments');
      let comments = response.data;
      
      // Filter comments by search term on the frontend if provided
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        comments = comments.filter(comment => 
          comment.content.toLowerCase().includes(lowerSearchTerm) ||
          comment.author?.name?.toLowerCase().includes(lowerSearchTerm) ||
          comment.recipe?.title?.toLowerCase().includes(lowerSearchTerm)
        );
      }
      
      // Transform data to match what the frontend expects
      return comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        recipe_slug: comment.recipe?.slug || 'N/A',
        author_name: comment.author?.name || 'Anonymous',
        created_at: comment.createdAt,
        isApproved: comment.isApproved
      }));
    } catch (error) {
      console.error('Error fetching all comments:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch comments');
    }
  }

  // Get comments by recipe slug
  async getCommentsByRecipe(recipeSlug) {
    try {
      console.log('Fetching comments for slug:', recipeSlug);
      const response = await this.api.get(`/comments/recipe/${recipeSlug}`);
      console.log('Comments response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      console.error('Error details:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch comments');
    }
  }

  // Create a comment
  async createComment(recipeSlug, commentData) {
    try {
      console.log('Creating comment for slug:', recipeSlug, 'Data:', commentData);
      
      // You'll need to get the current user's ID from your auth system
      // This is a placeholder - replace with your actual user ID logic
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }
      
      // Decode token to get user ID or make a separate API call
      // For now, assuming you have a way to get current user ID
      const userId = this.getCurrentUserId(); // You need to implement this
      
      const payload = {
        content: commentData.content,
        authorId: userId
      };
      
      const response = await this.api.post(`/comments/recipe/${recipeSlug}`, payload);
      console.log('Create comment response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      console.error('Error details:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to create comment');
    }
  }

  // Update a comment
  async updateComment(commentId, commentData) {
    try {
      const response = await this.api.put(`/comments/${commentId}`, commentData);
      return response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw new Error(error.response?.data?.message || 'Failed to update comment');
    }
  }

  // Delete a comment
  async deleteComment(commentId) {
    try {
      await this.api.delete(`/comments/${commentId}`);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete comment');
    }
  }

  // Approve a comment
  async approveComment(commentId) {
    try {
      const response = await this.api.put(`/comments/${commentId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving comment:', error);
      throw new Error(error.response?.data?.message || 'Failed to approve comment');
    }
  }

  // Helper method to get current user ID
  // You need to implement this based on your authentication system
  getCurrentUserId() {
    // Option 1: Decode JWT token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.id || payload.userId;
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }
    
    // Option 2: Get from localStorage if stored separately
    const userId = localStorage.getItem('userId');
    if (userId) {
      return parseInt(userId);
    }
    
    // Option 3: Default fallback (you should implement proper user ID retrieval)
    throw new Error('Unable to get current user ID');
  }
}

export default new CommentService();