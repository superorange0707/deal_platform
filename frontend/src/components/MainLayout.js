import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Typography, Badge, Dropdown, notification } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  LogoutOutlined,
  DollarOutlined,
  BellOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../theme';
import barclaysLogo from '../assets/barclays-logo.png';
import barclaysLogoSmall from '../assets/barclays-logo-small.png';
import api from '../services/api';
import NotificationsPanel from './NotificationsPanel';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: '/deals',
      icon: <DollarOutlined />,
      label: 'Deals'
    },
    {
      key: '/orders',
      icon: <ShoppingOutlined />,
      label: 'Orders'
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile'
    }
  ];

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Fetch every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: theme.colors.white,
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
        }}
        width={260}
      >
        <div style={{
          height: '64px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          background: theme.colors.white
        }}>
          <img 
            src={collapsed ? barclaysLogoSmall : barclaysLogo}
            alt="Barclays Logo" 
            style={{ 
              height: collapsed ? '32px' : '28px',
              maxWidth: '100%',
              objectFit: 'contain'
            }} 
          />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{
            border: 'none',
            background: theme.colors.white
          }}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          theme="light"
          className="custom-menu"
        />
      </Sider>
      <Layout>
        <Header style={{
          padding: '0 24px',
          background: theme.colors.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                color: theme.colors.white
              }}
            />
            <Title level={4} style={{ margin: 0, color: theme.colors.white, marginLeft: 16 }}>
              {menuItems.find(item => item.key === location.pathname)?.label || 'Dashboard'}
            </Title>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Dropdown
              overlay={
                <NotificationsPanel 
                  notifications={notifications}
                  onRead={fetchNotifications}
                />
              }
              trigger={['click']}
              placement="bottomRight"
            >
              <Badge 
                count={notifications.filter(n => !n.read).length}
                offset={[-2, 2]}
              >
                <Button
                  type="text"
                  icon={<BellOutlined style={{ fontSize: '20px' }} />}
                  style={{ 
                    color: theme.colors.white,
                    height: 40,
                    width: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />
              </Badge>
            </Dropdown>

            <Button 
              icon={<LogoutOutlined />}
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
              style={{
                background: theme.colors.white,
                color: theme.colors.primary,
                borderRadius: theme.borderRadius.small,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                height: 36
              }}
            >
              Logout
            </Button>
          </div>
        </Header>
        <Content style={{
          margin: '24px',
          background: theme.colors.background,
          borderRadius: theme.borderRadius.medium,
          padding: '24px'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;