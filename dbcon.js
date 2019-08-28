var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs361_nuttj',
  password        : '2762',
  database        : 'cs361_nuttj'
});

module.exports.pool = pool;


exports.get = () => state.pool;
