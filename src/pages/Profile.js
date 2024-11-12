import React from 'react';
import { Card, Form, Input, Button, Row, Col, Typography, Divider } from 'antd';
import MainLayout from '../components/MainLayout';
import { theme } from '../theme';

const { Title } = Typography;

const Profile = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Updated profile:', values);
  };

  return (
    <MainLayout>
      <div style={{ padding: '20px 0' }}>
        <Title level={2} style={{ color: theme.colors.primary }}>Profile</Title>

        <Card style={{ maxWidth: 800, margin: '0 auto' }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              username: 'johnsmith',
              email: 'john.smith@example.com',
              company: 'ABC Trading Ltd',
              position: 'Trading Manager',
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[{ required: true }]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, type: 'email' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="company"
                  label="Company"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="position"
                  label="Position"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="newPassword"
                  label="New Password"
                >
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm New Password"
                  dependencies={['newPassword']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ background: theme.colors.primary }}>
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Profile; 