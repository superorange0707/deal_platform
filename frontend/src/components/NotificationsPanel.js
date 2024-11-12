import React from 'react';
import { List, Button, Card, Typography, Tag, Space } from 'antd';
import { CheckOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Text } = Typography;

const NotificationsPanel = ({ notifications, onRead }) => {
  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      onRead(); // Refresh notifications
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_order':
        return <DollarOutlined style={{ color: '#1890ff' }} />;
      case 'pending_approval':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      default:
        return <DollarOutlined style={{ color: '#1890ff' }} />;
    }
  };

  return (
    <Card 
      style={{ 
        width: 350, 
        maxHeight: 400, 
        overflow: 'auto',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16)'
      }}
      title="Notifications"
      extra={
        <Button 
          type="link" 
          size="small"
          onClick={() => {
            // Mark all as read
            notifications
              .filter(n => !n.read)
              .forEach(n => markAsRead(n.id));
          }}
        >
          Mark all as read
        </Button>
      }
    >
      <List
        dataSource={notifications}
        renderItem={item => (
          <List.Item
            style={{ 
              backgroundColor: item.read ? 'transparent' : 'rgba(24,144,255,0.05)',
              padding: '12px'
            }}
            actions={[
              !item.read && (
                <Button
                  type="text"
                  icon={<CheckOutlined />}
                  onClick={() => markAsRead(item.id)}
                  size="small"
                />
              )
            ]}
          >
            <List.Item.Meta
              avatar={getNotificationIcon(item.type)}
              title={
                <Space>
                  <Text strong>{item.title}</Text>
                  {!item.read && <Tag color="blue">New</Tag>}
                </Space>
              }
              description={
                <div>
                  <Text>{item.message}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
        locale={{ emptyText: 'No notifications' }}
      />
    </Card>
  );
};

export default NotificationsPanel; 