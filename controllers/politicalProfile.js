/* FROM VOTE$.SQL
CREATE TABLE `political_profile` (
	`pId` int(10) NOT NULL AUTO_INCREMENT,
	`accountId` int(10),
	`economic_freedom` int(10), 
	`personal_freedom` int(10),
	PRIMARY KEY (pId),
	FOREIGN KEY (`accountId`) REFERENCES `account`(`accountId`)
) ENGINE=InnoDB;
*/

var mysql = require('../dbcon.js');

exports.newPoliticalProfile = (context, callback) => {
 mysql.pool.query(`INSERT INTO political_profile (accountId, economic_freedom, personal_freedom) VALUES(?, 0, 0)`, context.accountId, (err, res) => {
    if (err){
      console.log('ERR CONTROLLER politicalProfile.js: error building political profile');
      callback(err, null);
    }
    else{
      callback(null, res);
    }
  });
};

//To-do: Add the functions for get political profile, and change it