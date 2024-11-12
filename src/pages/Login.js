import React from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Login values:', values);
    localStorage.setItem('token', 'dummy-token');
    navigate('/');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: theme.colors.background,
      padding: '20px'
    }}>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          color: theme.colors.primary 
        }}>
          <Title level={2} style={{ color: theme.colors.primary }}>
            Deal Platform
          </Title>
          <Typography.Text style={{ fontSize: '16px' }}>
            Welcome back! Please login to your account.
          </Typography.Text>
        </div>
        <Card
          style={{
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderRadius: '8px'
          }}
        >
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: theme.colors.primary }} />}
                placeholder="Username"
                size="large"
                style={{ borderRadius: '6px' }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: theme.colors.primary }} />}
                placeholder="Password"
                size="large"
                style={{ borderRadius: '6px' }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{
                  width: '100%',
                  background: theme.colors.primary,
                  borderRadius: '6px',
                  height: '45px'
                }}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default Login; 