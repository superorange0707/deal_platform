import React, { useState } from 'react';
import { Table, Badge, Tag, Space, Button, Card, Row, Col, Statistic, Modal, Typography, Descriptions, message, Avatar, Tooltip, Timeline, Divider } from 'antd';
import { ShoppingOutlined, CheckCircleOutlined, SyncOutlined, ClockCircleOutlined, EyeOutlined, CheckOutlined, LoadingOutlined, DollarOutlined, UserOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import { formatGBP } from '../utils/format';
import Layout from '../components/MainLayout';
import './Orders.css';

const { Title } = Typography;

const Orders = () => {
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Helper function to generate recent dates
  const getRecentDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mock orders data with recent dates
  const mockOrders = [
    {
      id: 'ORD-2024-001',
      deal_title: 'Premium Life Insurance Plan',
      customer_name: 'John Doe',
      customer_email: 'john.doe@example.com',
      amount: 5000.00,
      status: 'pending',
      created_at: getRecentDate(0), // Today
      type: 'insurance',
      insurance_type: 'life',
      coverage: 100000.00
    },
    {
      id: 'ORD-2024-002',
      deal_title: 'Luxury Apartment in Central London',
      customer_name: 'Emma Wilson',
      customer_email: 'emma.w@example.com',
      amount: 450000.00,
      status: 'in_progress',
      created_at: getRecentDate(1), // Yesterday
      type: 'property',
      property_type: 'apartment',
      location: 'Central London'
    },
    {
      id: 'ORD-2024-003',
      deal_title: 'Tesla Model Y Performance',
      customer_name: 'Michael Chen',
      customer_email: 'michael.c@example.com',
      amount: 55000.00,
      status: 'completed',
      created_at: getRecentDate(2), // 2 days ago
      type: 'car',
      make: 'Tesla',
      model: 'Model Y',
      year: 2024
    },
    {
      id: 'ORD-2024-004',
      deal_title: 'Health Insurance Premium Plan',
      customer_name: 'Sarah Johnson',
      customer_email: 's.johnson@example.com',
      amount: 3500.00,
      status: 'pending',
      created_at: getRecentDate(0), // Today
      type: 'insurance',
      insurance_type: 'health',
      coverage: 75000.00
    },
    {
      id: 'ORD-2024-005',
      deal_title: 'Commercial Property Investment',
      customer_name: 'David Brown',
      customer_email: 'd.brown@example.com',
      amount: 750000.00,
      status: 'in_progress',
      created_at: getRecentDate(1), // Yesterday
      type: 'property',
      property_type: 'commercial',
      location: 'Manchester City Centre'
    },
    {
      id: 'ORD-2024-006',
      deal_title: 'BMW X5 M Sport',
      customer_name: 'Lisa Taylor',
      customer_email: 'lisa.t@example.com',
      amount: 65000.00,
      status: 'completed',
      created_at: getRecentDate(3), // 3 days ago
      type: 'car',
      make: 'BMW',
      model: 'X5 M Sport',
      year: 2024
    },
    {
      id: 'ORD-2024-007',
      deal_title: 'Business Insurance Package',
      customer_name: 'Robert Martinez',
      customer_email: 'r.martinez@example.com',
      amount: 8500.00,
      status: 'in_progress',
      created_at: getRecentDate(0), // Today
      type: 'insurance',
      insurance_type: 'business',
      coverage: 250000.00
    },
    {
      id: 'ORD-2024-008',
      deal_title: 'Residential House Sale',
      customer_name: 'Sophie Williams',
      customer_email: 's.williams@example.com',
      amount: 350000.00,
      status: 'pending',
      created_at: getRecentDate(1), // Yesterday
      type: 'property',
      property_type: 'house',
      location: 'Brighton'
    }
  ];

  const handleUpdateStatus = (orderId, newStatus) => {
    message.success(`Order ${orderId} status updated to ${newStatus}`);
    // Here you would typically make an API call to update the status
  };

  const columns = [
    {
      title: 'Order Details',
      dataIndex: 'deal_title',
      key: 'deal_title',
      fixed: 'left',
      width: 300,
      render: (text, record) => (
        <div className="order-info-cell">
          <div className="order-title">
            <span className="order-id">#{record.id}</span>
            {text}
          </div>
          <div className="order-meta">
            <Tag color={
              record.type === 'insurance' ? 'blue' :
              record.type === 'property' ? 'green' :
              'orange'
            }>
              {record.type.toUpperCase()}
            </Tag>
            <span className="order-date">{record.created_at}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customer_name',
      key: 'customer_name',
      width: 200,
      render: (text, record) => (
        <div className="customer-info-cell">
          <Avatar 
            style={{ 
              backgroundColor: stringToColor(text),
              marginRight: '8px'
            }}
          >
            {text.charAt(0)}
          </Avatar>
          <div className="customer-details">
            <div className="customer-name">{text}</div>
            <div className="customer-email">{record.customer_email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (amount) => (
        <div className="amount-cell">
          <span className="amount-value">{formatGBP(amount)}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => {
        const statusConfig = {
          completed: {
            color: '#52c41a',
            icon: <CheckCircleOutlined />,
            text: 'Completed'
          },
          in_progress: {
            color: '#1890ff',
            icon: <SyncOutlined spin />,
            text: 'In Progress'
          },
          pending: {
            color: '#faad14',
            icon: <ClockCircleOutlined />,
            text: 'Pending'
          }
        };

        const config = statusConfig[status];
        return (
          <div className="status-cell">
            <Badge
              status="processing"
              color={config.color}
              text={
                <span className="status-text" style={{ color: config.color }}>
                  {config.icon} {config.text}
                </span>
              }
            />
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space className="action-buttons">
          <Tooltip title="View Details">
            <Button
              type="primary"
              ghost
              icon={<EyeOutlined />}
              className="action-button"
              onClick={() => {
                setSelectedOrder(record);
                setViewModalVisible(true);
              }}
            />
          </Tooltip>
          {record.status !== 'completed' && (
            <>
              <Tooltip title="Set In Progress">
                <Button
                  type="primary"
                  ghost
                  icon={<LoadingOutlined />}
                  className="action-button"
                  disabled={record.status === 'in_progress'}
                  onClick={() => handleUpdateStatus(record.id, 'in_progress')}
                />
              </Tooltip>
              <Tooltip title="Complete">
                <Button
                  type="primary"
                  ghost
                  icon={<CheckOutlined />}
                  className="action-button"
                  onClick={() => handleUpdateStatus(record.id, 'completed')}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Helper function to generate consistent colors from strings
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  };

  // Calculate statistics
  const totalOrders = mockOrders.length;
  const completedOrders = mockOrders.filter(o => o.status === 'completed').length;
  const pendingOrders = mockOrders.filter(o => o.status === 'pending').length;
  const inProgressOrders = mockOrders.filter(o => o.status === 'in_progress').length;

  const statCards = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: <ShoppingOutlined />,
      color: '#1890ff',
      background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)'
    },
    {
      title: 'Completed',
      value: completedOrders,
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
      background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)'
    },
    {
      title: 'In Progress',
      value: inProgressOrders,
      icon: <SyncOutlined spin />,
      color: '#722ed1',
      background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)'
    },
    {
      title: 'Pending',
      value: pendingOrders,
      icon: <ClockCircleOutlined />,
      color: '#faad14',
      background: 'linear-gradient(135deg, #faad14 0%, #d48806 100%)'
    }
  ];

  const renderOrderDetails = (order) => {
    return (
      <div className="order-details-container">
        {/* Order Header */}
        <div className="order-details-header">
          <div className="order-status-badge" style={{
            backgroundColor: order.status === 'completed' ? '#f6ffed' : 
                           order.status === 'in_progress' ? '#e6f7ff' : '#fff7e6',
            color: order.status === 'completed' ? '#52c41a' :
                   order.status === 'in_progress' ? '#1890ff' : '#faad14',
            border: `1px solid ${
              order.status === 'completed' ? '#b7eb8f' :
              order.status === 'in_progress' ? '#91d5ff' : '#ffd591'
            }`
          }}>
            {order.status.toUpperCase()}
          </div>
          <div className="order-id-badge">#{order.id}</div>
        </div>

        {/* Main Info Grid */}
        <div className="order-details-grid">
          <Card className="info-card">
            <div className="info-card-content">
              <DollarOutlined className="info-card-icon" />
              <div className="info-card-data">
                <div className="info-card-label">Amount</div>
                <div className="info-card-value">{formatGBP(order.amount)}</div>
              </div>
            </div>
          </Card>

          <Card className="info-card">
            <div className="info-card-content">
              <UserOutlined className="info-card-icon" />
              <div className="info-card-data">
                <div className="info-card-label">Customer</div>
                <div className="info-card-value">{order.customer_name}</div>
                <div className="info-card-subtitle">{order.customer_email}</div>
              </div>
            </div>
          </Card>

          <Card className="info-card">
            <div className="info-card-content">
              <CalendarOutlined className="info-card-icon" />
              <div className="info-card-data">
                <div className="info-card-label">Created</div>
                <div className="info-card-value">{order.created_at}</div>
              </div>
            </div>
          </Card>

          <Card className="info-card">
            <div className="info-card-content">
              <FileTextOutlined className="info-card-icon" />
              <div className="info-card-data">
                <div className="info-card-label">Deal Type</div>
                <div className="info-card-value">
                  <Tag color={
                    order.type === 'insurance' ? 'blue' :
                    order.type === 'property' ? 'green' : 'orange'
                  }>
                    {order.type.toUpperCase()}
                  </Tag>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Divider />

        {/* Deal Specific Details */}
        <div className="deal-specific-details">
          <Typography.Title level={5}>Deal Details</Typography.Title>
          <div className="details-grid">
            {order.type === 'insurance' && (
              <>
                <div className="detail-item">
                  <span className="detail-label">Insurance Type</span>
                  <span className="detail-value">{order.insurance_type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Coverage Amount</span>
                  <span className="detail-value">{formatGBP(order.coverage)}</span>
                </div>
              </>
            )}
            {order.type === 'property' && (
              <>
                <div className="detail-item">
                  <span className="detail-label">Property Type</span>
                  <span className="detail-value">{order.property_type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{order.location}</span>
                </div>
              </>
            )}
            {order.type === 'car' && (
              <>
                <div className="detail-item">
                  <span className="detail-label">Make</span>
                  <span className="detail-value">{order.make}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Model</span>
                  <span className="detail-value">{order.model}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Year</span>
                  <span className="detail-value">{order.year}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <Divider />

        {/* Order Timeline */}
        <div className="order-timeline">
          <Typography.Title level={5}>Order Timeline</Typography.Title>
          <Timeline>
            <Timeline.Item color="green">
              Order Created<br/>
              <small>{order.created_at}</small>
            </Timeline.Item>
            {order.status === 'in_progress' && (
              <Timeline.Item color="blue">
                Processing Started<br/>
                <small>Processing by team</small>
              </Timeline.Item>
            )}
            {order.status === 'completed' && (
              <>
                <Timeline.Item color="blue">
                  Processing Started<br/>
                  <small>Processing by team</small>
                </Timeline.Item>
                <Timeline.Item color="green">
                  Order Completed<br/>
                  <small>Successfully processed</small>
                </Timeline.Item>
              </>
            )}
          </Timeline>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="orders-container">
        <Title level={2} className="page-title">Orders Management</Title>
        
        {/* Modern Statistics Cards */}
        <Row gutter={16} className="stats-row">
          {statCards.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card 
                className="stat-card"
                style={{ 
                  background: stat.background,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                bordered={false}
              >
                <div className="stat-icon">
                  {React.cloneElement(stat.icon, { style: { fontSize: '24px', color: 'white' } })}
                </div>
                <Statistic 
                  title={<span style={{ color: 'white', opacity: 0.85 }}>{stat.title}</span>}
                  value={stat.value}
                  valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Orders Table Card */}
        <Card 
          className="orders-table-card"
          bordered={false}
          title={<Typography.Title level={4}>Recent Orders</Typography.Title>}
        >
          <Table
            columns={columns}
            dataSource={mockOrders}
            rowKey="id"
            scroll={{ x: 1300 }}
            className="modern-table"
          />
        </Card>

        {/* Updated Modal */}
        <Modal
          title={null}
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={null}
          width={800}
          className="order-details-modal"
        >
          {selectedOrder && renderOrderDetails(selectedOrder)}
        </Modal>
      </div>
    </Layout>
  );
};

export default Orders; 