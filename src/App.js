import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Deals from './pages/Deals';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import { theme } from './theme';

const antdTheme = {
  token: {
    colorPrimary: theme.colors.primary,
    borderRadius: 6,
  },
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/deals" element={
            <PrivateRoute>
              <Deals />
            </PrivateRoute>
          } />
          <Route path="/orders" element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
