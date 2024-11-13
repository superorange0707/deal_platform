const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use environment variables for database connection
const sequelize = new Sequelize({
  host: process.env.PGHOST || 'seemplee.postgres.database.azure.com',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'postgres',
  username: process.env.PGUSER || 'seemplee',
  password: process.env.PGPASSWORD,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // You might need this if using self-signed certificates
    }
  },
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // List all tables in the database
    const [results] = await sequelize.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
    console.log('Existing tables:', results);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

module.exports = sequelize; 