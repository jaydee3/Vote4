/* FROM VOTE$.SQL
CREATE TABLE `demographic_profile` (
	`dId` int(10) NOT NULL AUTO_INCREMENT,
	`accountId` int(10),
	`age` int(4),
	`gender` varchar(10), 
	`education` varchar(50),
	`married` bool, 
	PRIMARY KEY (dId),
	FOREIGN KEY (`accountId`) REFERENCES `account`(`accountId`)
) ENGINE=InnoDB;
*/

var mysql = require('../dbcon.js');

exports.addDemographicProfile = (context, callback) => {
  mysql.pool.query(`INSERT INTO demographic_profile(accountId, age, gender, education, married) VALUES (?,?,?,?,?)`, 
    [context.accountId, context.age, context.user_gender, context.user_education, context.maritalStatus]
 , (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, rows);
  });
};

exports.getDemographicProfile = (context, callback) => {
  mysql.pool.query(`
  SELECT *
  FROM demographic_profile
  WHERE accountId = ?`, 
  context.accountId, (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, rows);
  });
};

exports.updateDemographicProfile = (context, callback) => {
  mysql.pool.query(`UPDATE demographic_profile 
	SET age = ?, gender = ?, education = ?, married = ?
	WHERE accountId = ? `, [
    context.age,
    context.gender,
    context.education,
    context.married,
    context.accountId
  ], (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }

      callback(null, rows);
  });
};