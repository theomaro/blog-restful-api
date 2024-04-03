import mysql, { PoolOptions } from "mysql2/promise";

// create a connection pool

const poolConfig: PoolOptions = {
  connectionLimit: 100,
  host: process.env.DB_HOST ? process.env.DB_HOST : "localhost",
  user: process.env.DB_USER ? process.env.DB_USER : "admin",
  password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : "admin",
  database: process.env.DB_NAME ? process.env.DB_NAME : "blog",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
};
const pool = mysql.createPool(poolConfig);

export default pool;
