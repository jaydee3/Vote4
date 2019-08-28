/*
This page routes to the /match page 
*/

const express = require('express');
const router = express.Router();
const matcher = require('../controllers/matcher.js');

router.get('/',function(req,res,next){
	if(req.session.user == undefined){
                res.render('home', {
                        feedback: 'You must be logged in to do that'
                })
        }
	else{
		updateCount = 0
		function update(){
			console.log('UpdateCount ' + updateCount);
			if (updateCount == 2){
				res.render('match', context);
			}
		}
		var context = {};
		context.accountId = req.session.user.accountId;
		context.oId = 1;
		context.session = req.session;
		matcher.getOffice(context, (err, office) => {
			if (err) {
				console.log("Error getting office in match.js");
				context.feedback = "Error getting office in match.js";
				//res.render('match', context);
				updateCount=2;
				update();
			}
			else {
				updateCount++;
				update();
				console.log("Office " + JSON.stringify(office[0]));
				context.office = office[0];
				matcher.getMatches(context, (err, matches) => {
					if (err) {
						console.log("Error getting matches in  match.js");
						context.feedback = "Error getting matchesin match.js";
						//res.render('match', context);
						updateCount++;
						update();
					}
					else if (matches[0] == undefined) {
						console.log("No matches found in match.js");
						context.feedback = ("No matches found for this user!")
						//res.render('match', context);
						updateCount++;
						update();
					}
					else {
						context.candidate = matches;
						//console.log("Context in match.js" + JSON.stringify(context));

						//res.render('match', context);
						updateCount++;
						update();
					}
				});
			}
		});
	}
});

module.exports = router;  	


