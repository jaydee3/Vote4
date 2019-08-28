var mysql = require('../dbcon.js');


exports.getCandidates = (context, callback) => {
  mysql.pool.query(`
  SELECT *
  FROM candidate
  WHERE oId = ?`, 
  context.oId, (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, rows);
  });
};

exports.getAnswers = (context, callback) => {
  mysql.pool.query(`
   SELECT *
   FROM answer
   WHERE accountId = ?`,
   context.accountId, (err, rows) => {
       if (err) {
         callback(err, null);
         return;
       }
       callback(null, rows);
   });
};


exports.deleteScores = (context, callback) => {
  mysql.pool.query(`
  DELETE FROM score WHERE accountId = ?`,
  context.accountId, (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, rows);
  });
};


exports.saveScore = (context, callback) => {
  mysql.pool.query(`
  INSERT INTO score SET ?`, {
    accountId: context.accountId, 
    cId: context.cId, 
    score: context.score
  }, (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, rows);
  });
};


exports.getMatches = (context, callback) => {
  mysql.pool.query(`
   SELECT A.name AS name, S.score AS score, A.picture AS picture FROM office O 
   INNER JOIN candidate C ON C.oId = O.oId
   INNER JOIN account A on A.accountId = C.cId
   INNER JOIN score S on S.cId = C.cId
   WHERE O.oId = ? and S.accountId = ?`,
	[context.office.oId, context.accountId], (err, rows) => {
       if (err) {
         callback(err, null);
         return;
       }
       callback(null, rows);
   });
};

exports.getOffice = (context, callback) => {
  mysql.pool.query(`
  SELECT *
  FROM office
  WHERE oId = ?`, 
  context.oId, (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, rows);
  });
};
