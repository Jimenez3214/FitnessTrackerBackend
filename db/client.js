const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:kizpc@localhost:5433/fitness_tracker';

const client = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

module.exports = client;
