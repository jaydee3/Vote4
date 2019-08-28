var mysql = require('../dbcon.js')


exports.getQuestion=(context, callback) => {
  mysql.pool.query(`
  SELECT qId, question FROM question WHERE qId NOT IN (SELECT qID from answer WHERE accountId = ?) ORDER BY RAND() LIMIT 1
  `, context, (err, rows) => {
        if (err) {
                callback(err, null);
                return;
      }
      callback(null, rows);
  });
};

exports.postAnswer= (context, callback) => {
  mysql.pool.query(`INSERT INTO answer SET ?`, {
    qId: context.qId,
    accountId: context.accountId,
    answer: context.answer
  }, (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }

      callback(null, rows);
  });
};

exports.deleteAnswers= (context, callback) => {
  mysql.pool.query(`DELETE FROM answer WHERE accountId = ?`, 
    context.accountId
  , (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }

      callback(null, rows);
  });
};
