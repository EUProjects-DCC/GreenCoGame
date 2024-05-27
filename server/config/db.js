const mariadb = require('mariadb');
require('dotenv').config(); //Load enviroment variables

const pool = mariadb.createPool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 5, // max of simultaneous connections
});

module.exports = pool;