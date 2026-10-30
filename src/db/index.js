const { Pool } = require("pg");

// AWS RDS PostgreSQL. SSL ligado sem verificar o certificado (o RDS
// exige SSL por padrão a partir do Postgres 15).
const db = new Pool({
  host: process.env.DB_HOST || "host",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_DATABASE || "postgres",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  ssl: { rejectUnauthorized: false },
});

module.exports = { db };
