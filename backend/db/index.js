const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || 'seemplee.postgres.database.azure.com',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'postgres',
  user: process.env.PGUSER || 'seemplee',
  password: process.env.PGPASSWORD,
  ssl: {
    require: true,
    rejectUnauthorized: false // You might need this if using self-signed certificates
  }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected successfully');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
}; 