import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import RecipeView from './components/recipes/RecipeView';
import './App.css';
import AddRecipe from './components/recipes/addRecipe'; 
import RecipesMainView from './components/recipes/RecipesMainView';
import Brands from './components/Brand';
import AboutUs from './components/AboutUs';
import CategoryView from "./components/recipes/CategoryView"; 



// Protected Route component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (requireAdmin && currentUser.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Admin Redirect component
const AdminRedirect = () => {
  const { currentUser } = useAuth();
  
  if (currentUser?.role === 'admin') {
    return <Navigate to="/dashboard" />;
    
  }
  
  return <Home />;
};

function AppContent() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<AdminRedirect />} />
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
       <Route path="/category/:id" element={<CategoryView />} />
           <Route path="/recipes" element={<RecipesMainView />} />
        <Route path="/recipe/:slug" element={<RecipeView />} />
           <Route path="/brands" element={<Brands />} />
           <Route path="/aboutus" element={<AboutUs />} />
         <Route  path="/recipes/add"  element={<ProtectedRoute><AddRecipe />
         </ProtectedRoute>
       } 
      />

      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;