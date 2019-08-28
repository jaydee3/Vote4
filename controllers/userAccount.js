/* FROM VOTE4.SQL
CREATE TABLE `account` (
  `accountId` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50),
  `username` varchar(50) UNIQUE NOT NULL,
  `password` varchar(10) BINARY NOT NULL, 
  `email` varchar(50) UNIQUE NOT NULL, 
  `picture` varchar(50), 
  `appVersion` float(10),
  `regionId` int(10), 
  FOREIGN KEY (`regionId`) REFERENCES `region`(`rId`),
  PRIMARY KEY (`accountId`)
) ENGINE=InnoDB;
*/

var mysql = require('../dbcon.js');

exports.addNew = (context, callback) => {
 mysql.pool.query(`INSERT INTO account SET ?`, {
    name: context.user_real_name || null,
    username: context.user_name,
    password: context.user_password,
    email: context.user_email,
    regionId: context.rId
  }, (err, rows) => {
      if (err) {
        console.log('ERR CONTROLLER userAccount.js: error building acct');
        callback(err, null);
        return;
      }
      else {
        callback(null, rows);
      }
  });
};


exports.getByCredentials = (context, callback) => {
  mysql.pool.query(`
  SELECT accountId, username, email
  FROM account
  WHERE password = ?
  AND (username = ? OR email = ?)`, [
    context.user_password,
    context.user_name,
    context.user_email
  ], (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }

      callback(null, rows);
  });
};

//On success, return account id, username, and email, from email and password. Just simple checking against the DB
exports.getByEmailAndPwd = (context, callback) => {
	mysql.pool.query(`SELECT accountId, username, email
		FROM account
		WHERE password = ? AND email = ?`, [
			context.user_password,
			context.user_email
			], (err, rows) => {
				if (err) {
       			 	callback(err, null);
      			 	return;
      			}

     			callback(null, rows);
 		});
};

//Gets account rows from a specific id
exports.getAccount = (context, callback) => {
  mysql.pool.query(`
  SELECT *
  FROM account
  WHERE accountId = ?`, 
  context.accountId, (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, rows);
  });
};

exports.updateAccount = (context, callback) => {
  mysql.pool.query(`UPDATE account 
	SET name = ?, username = ?, email = ?
	WHERE accountId = ? `, [
    context.name,
    context.username,
    context.email,
    context.accountId
  ], (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }

      callback(null, rows);
  });
};

exports.updateRegionID = (context, callback) => {
      mysql.pool.query(`UPDATE account SET regionId = ? WHERE accountId = ?`, [context.rId, context.accountId], (err, rows) => {
        if(err){
          callback(err, null);
          return;
        }
        else{
          callback(err, 1);
        }
      })
};