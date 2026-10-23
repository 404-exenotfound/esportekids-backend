const { Pool } = require("pg");

const db = new Pool({
  host: process.env.DB_HOST || "host",
  port: 25060,
  database: process.env.DB_DATABASE || "db",
  user: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "password",
  ssl: { rejectUnauthorized: false },
});

module.exports = { db };