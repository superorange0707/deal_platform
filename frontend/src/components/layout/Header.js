import React, { useState } from 'react';
import { Layout, Button, Badge, Dropdown, Space, Avatar, Menu, Popover } from 'antd';
import { 
  LogoutOutlined, 
  BellOutlined, 
  UserOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const AppHeader = ({ onLogout }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New deal request', read: false },
    { id: 2, message: 'Deal approved', read: false },
    { id: 3, message: 'Compliance check required', read: false },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const notificationContent = (
    <div style={{ width: 300 }}>
      <div style={{ 
        borderBottom: '1px solid #f0f0f0', 
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: 500 }}>Notifications</span>
        {unreadCount > 0 && (
          <Button type="link" size="small" onClick={() => setNotifications(prev => 
            prev.map(n => ({ ...n, read: true }))
          )}>
            Mark all as read
          </Button>
        )}
      </div>
      <Menu
        items={notifications.map(notification => ({
          key: notification.id,
          label: (
            <div style={{ 
              padding: '8px 0',
              opacity: notification.read ? 0.7 : 1,
              backgroundColor: notification.read ? 'transparent' : '#f0f7ff'
            }}>
              <div style={{ fontWeight: notification.read ? 400 : 500 }}>
                {notification.message}
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                2 hours ago
              </div>
            </div>
          ),
          onClick: () => {
            setNotifications(prev =>
              prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
            );
          }
        }))}
      />
      <div style={{ 
        borderTop: '1px solid #f0f0f0', 
        padding: '8px 16px',
        textAlign: 'center' 
      }}>
        <Button type="link" onClick={() => navigate('/notifications')}>
          View All
        </Button>
      </div>
    </div>
  );

  const userMenu = (
    <Menu
      items={[
        {
          key: '1',
          icon: <UserOutlined />,
          label: 'Profile',
          onClick: () => navigate('/profile')
        },
        {
          key: '2',
          icon: <SettingOutlined />,
          label: 'Settings',
          onClick: () => navigate('/settings')
        },
        {
          type: 'divider'
        },
        {
          key: '3',
          icon: <LogoutOutlined />,
          label: 'Logout',
          onClick: onLogout
        },
      ]}
    />
  );

  return (
    <Header style={{
      padding: '0 24px',
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ fontSize: '20px', fontWeight: 500 }}>
        Deal Platform
      </div>
      
      <Space size={24}>
        <Popover 
          content={notificationContent} 
          trigger="click"
          placement="bottomRight"
          overlayStyle={{ width: 300 }}
        >
          <Badge count={unreadCount} offset={[-2, 2]}>
            <Button 
              type="text" 
              icon={<BellOutlined style={{ fontSize: '20px' }} />}
              style={{ height: 40, width: 40 }}
            />
          </Badge>
        </Popover>

        <Dropdown overlay={userMenu} trigger={['click']}>
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <span>John Doe</span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default AppHeader; 