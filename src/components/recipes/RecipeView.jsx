  import React, { useState, useEffect } from 'react';
  import { useParams, Link } from 'react-router-dom';
  import recipeService from '../../services/recipesService';
  import commentService from '../../services/commentService';
  import reactionsService from '../../services/reactionsService';
  import { useAuth } from "../../context/AuthContext";
  import '../recipes/RecipeView.css';

  const RecipeView = () => {
    const { slug } = useParams();
    const { user } = useAuth();
    const [recipe, setRecipe] = useState(null);
    const [comments, setComments] = useState([]);
    const [reactions, setReactions] = useState([]);
    const [recipeReactions, setRecipeReactions] = useState([]);
    const [userReaction, setUserReaction] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const recipeData = await recipeService.getRecipeBySlug(slug);
          setRecipe(recipeData);

          const commentsData = await commentService.getCommentsByRecipe(slug);
          setComments(commentsData);

          // Fetch all reactions
          const reactionsData = await reactionsService.getAllReactions();
          setReactions(reactionsData);

          // Fetch recipe reactions (counts)
          const recipeReactionsData = await reactionsService.getRecipeReactions(recipeData.id);
          setRecipeReactions(recipeReactionsData);

          // TODO: Fetch user's reaction for this recipe (if logged in)
          // This would require a separate endpoint to track user reactions
        } catch (err) {
          setError('Failed to load recipe');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [slug]);

    const handleReactionClick = async (reactionId) => {
      if (!user) {
        alert('Please log in to react to this recipe');
        return;
      }

      try {
        if (userReaction === reactionId) {
          // Remove reaction
          await reactionsService.removeRecipeReaction(recipe.id, reactionId);
          setUserReaction(null);
        } else {
          // Add new reaction (remove old one if exists)
          if (userReaction) {
            await reactionsService.removeRecipeReaction(recipe.id, userReaction);
          }
          await reactionsService.addRecipeReaction(recipe.id, reactionId);
          setUserReaction(reactionId);
        }

        // Refresh recipe reactions
        const updatedReactions = await reactionsService.getRecipeReactions(recipe.id);
        setRecipeReactions(updatedReactions);
      } catch (err) {
        setError('Failed to update reaction');
        console.error(err);
      }
    };

    const getReactionCount = (reactionId) => {
      const reactionDetail = recipeReactions.find(rr => rr.reactionId === reactionId);
      return reactionDetail ? reactionDetail.count : 0;
      
      
    };

    const handleCommentSubmit = async (e) => {
      e.preventDefault();
      if (!newComment.trim()) return;

      try {
        const comment = await commentService.createComment(slug, {
          content: newComment,
          authorId: user.id
        });

        setComments([comment, ...comments]);
        setNewComment('');
      } catch (err) {
        setError('Failed to post comment');
        console.error(err);
      }
    };

    if (loading) return <div className="loading">Loading recipe...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!recipe) return <div className="error">Recipe not found</div>;

    return (
      <div className="recipe-view">
        <header 
          className="recipe-header" 
          style={{ backgroundImage: `url(/uploads/web/2148214536.jpg)` }}
        >
          <div className="header-overlay">
            <h1>{recipe.name}</h1>
          </div>
        </header>

        <div className="recipe-container">
          <div className="recipe-meta">
            <div className="meta-item">
              <span className="meta-label">Published:</span>
              <span className="meta-value">
                {new Date(recipe.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">By:</span>
              <span className="meta-value">{recipe.author?.name || 'Unknown'}</span>
            </div>
            <div className="meta-item categories">
              <span className="meta-label">Categories:</span>
              <div className="categories-list">
                {recipe.recipeCategories?.map(rc => (
                  <span key={rc.category.id} className="category-tag">
                    {rc.category.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Reactions Section */}
            <div className="meta-item reactions">
              <span className="meta-label">Reactions:</span>
              <div className="reactions-list">
                {reactions.map(reaction => (
                  <div 
                    key={reaction.id}
                    className={`reaction-item ${userReaction === reaction.id ? 'active' : ''}`}
                    onClick={() => handleReactionClick(reaction.id)}
                  >
                    <img 
                      src={reactionsService.getReactionImageUrl(reaction.image)} 
                      alt={reaction.name}
                      className="reaction-image"
                    />
                    <span className="reaction-count">
                      {getReactionCount(reaction.id)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="recipe-content">
            <div className="recipe-image-section">
              <img 
                src={recipeService.getRecipeImageUrl(recipe.image)} 
                alt={recipe.name} 
                className="recipe-main-image"
              />
              <div className="cooking-time">
                <i className="clock-icon">⏱</i>
                <span>{recipe.cookingTime} min</span>
              </div>
            </div>

            <section className="ingredients-section">
              <h2>Ingredients</h2>
              <ul className="ingredients-list">
                {recipe.recipeIngredients?.map(ri => (
                  <li key={ri.ingredient.id}>
                    <span className="ingredient-qty">{ri.qty}</span>
                    <span className="ingredient-name">{ri.ingredient.name}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="directions-section">
              <h2>Directions</h2>
              <div className="recipe-content-text">
                {recipe.content}
              </div>
            </section>

            <div className="author-section">
              <div className="author-avatar">
                <img 
                  src={recipe.author?.avatar ? `/uploads/web/gentleman_17924368.png` : '/uploads/web/gentleman_17924368.png'} 
                  alt={recipe.author?.name} 
                />
              </div>
              <div className="author-info">
                <h3>{recipe.author?.name}</h3>
                <p>Recipe Creator</p>
              </div>
            </div>

            <section className="comments-section">
              <h2>Comments ({comments.length})</h2>
              
              {user ? (
                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this recipe..."
                    rows="4"
                  />
                  <button type="submit">Post Comment</button>
                </form>
              ) : (
                <p className="login-to-comment">
                  Please <Link to="/login">log in</Link> to leave a comment.
                </p>
              )}

              <div className="comments-list">
                {comments.length === 0 ? (
                  <p className="no-comments">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="comment">
                      <div className="comment-author">
                        <img 
                          src={comment.author?.avatar ? `/uploads/web/consultation_2475361.png` : '/uploads/web/consultation_2475361.png'} 
                          alt={comment.author?.name} 
                        />
                        <span>{comment.author?.name}</span>
                      </div>
                      <div className="comment-content">
                        <p>{comment.content}</p>
                        <span className="comment-date">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };

  export default RecipeView;