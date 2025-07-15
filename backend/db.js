const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'suresh@888',
  database: 'asap_db'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL DB!');
});

module.exports = connection;
