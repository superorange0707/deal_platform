import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, Table, Tag, Spin } from 'antd';
import { 
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CarOutlined,
  HomeOutlined,
  SafetyOutlined,
  DollarOutlined,
  PercentageOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import MainLayout from '../components/MainLayout';
import { theme } from '../theme';
import api from '../services/api';

const DashboardCard = ({ children, style = {} }) => (
  <Card
    bordered={false}
    style={{
      borderRadius: '15px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
      ...style
    }}
    hoverable
  >
    {children}
  </Card>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalValue: 0,
    approvalRate: 0,
    dealsByStatus: {
      approved: 0,
      pending: 0,
      rejected: 0
    },
    recentDeals: []
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/deals');
      const deals = response.data.deals || [];

      // Calculate total value
      const totalValue = deals.reduce((sum, deal) => sum + Number(deal.amount), 0);

      // Calculate approval rate
      const approvedDeals = deals.filter(deal => deal.status === 'approved').length;
      const approvalRate = deals.length > 0 
        ? Math.round((approvedDeals / deals.length) * 100) 
        : 0;

      // Count deals by status
      const dealsByStatus = {
        approved: deals.filter(deal => deal.status === 'approved').length,
        pending: deals.filter(deal => deal.status === 'pending').length,
        rejected: deals.filter(deal => deal.status === 'rejected').length
      };

      // Get recent deals (last 5)
      const recentDeals = deals
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      setDashboardData({
        totalValue,
        approvalRate,
        dealsByStatus,
        recentDeals
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const columns = [
    {
      title: 'Deal',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const icons = {
          property: <HomeOutlined />,
          car: <CarOutlined />,
          insurance: <SafetyOutlined />
        };
        return (
          <Tag icon={icons[type]} color={type === 'property' ? 'blue' : type === 'car' ? 'green' : 'purple'}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Tag>
        );
      }
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `£${Number(amount).toLocaleString()}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          approved: 'success',
          pending: 'warning',
          rejected: 'error'
        };
        const icons = {
          approved: <CheckCircleOutlined />,
          pending: <ClockCircleOutlined />,
          rejected: <CloseCircleOutlined />
        };
        return (
          <Tag icon={icons[status]} color={colors[status]}>
            {status.toUpperCase()}
          </Tag>
        );
      }
    }
  ];

  const StatisticCard = ({ title, value, prefix, suffix, icon, color }) => (
    <DashboardCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: '#8c8c8c', marginBottom: '8px' }}>{title}</div>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: '600',
            color: theme.colors.text
          }}>
            {prefix}{value.toLocaleString()}{suffix}
          </div>
        </div>
        <div style={{
          padding: '8px',
          borderRadius: '12px',
          background: `${color}15`,
          color: color
        }}>
          {icon}
        </div>
      </div>
    </DashboardCard>
  );

  if (loading) {
    return (
      <MainLayout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: 'calc(100vh - 200px)' 
        }}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Row gutter={[24, 24]}>
        {/* Summary Statistics */}
        <Col xs={24} sm={12} lg={8}>
          <StatisticCard
            title="Total Portfolio Value"
            value={dashboardData.totalValue}
            prefix="£"
            icon={<DollarOutlined style={{ fontSize: '24px' }} />}
            color={theme.colors.primary}
          />
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <StatisticCard
            title="Deal Approval Rate"
            value={dashboardData.approvalRate}
            suffix="%"
            icon={<PercentageOutlined style={{ fontSize: '24px' }} />}
            color={theme.colors.success}
          />
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <StatisticCard
            title="Total Deals"
            value={Object.values(dashboardData.dealsByStatus).reduce((a, b) => a + b, 0)}
            icon={<AppstoreOutlined style={{ fontSize: '24px' }} />}
            color={theme.colors.info}
          />
        </Col>

        {/* Deal Status Distribution */}
        <Col xs={24} lg={12}>
          <DashboardCard>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: theme.colors.text }}>Deal Status Distribution</h2>
            </div>
            <Row gutter={[16, 16]}>
              {Object.entries(dashboardData.dealsByStatus).map(([status, count]) => (
                <Col span={8} key={status}>
                  <div style={{
                    padding: '20px',
                    borderRadius: '12px',
                    background: status === 'approved' ? '#f6ffed' :
                                status === 'pending' ? '#fff7e6' : '#fff1f0',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      color: status === 'approved' ? theme.colors.success :
                             status === 'pending' ? theme.colors.warning :
                             theme.colors.error,
                      marginBottom: '8px'
                    }}>
                      {count}
                    </div>
                    <div style={{ color: '#8c8c8c', textTransform: 'capitalize' }}>
                      {status}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </DashboardCard>
        </Col>

        {/* Recent Deals */}
        <Col xs={24} lg={12}>
          <DashboardCard>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: theme.colors.text }}>Recent Deals</h2>
            </div>
            <Table 
              columns={columns} 
              dataSource={dashboardData.recentDeals}
              pagination={false}
              size="middle"
              rowKey="id"
              style={{ 
                '& .ant-table-thead > tr > th': {
                  background: 'transparent',
                  fontWeight: '600'
                }
              }}
            />
          </DashboardCard>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default Dashboard;