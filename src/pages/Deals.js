import React, { useEffect, useState } from 'react';
import { Table, Button, message, Card, Row, Col, Statistic, Space, Select, Typography, Modal, Popconfirm, Tag, Alert } from 'antd';
import { getDeals, createDeal, updateDeal, deleteDeal } from '../services/dealService';
import api from '../services/api';
import NewDealModal from '../components/deals/NewDealModal';
import MainLayout from '../components/MainLayout';
import { 
  CarOutlined, 
  HomeOutlined, 
  SafetyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  InsuranceOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SendOutlined
} from '@ant-design/icons';

const { Option } = Select;

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [statistics, setStatistics] = useState({
    total: 0,
    property: 0,
    car: 0,
    insurance: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const calculateStatistics = (deals) => {
    const stats = {
      total: deals.length,
      property: deals.filter(deal => deal.type === 'property').length,
      car: deals.filter(deal => deal.type === 'car').length,
      insurance: deals.filter(deal => deal.type === 'insurance').length,
      approved: deals.filter(deal => deal.status === 'approved').length,
      pending: deals.filter(deal => deal.status === 'pending').length,
      rejected: deals.filter(deal => deal.status === 'rejected').length
    };
    setStatistics(stats);
  };

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await getDeals();
      setDeals(response.deals || []);
      calculateStatistics(response.deals || []);
    } catch (error) {
      message.error('Failed to fetch deals');
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleCreateDeal = async (values) => {
    try {
      await createDeal(values);
      message.success('Deal created successfully');
      fetchDeals();
      setModalVisible(false);
    } catch (error) {
      message.error('Failed to create deal');
      console.error('Error creating deal:', error);
    }
  };

  const formatGBP = (value) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(value);
  };

  const filteredDeals = filterType === 'all' 
    ? deals 
    : deals.filter(deal => deal.type === filterType);

  const handleEdit = async (values) => {
    try {
      await updateDeal(selectedDeal.id, {
        ...values,
        id: selectedDeal.id
      });
      message.success('Deal updated successfully');
      setEditModalVisible(false);
      fetchDeals();
    } catch (error) {
      message.error('Failed to update deal');
      console.error('Error updating deal:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDeal(id);
      message.success('Deal deleted successfully');
      fetchDeals();
    } catch (error) {
      message.error('Failed to delete deal');
      console.error('Error deleting deal:', error);
    }
  };

  const handleSendToAI = async (record) => {
    try {
      setAnalyzing(true);
      const response = await api.post(`/deals/${record.id}/analyze`);
      
      if (response.data.status === 'rejected') {
        Modal.error({
          title: 'Deal Rejected',
          content: response.data.feedback,
        });
      } else {
        message.success('Deal approved successfully');
      }
      
      fetchDeals(); // Refresh the deals list
    } catch (error) {
      message.error('Failed to analyze deal');
      console.error('Error:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => type.charAt(0).toUpperCase() + type.slice(1),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => formatGBP(amount),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          approved: '#52c41a',
          pending: '#faad14',
          rejected: '#f5222d'
        };
        return <span style={{ color: colors[status] }}>{status.toUpperCase()}</span>;
      }
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('en-GB'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedDeal(record);
              setViewModalVisible(true);
            }}
          />
          {record.status === 'pending' && (
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedDeal(record);
                setEditModalVisible(true);
              }}
            />
          )}
          {record.status === 'pending' && (
            <Button
              type="text"
              icon={<SendOutlined />}
              loading={analyzing}
              onClick={() => handleSendToAI(record)}
            />
          )}
          <Popconfirm
            title="Are you sure you want to delete this deal?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        {/* Summary Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card 
              bordered={false} 
              className="stat-card"
              style={{ 
                borderRadius: '15px',
                background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Statistic
                title={<span style={{ color: 'white', fontSize: '16px', fontWeight: 500 }}>Total Deals</span>}
                value={statistics.total}
                valueStyle={{ color: 'white', fontSize: '24px' }}
                prefix={<SafetyOutlined style={{ fontSize: '24px' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card 
              bordered={false}
              className="stat-card"
              style={{ 
                borderRadius: '15px',
                background: 'linear-gradient(135deg, #13c2c2, #87e8de)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Statistic
                title={<span style={{ color: 'white', fontSize: '16px', fontWeight: 500 }}>Property Deals</span>}
                value={statistics.property}
                valueStyle={{ color: 'white', fontSize: '24px' }}
                prefix={<HomeOutlined style={{ fontSize: '24px' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card 
              bordered={false}
              className="stat-card"
              style={{ 
                borderRadius: '15px',
                background: 'linear-gradient(135deg, #722ed1, #b37feb)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Statistic
                title={<span style={{ color: 'white', fontSize: '16px', fontWeight: 500 }}>Car Deals</span>}
                value={statistics.car}
                valueStyle={{ color: 'white', fontSize: '24px' }}
                prefix={<CarOutlined style={{ fontSize: '24px' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card 
              bordered={false}
              className="stat-card"
              style={{ 
                borderRadius: '15px',
                background: 'linear-gradient(135deg, #eb2f96, #ff85c0)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Statistic
                title={<span style={{ color: 'white', fontSize: '16px', fontWeight: 500 }}>Insurance Deals</span>}
                value={statistics.insurance}
                valueStyle={{ color: 'white', fontSize: '24px' }}
                prefix={<SafetyOutlined style={{ fontSize: '24px' }} />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={8}>
            <Card 
              bordered={false}
              className="stat-card"
              style={{ 
                borderRadius: '15px',
                background: 'linear-gradient(135deg, #52c41a, #95de64)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Statistic
                title={<span style={{ color: 'white', fontSize: '16px', fontWeight: 500 }}>Approved</span>}
                value={statistics.approved}
                valueStyle={{ color: 'white', fontSize: '24px' }}
                prefix={<CheckCircleOutlined style={{ fontSize: '24px' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card 
              bordered={false}
              className="stat-card"
              style={{ 
                borderRadius: '15px',
                background: 'linear-gradient(135deg, #faad14, #ffd666)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Statistic
                title={<span style={{ color: 'white', fontSize: '16px', fontWeight: 500 }}>Pending</span>}
                value={statistics.pending}
                valueStyle={{ color: 'white', fontSize: '24px' }}
                prefix={<ClockCircleOutlined style={{ fontSize: '24px' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card 
              bordered={false}
              className="stat-card"
              style={{ 
                borderRadius: '15px',
                background: 'linear-gradient(135deg, #f5222d, #ff7875)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Statistic
                title={<span style={{ color: 'white', fontSize: '16px', fontWeight: 500 }}>Rejected</span>}
                value={statistics.rejected}
                valueStyle={{ color: 'white', fontSize: '24px' }}
                prefix={<CloseCircleOutlined style={{ fontSize: '24px' }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* Table Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Typography.Title level={2}>Deals</Typography.Title>
          <Space>
            <Select 
              defaultValue="all" 
              style={{ width: 120 }} 
              onChange={setFilterType}
            >
              <Option value="all">All Types</Option>
              <Option value="property">Property</Option>
              <Option value="car">Car</Option>
              <Option value="insurance">Insurance</Option>
            </Select>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setModalVisible(true)}
            >
              New Deal
            </Button>
          </Space>
        </div>

        {/* Deals Table */}
        <Card>
          <Table 
            dataSource={filteredDeals}
            columns={columns}
            loading={loading}
            rowKey="id"
          />
        </Card>

        {/* View Modal */}
        <Modal
          title="View Deal"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setViewModalVisible(false)}>
              Close
            </Button>
          ]}
        >
          {selectedDeal && (
            <div>
              <p><strong>Title:</strong> {selectedDeal.title}</p>
              <p><strong>Type:</strong> {selectedDeal.type}</p>
              <p><strong>Description:</strong> {selectedDeal.description}</p>
              <p><strong>Amount:</strong> {formatGBP(selectedDeal.amount)}</p>
              <p><strong>Status:</strong> <Tag color={
                selectedDeal.status === 'approved' ? 'green' : 
                selectedDeal.status === 'rejected' ? 'red' : 
                'gold'
              }>
                {selectedDeal.status.toUpperCase()}
              </Tag></p>
              
              {/* Add type-specific details */}
              {selectedDeal.type === 'insurance' && (
                <>
                  <p><strong>Insurance Type:</strong> {selectedDeal.insurance_type}</p>
                  <p><strong>Coverage Amount:</strong> {formatGBP(selectedDeal.coverage)}</p>
                </>
              )}
              {selectedDeal.type === 'property' && (
                <>
                  <p><strong>Property Type:</strong> {selectedDeal.property_type}</p>
                  <p><strong>Location:</strong> {selectedDeal.location}</p>
                </>
              )}
              {selectedDeal.type === 'car' && (
                <>
                  <p><strong>Make:</strong> {selectedDeal.make}</p>
                  <p><strong>Model:</strong> {selectedDeal.model}</p>
                  <p><strong>Year:</strong> {selectedDeal.year}</p>
                </>
              )}

              {/* Add rejection reason if status is rejected */}
              {selectedDeal.status === 'rejected' && selectedDeal.ai_feedback && (
                <div style={{ marginTop: '16px' }}>
                  <Alert
                    message="Rejection Reason"
                    description={selectedDeal.ai_feedback}
                    type="error"
                    showIcon
                  />
                </div>
              )}
              
              <p><strong>Created At:</strong> {new Date(selectedDeal.createdAt).toLocaleDateString('en-GB')}</p>
            </div>
          )}
        </Modal>

        {/* Edit Modal */}
        <NewDealModal
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          onSubmit={handleEdit}
          initialValues={selectedDeal}
          isEditing={true}
        />

        {/* Existing NewDealModal */}
        <NewDealModal 
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSubmit={handleCreateDeal}
        />
      </div>
    </MainLayout>
  );
};

export default Deals;
 