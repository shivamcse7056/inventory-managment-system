import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import StockLogs from './pages/StockLogs';
import Login from './pages/Login';
import Register from './pages/Register.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-emerald-500">
        <span className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AuthRouteBlock = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-emerald-500">
        <span className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
  
            <Route 
              path="/login" 
              element={
                <AuthRouteBlock>
                  <Login />
                </AuthRouteBlock>
              } 
            />
            <Route 
              path="/register" 
              element={
                <AuthRouteBlock>
                  <Register />
                </AuthRouteBlock>
              } 
            />

            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/products" 
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/categories" 
              element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/logs" 
              element={
                <ProtectedRoute>
                  <StockLogs />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
