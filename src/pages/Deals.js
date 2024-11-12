import React, { useState } from 'react';
import { 
  Table, Button, Space, Tag, Modal, Form, Input, Select, 
  Typography, Row, Col, DatePicker, Drawer, Input as AntInput,
  message, Popconfirm
} from 'antd';
import { 
  PlusOutlined, FilterOutlined, SearchOutlined, 
  EditOutlined, DeleteOutlined 
} from '@ant-design/icons';
import MainLayout from '../components/MainLayout';
import { theme } from '../theme';

const { Title } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Search } = AntInput;

const Deals = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 30 // This would come from your backend
  });

  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  // Simulated data - in real app, this would come from API
  const [deals, setDeals] = useState([
    {
      id: '1',
      title: 'Trade Finance Deal',
      description: 'Short-term trade finance opportunity',
      status: 'approved',
      createdAt: '2024-03-15',
      type: 'trade',
      amount: '1,000,000',
      currency: 'USD'
    },
    // ... more dummy data
  ]);

  const showDetailsModal = (deal) => {
    setSelectedDeal(deal);
    setDetailsModalVisible(true);
  };

  const columns = [
    {
      title: 'Deal ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      filterable: true,
      render: (text, record) => (
        <a onClick={() => showDetailsModal(record)}>{text}</a>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => `${record.currency} ${text}`,
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Pending', value: 'pending' },
        { text: 'Rejected', value: 'rejected' },
      ],
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
      sorter: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this deal?"
            description="Are you sure you want to delete this deal?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
    // Here you would typically make an API call with the new parameters
    console.log('Table params:', { newPagination, filters, sorter });
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
    // Here you would typically make an API call with the search term
  };

  const handleEdit = (record) => {
    setSelectedDeal(record);
    setIsEditing(true);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (dealId) => {
    // Here you would typically make an API call to delete the deal
    setDeals(deals.filter(deal => deal.id !== dealId));
    message.success('Deal deleted successfully');
  };

  const handleCreateOrUpdate = (values) => {
    if (isEditing) {
      // Update existing deal
      const updatedDeals = deals.map(deal => 
        deal.id === selectedDeal.id ? { ...deal, ...values } : deal
      );
      setDeals(updatedDeals);
      message.success('Deal updated successfully');
    } else {
      // Create new deal
      const newDeal = {
        id: String(deals.length + 1),
        ...values,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      setDeals([...deals, newDeal]);
      message.success('Deal created successfully');
    }
    
    setIsModalVisible(false);
    form.resetFields();
    setIsEditing(false);
    setSelectedDeal(null);
  };

  return (
    <MainLayout>
      <div style={{ padding: '20px 0' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
          <Col>
            <Title level={2} style={{ color: theme.colors.primary, margin: 0 }}>Deals</Title>
          </Col>
          <Col>
            <Space size="middle">
              <Search
                placeholder="Search deals..."
                onSearch={handleSearch}
                style={{ width: 250 }}
                allowClear
              />
              <Button 
                icon={<FilterOutlined />}
                onClick={() => setIsFilterDrawerVisible(true)}
              >
                Filter
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setIsEditing(false);
                  setIsModalVisible(true);
                  form.resetFields();
                }}
                style={{ background: theme.colors.primary }}
              >
                Create Deal
              </Button>
            </Space>
          </Col>
        </Row>

        <Table 
          columns={columns} 
          dataSource={deals}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
        />

        {/* Create/Edit Deal Modal */}
        <Modal
          title={isEditing ? "Edit Deal" : "Create New Deal"}
          open={isModalVisible}
          onOk={() => form.submit()}
          onCancel={() => {
            setIsModalVisible(false);
            setIsEditing(false);
            setSelectedDeal(null);
            form.resetFields();
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateOrUpdate}
          >
            {/* ... existing form items ... */}
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please input deal title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please input deal description!' }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="amount"
                  label="Amount"
                  rules={[{ required: true, message: 'Please input amount!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="currency"
                  label="Currency"
                  rules={[{ required: true, message: 'Please select currency!' }]}
                >
                  <Select>
                    <Select.Option value="USD">USD</Select.Option>
                    <Select.Option value="EUR">EUR</Select.Option>
                    <Select.Option value="GBP">GBP</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="type"
              label="Deal Type"
              rules={[{ required: true, message: 'Please select deal type!' }]}
            >
              <Select>
                <Select.Option value="trade">Trade Finance</Select.Option>
                <Select.Option value="supply">Supply Chain</Select.Option>
                <Select.Option value="asset">Asset Based</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* Deal Details Modal */}
        <Modal
          title="Deal Details"
          open={detailsModalVisible}
          onCancel={() => setDetailsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailsModalVisible(false)}>
              Close
            </Button>
          ]}
        >
          {selectedDeal && (
            <div>
              <p><strong>Deal ID:</strong> {selectedDeal.id}</p>
              <p><strong>Title:</strong> {selectedDeal.title}</p>
              <p><strong>Description:</strong> {selectedDeal.description}</p>
              <p><strong>Amount:</strong> {selectedDeal.currency} {selectedDeal.amount}</p>
              <p><strong>Status:</strong> {selectedDeal.status}</p>
              <p><strong>Type:</strong> {selectedDeal.type}</p>
              <p><strong>Created At:</strong> {selectedDeal.createdAt}</p>
            </div>
          )}
        </Modal>

        {/* ... rest of the components (Filter Drawer, Details Modal) ... */}
      </div>
    </MainLayout>
  );
};

export default Deals;