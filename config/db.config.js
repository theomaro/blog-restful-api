import { createPool } from "mysql2/promise";

// create a connection pool
const pool = createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "blog",
  port: process.env.DB_PORT || 3306,
});

export default pool;
