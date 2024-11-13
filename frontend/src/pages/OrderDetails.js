import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, Descriptions, Button, Timeline, Steps, Row, Col, 
  Tag, Space, Modal, Form, Input, message, Select 
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  DollarOutlined
} from '@ant-design/icons';
import MainLayout from '../components/MainLayout';
import { theme } from '../theme';

const { TextArea } = Input;

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Dummy order data - would come from API in real app
  const orderData = {
    id: id,
    dealTitle: 'Trade Finance Deal',
    customer: 'ABC Trading Ltd',
    status: 'in_progress',
    amount: '500,000',
    currency: 'USD',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-16',
    description: 'Short-term trade finance deal for import/export',
    timeline: [
      {
        time: '2024-03-15 09:00',
        title: 'Order Created',
        description: 'Order submitted by customer'
      },
      {
        time: '2024-03-15 14:30',
        title: 'Documents Received',
        description: 'All required documents received'
      },
      {
        time: '2024-03-16 10:15',
        title: 'Under Review',
        description: 'Order is being reviewed by the finance team'
      }
    ]
  };

  const handleStatusUpdate = (values) => {
    console.log('Status update:', values);
    message.success('Order status updated successfully');
    setIsUpdateModalVisible(false);
    form.resetFields();
  };

  const getStatusStep = (status) => {
    const steps = {
      'pending': 0,
      'in_progress': 1,
      'approved': 2,
      'completed': 3,
      'rejected': 4
    };
    return steps[status] || 0;
  };

  return (
    <MainLayout>
      <div style={{ padding: '20px 0' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header Section */}
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Button onClick={() => navigate('/orders')}>Back</Button>
                <h2 style={{ margin: 0, color: theme.colors.primary }}>
                  Order #{id}
                </h2>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button onClick={() => setIsUpdateModalVisible(true)}>
                  Update Status
                </Button>
                <Button type="primary" style={{ background: theme.colors.primary }}>
                  Download Documents
                </Button>
              </Space>
            </Col>
          </Row>

          {/* Order Details Card */}
          <Card title="Order Information">
            <Descriptions bordered>
              <Descriptions.Item label="Order ID">{orderData.id}</Descriptions.Item>
              <Descriptions.Item label="Deal Title">{orderData.dealTitle}</Descriptions.Item>
              <Descriptions.Item label="Customer">{orderData.customer}</Descriptions.Item>
              <Descriptions.Item label="Amount">
                {orderData.currency} {orderData.amount}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={
                  orderData.status === 'approved' ? 'green' :
                  orderData.status === 'in_progress' ? 'blue' :
                  orderData.status === 'rejected' ? 'red' : 'gold'
                }>
                  {orderData.status.toUpperCase().replace('_', ' ')}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created At">{orderData.createdAt}</Descriptions.Item>
              <Descriptions.Item label="Description" span={3}>
                {orderData.description}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Progress Steps */}
          <Card title="Order Progress">
            <Steps
              current={getStatusStep(orderData.status)}
              items={[
                {
                  title: 'Submitted',
                  icon: <FileTextOutlined />
                },
                {
                  title: 'In Progress',
                  icon: <ClockCircleOutlined />
                },
                {
                  title: 'Approved',
                  icon: <CheckCircleOutlined />
                },
                {
                  title: 'Completed',
                  icon: <DollarOutlined />
                }
              ]}
            />
          </Card>

          {/* Timeline Card */}
          <Card title="Order Timeline">
            <Timeline
              items={orderData.timeline.map(item => ({
                children: (
                  <>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{item.title}</p>
                    <p style={{ margin: 0 }}>{item.description}</p>
                    <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.45)' }}>{item.time}</p>
                  </>
                )
              }))}
            />
          </Card>
        </Space>

        {/* Status Update Modal */}
        <Modal
          title="Update Order Status"
          open={isUpdateModalVisible}
          onOk={() => form.submit()}
          onCancel={() => setIsUpdateModalVisible(false)}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleStatusUpdate}
          >
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="in_progress">In Progress</Select.Option>
                <Select.Option value="approved">Approved</Select.Option>
                <Select.Option value="completed">Completed</Select.Option>
                <Select.Option value="rejected">Rejected</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="comment"
              label="Comment"
            >
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default OrderDetails; 