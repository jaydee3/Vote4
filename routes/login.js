const express = require('express');
const router = express.Router();
const userAcct = require('../controllers/userAccount.js');


/*Get the main page*/
router.get('/',function(req,res,next){
    res.render('login', {
      session: req.session
    });
});

router.post('/', function(req, res, next){
	let credentials = req.body;
    userAcct.getByEmailAndPwd(credentials, (err, result) => {
        if (err || result[0] == undefined || result[0].email != credentials.user_email) {
          const feedback = 'Something seems to have gone wrong.';    
          res.render('login', {
            session: req.session,
            feedback: feedback
          });
        } else {
          // login  successful.
          // setup the session data & go to profile.
          req.session.cookie.maxAge = 24 * 60 * 60 * 1000;
          req.session.user = result[0]; 
          res.redirect('/profile');
        }
    });
});

module.exports = router;