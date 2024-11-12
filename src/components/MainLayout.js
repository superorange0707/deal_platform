import React, { useState } from 'react';
import { Layout, Menu, Button, Typography } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  FileOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../theme';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/'),
    },
    {
      key: '/deals',
      icon: <FileOutlined />,
      label: 'Deals',
      onClick: () => navigate('/deals'),
    },
    {
      key: '/orders',
      icon: <ShoppingOutlined />,
      label: 'Orders',
      onClick: () => navigate('/orders'),
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{ 
          background: theme.colors.primary 
        }}
      >
        <div style={{ 
          height: 64, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.colors.white,
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          {!collapsed && 'Deal Platform'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ 
            background: theme.colors.primary 
          }}
        />
      </Sider>
      <Layout>
        <Header style={{
          padding: 0,
          background: theme.colors.white,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ 
              fontSize: '16px', 
              width: 64, 
              height: 64,
              color: theme.colors.primary
            }}
          />
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ 
              marginRight: 16,
              color: theme.colors.primary
            }}
          >
            Logout
          </Button>
        </Header>
        <Content style={{ 
          margin: '24px 16px',
          padding: 24,
          background: theme.colors.white,
          borderRadius: '8px',
          minHeight: 280
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 