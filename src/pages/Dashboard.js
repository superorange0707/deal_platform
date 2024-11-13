import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Typography, 
  Tag, 
  Table 
} from 'antd';
import { 
  FileTextOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  DollarCircleOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import '../styles/Dashboard.css';
import axios from 'axios';
import { formatGBP } from '../utils/format';

const { Title } = Typography;

const Dashboard = () => {
  const [deals, setDeals] = useState([]);
  const [stats, setStats] = useState({
    totalDeals: 0,
    approvalRate: 0,
    totalValue: 0,
    calculatedValue: 0
  });
  const [dealTypes, setDealTypes] = useState({});

  // Define status colors with lighter shades
  const statusColors = {
    approved: {
      color: '#f6ffed',        // Light green background
      borderColor: '#b7eb8f',  // Light green border
      textColor: '#52c41a'     // Green text
    },
    pending: {
      color: '#fff7e6',        // Light yellow background
      borderColor: '#ffd591',  // Light yellow border
      textColor: '#fa8c16'     // Orange text
    },
    rejected: {
      color: '#fff1f0',        // Light red background
      borderColor: '#ffa39e',  // Light red border
      textColor: '#f5222d'     // Red text
    }
  };

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No authentication token found');
          return;
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        const response = await axios.get('http://localhost:3001/api/deals', config);
        const dealsData = response.data.deals;
        
        if (Array.isArray(dealsData)) {
          setDeals(dealsData);

          // Calculate stats from real data
          const totalDeals = dealsData.length;
          const approvedDeals = dealsData.filter(deal => deal.status === 'approved').length;
          const approvalRate = totalDeals > 0 ? (approvedDeals / totalDeals) * 100 : 0;

          // Calculate total value (only from approved deals)
          const totalValue = dealsData
            .filter(deal => deal.status === 'approved')
            .reduce((sum, deal) => sum + (deal.amount || 0), 0);

          setStats({
            totalDeals,
            approvalRate: Math.round(approvalRate * 10) / 10,
            totalValue
          });

          // Calculate deal types distribution
          const typeDistribution = dealsData.reduce((acc, deal) => {
            acc[deal.type] = (acc[deal.type] || 0) + 1;
            return acc;
          }, {});
          setDealTypes(typeDistribution);
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
        setDeals([]);
      }
    };

    fetchDeals();
  }, []);

  const columns = [
    {
      title: 'Deal',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div className="deal-title">{text}</div>
          <div className="deal-meta">
            <Tag color={
              record.type === 'insurance' ? 'blue' :
              record.type === 'property' ? 'green' : 'orange'
            }>
              {record.type.toUpperCase()}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => formatGBP(amount),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusStyle = statusColors[status] || {
          color: '#fafafa',
          borderColor: '#d9d9d9',
          textColor: '#8c8c8c'
        };
        
        return (
          <Tag
            style={{
              backgroundColor: statusStyle.color,
              border: `1px solid ${statusStyle.borderColor}`,
              color: statusStyle.textColor,
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500
            }}
          >
            {status.toUpperCase()}
          </Tag>
        );
      },
    }
  ];

  return (
    <MainLayout>
      <div className="dashboard-wrapper">
        <Title level={2} className="page-title">Dashboard Overview</Title>
        
        {/* Summary Statistics */}
        <Row gutter={[24, 24]} className="stats-row">
          <Col xs={24} md={8}>
            <Card 
              className="stat-card total"
              style={{ background: 'linear-gradient(135deg, #e6f7ff 0%, #ffffff 100%)', height: '160px' }}
            >
              <div className="stat-icon">
                <FileTextOutlined style={{ color: '#69c0ff' }}/>
              </div>
              <Statistic 
                title="Total Deals"
                value={stats.totalDeals}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card 
              className="stat-card approval"
              style={{ background: 'linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)', height: '160px' }}
            >
              <div className="stat-icon">
                <CheckCircleOutlined style={{ color: '#95de64' }}/>
              </div>
              <div className="stat-content">
                <Statistic 
                  title="Approval Rate"
                  value={stats.approvalRate}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: '#52c41a' }}
                />
                <Progress 
                  percent={stats.approvalRate} 
                  showInfo={false}
                  strokeColor={{
                    '0%': '#b7eb8f',
                    '100%': '#52c41a'
                  }}
                  className="approval-progress"
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card 
              className="stat-card value"
              style={{ background: 'linear-gradient(135deg, #f9f0ff 0%, #ffffff 100%)', height: '160px' }}
            >
              <div className="stat-icon">
                <DollarCircleOutlined style={{ color: '#b37feb' }}/>
              </div>
              <Statistic 
                title="Total Deal Value"
                value={stats.totalValue}
                prefix="£"
                valueStyle={{ color: '#722ed1' }}
              />
              <div className="value-note">
                (Approved Deals Only)
              </div>
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card 
              title={<Title level={4}>Recent Deals</Title>}
              extra={<Link to="/deals">View All</Link>}
              className="deals-card"
              bordered={false}
            >
              <Table
                columns={columns}
                dataSource={deals.slice(0, 5)} // Show only 5 most recent deals
                pagination={false}
                rowKey="id"
                className="modern-table"
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card 
              title={<Title level={4}>Deal Distribution</Title>}
              className="distribution-card"
              bordered={false}
            >
              {Object.entries(dealTypes).map(([type, count]) => (
                <div key={type} className="distribution-item">
                  <div className="distribution-header">
                    <Tag color={
                      type === 'insurance' ? 'blue' :
                      type === 'property' ? 'green' : 'orange'
                    }>
                      {type.toUpperCase()}
                    </Tag>
                    <span className="distribution-count">{count}</span>
                  </div>
                  <Progress 
                    percent={Math.round((count / stats.totalDeals) * 100)}
                    strokeColor={{
                      '0%': type === 'insurance' ? '#1890ff' :
                             type === 'property' ? '#52c41a' : '#fa8c16',
                      '100%': type === 'insurance' ? '#096dd9' :
                              type === 'property' ? '#389e0d' : '#d46b08'
                    }}
                    showInfo={true}
                  />
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default Dashboard;