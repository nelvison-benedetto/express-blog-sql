//connection/connection.js
const mysql = require('mysql2');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3308; // set port 3308!!
const DB_USER = process.env.DB_USER || 'NelvisonBenedettoMySQL';
const DB_PSW = process.env.DB_PSW;
const DB_NAMEDB = process.env.DB_NAMEDB || 'mangas_db';

// console.log(DB_HOST+DB_USER+DB_PSW+DB_NAMEDB); i valori me li stampa correttamente

const connection = mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PSW,
    database: DB_NAMEDB,
});   

connection.connect((err)=>{
    if(err) throw err;
    console.log('Connected to MYSQL!');
})
  

module.exports = connection;
  // execute will internally call prepare and query
//   connection.execute(
//     'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
//     ['Rick C-137', 53],
//     function (err, results, fields) {
//       console.log(results); // results contains rows returned by server
//       console.log(fields); // fields contains extra meta data about results, if available
//     }
//   );