const express = require('express');
const router = express.Router();

/*Get the main page*/
router.get('/',function(req,res,next){
    res.render('home', {
    	session: req.session
    });
});

// logs the user out and redirects to the home page.
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;