const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:messi3214@127.0.0.1:5432/fitness';

const client = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

module.exports = client;
