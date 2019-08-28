/*
This page routes to the profile page (views/profile.handlebars) and gets survey questions from /controllers/surveyInstance.js
*/

const express = require('express');
const router = express.Router();
const surveyInstance = require('../controllers/surveyInstance.js');
const userAccount = require('../controllers/userAccount.js');
const pProfile = require('../controllers/politicalProfile.js');
const dProfile = require('../controllers/demographicProfile.js');
const region = require('../controllers/region.js');
const matches = require('../software/matcher.js');

function updateComplete(){
	callbackCount++;
	if(callbackCount >= 2){
		//console.log(context);
		res.render('profile', context);
	}
};

//Context is being sent to profile.handlebars. uncomment to see what all is being sent. This is used to fill in the blanks, and also for editting
router.get('/',function(req,res,next){
	//Waits for all 4 queries to finish, then renders the profile page
	function complete(){
        		callbackCount++;
        		if(callbackCount >= 4){

        			//As you can see, this is a little crazy, there is a lot of duplicate info in here.
        			//To-do: see what is needed in profile, and trim this up to have the least amount of info and calls needed
        			/*
					context:
						username 
						session
								Cookie (path, expiration, maxAge, httponly)
								user
									accountId
									username
									email
						account
							accountId
							name
							username
							password
							email
							picture: null
							appversion: null
							regionId
						profile
							dId
							accountId
							age
							gender
							education
							married
						question
							qId
							question
						region
							city
							state
        			*/
            		res.render('profile', context);
    		}
	};

	//To-Do This code should also get the politicalprofile (int, int) coordinates using pProfile.get function (not yet defined) in controllers/politialProfile.js

	//User is logged in, else below takes user back home
	// This code requests 4 rows of data from the db. It calls complete, until it has called 4 times, and then it uses the gathered data to build the profile page
	if(req.session.user != undefined){
		var callbackCount = 0;
		var context = {};
		context.username = req.session.user.username;
		context.session = req.session;
		userAccount.getAccount(context.session.user, (err, result) => {
      			if (err) {
					console.log("Get account err: " + err);
   			        context.account = null;
			    }
			    else{
	          		context.account = result[0];
	          		if(context.account.regionId != null){
	          			region.getCityState(context.account.regionId, (err, result) =>{
	          				if(err){
	          					console.log("Get region err: " + err);
	          					context.region = null;
	          				}
	          				else{
	          					context.region = {};
	          					context.region.city = result[0].city;
	          					context.region.state = result[0].state;
	          					//result[0] = {city: las vegas, state: NV}
	          				}
	          				complete();
	          			});
	          		}
	          		else{
	          			console.log("region is null");
	          		}
	          		
			    }
			    complete();
		});        		
		//Get demographic info
		dProfile.getDemographicProfile(context.session.user, (err1, profileResult) => {
      			if (err1) {   
				  context.profile = null;
			    }
			    else{
			    	//console.log(profileResult);
	          		context.profile = profileResult[0];
			    }
			    complete();
		});        		
		//Get quesstion. Seems to work.
      	surveyInstance.getQuestion(req.session.user.accountId, (err2, surveyResult) => {
  			if (err2) {
		      console.log("error getting question");
		    }
		    else{
		    	if (!surveyResult[0]) {
          			context.feedback = 'Survey Complete.';
          			context.question = null;
    			} 
    			else {
          			context.question = surveyResult[0];
    			}
		    }
		    complete()
  		});

	}
	else{
		res.render('home', {
			feedback: 'You must be logged in to do that'
		})
	}
	

});
    


router.post('/',function(req,res,next){
	//console.log("req.body: " + JSON.stringify(req.body));
	

		//This is for when the user tries to delete the survey
		if (req.body.retakecheck != undefined){
			console.log("attempting retake")
			if (req.body.retake = "yes"){
				console.log("allowing retake")
				context = {};
				context.accountId = req.session.user.accountId;
				surveyInstance.deleteAnswers(context,(err, result) => {
					if (err) {
						console.log("Could not delete answers.");
						res.redirect('/profile');
					} else {
						console.log("Survey Deleted.");
						res.redirect('/profile');
					}
				});			
			}
		} 
	//To answer questions...
	else if(req.body.answer != undefined){
//		else { //This is when the user answers a questions
			context = {};
			context.qId = req.body.qId
			context.answer = req.body.answer;
			context.accountId = req.session.user.accountId;
			console.log("context: " + JSON.stringify(context));
			surveyInstance.postAnswer(context,(err, result) => {
				if (err) {
					const feedback = "Error saving answer.";
					console.log("Error saving answer to database.");
					res.redirect('/profile');
					/*res.render('profile', {
						session: req.session,
						feedback: feedback,
					});*/
				} else {
					//Run match software
					matches.refreshMatchPercentages(context.accountId);
					//Then render page
					res.redirect('/profile');
					/*res.redirect('profile', {
						session: req.session
					});*/
				}
			});
		}
//	}

	else if(req.body.user_email != undefined){
			/*
				
			*/
	}
	
});


module.exports = router;
