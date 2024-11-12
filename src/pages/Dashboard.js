import React from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { FileOutlined, ShoppingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';
import { theme } from '../theme';

const { Title } = Typography;

const Dashboard = () => {
  return (
    <MainLayout>
      <Title level={2} style={{ color: theme.colors.primary, marginBottom: 24 }}>
        Dashboard
      </Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Statistic
              title="Total Deals"
              value={112}
              prefix={<FileOutlined />}
              valueStyle={{ color: theme.colors.primary }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Statistic
              title="Active Orders"
              value={48}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: theme.colors.secondary }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Statistic
              title="Approved Deals"
              value={86}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card 
            title="Recent Deals" 
            style={{ height: '300px' }}
            headStyle={{ color: theme.colors.primary }}
          >
            {/* Add deal list here */}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            title="Recent Orders" 
            style={{ height: '300px' }}
            headStyle={{ color: theme.colors.primary }}
          >
            {/* Add order list here */}
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default Dashboard; 