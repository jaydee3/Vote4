const express = require('express');
const router = express.Router();


/*router.get('/',function(req,res,next){
    res.render('survey');
});*/

function getQuestion(res, mysql, context, complete){
     mysql.pool.query("SELECT qId, question FROM question", function(error, results, fields){
         if(error){
             res.write(JSON.stringify(error));
             res.end();
         }
         context.question = results;
         complete();
     });
}

router.get('/', function(req, res, next){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getQuestion(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('survey', context);
            }

        }
    }); 

module.exports = router;
