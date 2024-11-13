import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Input, Button, message, Spin } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';
import { theme } from '../theme';
import api from '../services/api';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const user_id = localStorage.getItem('user_id');
      const response = await api.get(`/users/${user_id}`);
      setUserData(response.data);
    } catch (error) {
      message.error('Failed to fetch user data');
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (values) => {
    try {
      setSaving(true);
      await api.put('/users/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      message.success('Password updated successfully');
      passwordForm.resetFields();
    } catch (error) {
      message.error('Failed to update password');
      console.error('Error updating password:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Row gutter={[24, 24]}>
        {/* User Info Card */}
        <Col xs={24} md={12}>
          <Card
            title={
              <div style={{ 
                color: theme.colors.primary, 
                fontSize: theme.typography.fontSize.large,
                fontWeight: theme.typography.fontWeight.medium 
              }}>
                User Information
              </div>
            }
            bordered={false}
            style={{
              borderRadius: theme.borderRadius.large,
              boxShadow: theme.boxShadow.medium
            }}
          >
            <div style={{ padding: theme.spacing.medium }}>
              <div style={{ marginBottom: theme.spacing.large }}>
                <div style={{ color: theme.colors.text.light }}>Username</div>
                <div style={{ 
                  fontSize: theme.typography.fontSize.medium,
                  color: theme.colors.text.primary,
                  fontWeight: theme.typography.fontWeight.medium
                }}>
                  {userData?.username}
                </div>
              </div>

              <div>
                <div style={{ color: theme.colors.text.light }}>Full Name</div>
                <div style={{ 
                  fontSize: theme.typography.fontSize.medium,
                  color: theme.colors.text.primary,
                  fontWeight: theme.typography.fontWeight.medium
                }}>
                  {userData?.fullName}
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Change Password Card */}
        <Col xs={24} md={12}>
          <Card
            title={
              <div style={{ 
                color: theme.colors.primary, 
                fontSize: theme.typography.fontSize.large,
                fontWeight: theme.typography.fontWeight.medium 
              }}>
                Change Password
              </div>
            }
            bordered={false}
            style={{
              borderRadius: theme.borderRadius.large,
              boxShadow: theme.boxShadow.medium
            }}
          >
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={onChangePassword}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true, message: 'Please enter your current password' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: theme.colors.primary }} />}
                  placeholder="Enter current password"
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter your new password' },
                  { min: 8, message: 'Password must be at least 8 characters' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: theme.colors.primary }} />}
                  placeholder="Enter new password"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your new password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: theme.colors.primary }} />}
                  placeholder="Confirm new password"
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={saving}
                  style={{
                    background: theme.colors.primary,
                    borderColor: theme.colors.primary
                  }}
                >
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default Profile;