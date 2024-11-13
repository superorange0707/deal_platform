import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, message, Upload, Button, Space } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Dragger } = Upload;

const NewDealModal = ({ visible, onCancel, onSubmit, initialValues, isEditing }) => {
  const [form] = Form.useForm();
  const [dealType, setDealType] = useState(initialValues?.type || 'property');
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && initialValues && isEditing) {
      form.setFieldsValue(initialValues);
    } else if (!visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  // Currency formatter for GBP
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '';
    return `£${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Currency parser to remove GBP symbol and commas
  const parseCurrency = (value) => {
    if (typeof value === 'string') {
      return value.replace(/£\s?|(,*)/g, '');
    }
    return value;
  };

  // Insurance type options
  const insuranceTypes = [
    { label: 'Life Insurance', value: 'life' },
    { label: 'Health Insurance', value: 'health' },
    { label: 'Property Insurance', value: 'property_insurance' },
    { label: 'Car Insurance', value: 'car_insurance' },
    { label: 'Business Insurance', value: 'business' }
  ];

  const handleTypeChange = (value) => {
    setDealType(value);
    // Reset type-specific fields when type changes
    form.setFieldsValue({
      insurance_type: undefined,
      coverage: undefined,
      property_type: undefined,
      location: undefined,
      make: undefined,
      model: undefined,
      year: undefined
    });
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Validate insurance-specific fields
      if (values.type === 'insurance' && (!values.insurance_type || !values.coverage)) {
        message.error('Please fill in all required insurance fields');
        return;
      }

      await onSubmit(values);
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: 'images',
    multiple: true,
    fileList: fileList,
    beforeUpload: (file) => {
      // Prevent automatic upload
      return false;
    },
    onChange: ({ fileList }) => {
      setFileList(fileList);
    },
  };

  return (
    <Modal
      title={isEditing ? "Edit Deal" : "New Deal"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={() => form.submit()}
        >
          {isEditing ? 'Update' : 'Create'}
        </Button>
      ]}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="type"
          label="Deal Type"
          rules={[{ required: true, message: 'Please select a deal type' }]}
        >
          <Select onChange={handleTypeChange}>
            <Option value="property">Property</Option>
            <Option value="car">Car</Option>
            <Option value="insurance">Insurance</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: 'Please enter an amount' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={formatCurrency}
            parser={parseCurrency}
            min={0}
            precision={2}
          />
        </Form.Item>

        {dealType === 'insurance' && (
          <>
            <Form.Item
              name="insurance_type"
              label="Insurance Type"
              rules={[{ required: true, message: 'Please select insurance type' }]}
            >
              <Select>
                {insuranceTypes.map(type => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="coverage"
              label="Coverage Amount"
              rules={[{ required: true, message: 'Please enter coverage amount' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={formatCurrency}
                parser={parseCurrency}
                min={0}
                precision={2}
              />
            </Form.Item>
          </>
        )}

        {dealType === 'property' && (
          <>
            <Form.Item
              name="propertyType"
              label="Property Type"
              rules={[{ required: true, message: 'Please select property type' }]}
            >
              <Select>
                <Option value="residential">Residential</Option>
                <Option value="commercial">Commercial</Option>
                <Option value="industrial">Industrial</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: 'Please enter location' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="images"
              label="Property Images"
            >
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag files to upload</p>
              </Dragger>
            </Form.Item>
          </>
        )}

        {dealType === 'car' && (
          <>
            <Form.Item
              name="make"
              label="Make"
              rules={[{ required: true, message: 'Please enter make' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="model"
              label="Model"
              rules={[{ required: true, message: 'Please enter model' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="year"
              label="Year"
              rules={[{ required: true, message: 'Please enter year' }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="images"
              label="Car Images"
            >
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag files to upload</p>
              </Dragger>
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default NewDealModal; 