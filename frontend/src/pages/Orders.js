import React from 'react';
import { Table, Tag, Space, Typography, Card, Statistic, Row, Col, Button } from 'antd';
import { ShoppingOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';
import { theme } from '../theme';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Orders = () => {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Deal Title',
      dataIndex: 'dealTitle',
      key: 'dealTitle',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'approved' ? 'green' :
          status === 'pending' ? 'gold' : 'red'
        }>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => navigate(`/orders/${record.id}`)}
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  const dummyData = [
    {
      id: '1',
      dealTitle: 'Trade Finance Deal',
      customer: 'Customer A',
      status: 'approved',
      createdAt: '2024-03-15',
    },
    // Add more dummy data for testing
    {
      id: '2',
      dealTitle: 'Supply Chain Finance',
      customer: 'Customer B',
      status: 'pending',
      createdAt: '2024-03-14',
    },
    {
      id: '3',
      dealTitle: 'Asset Finance Deal',
      customer: 'Customer C',
      status: 'rejected',
      createdAt: '2024-03-13',
    }
  ];

  return (
    <MainLayout>
      <div style={{ padding: '20px 0' }}>
        <Title level={2} style={{ color: theme.colors.primary }}>Orders</Title>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Orders"
                value={150}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: theme.colors.primary }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Approved"
                value={89}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Rejected"
                value={32}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        <Table 
          columns={columns} 
          dataSource={dummyData} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </MainLayout>
  );
};

export default Orders; 