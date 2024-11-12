const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Deal = sequelize.define('Deal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  insurance_type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  coverage: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  property_type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  make: {
    type: DataTypes.STRING,
    allowNull: true
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ai_feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'deals',
  underscored: true,
  timestamps: true
});

module.exports = Deal;