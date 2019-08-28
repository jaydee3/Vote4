/*
This page routes to the profile page (views/profile.handlebars) and gets survey questions from /controllers/surveyInstance.js
*/

const express = require('express');
const router = express.Router();
const surveyInstance = require('../controllers/surveyInstance.js');
const pProfile = require('../controllers/politicalProfile.js');
const userAccount = require('../controllers/userAccount.js');
const dProfile = require('../controllers/demographicProfile.js');
const region = require('../controllers/region.js');

//redirect to profile page on get request
router.get('/',function(req,res,next){
	res.redirect('profile'); //redirect works for the GET, must use render for the POST, otherwise it will not have the info needed to update page.
});

//to update profile
router.post('/',function(req,res,next){
	function updateComplete(){
		callbackCount++;
		if(callbackCount >= 4){
			context.account = {};
			context.profile = {};
			context.region = {}; 
			context.account.name = context.name;
			context.account.username = context.username;
			context.account.email = context.email;
			
			context.profile.gender = context.gender;
			context.profile.age = context.age;
			context.profile.education = context.education;
			context.profile.married = context.married;
			context.region.city = context.user_city;
			context.region.state = context.user_state;

			console.log(context);
			res.render('profile', context);
		}
	};

	callbackCount = 0;
	context = {};
	context.name = req.body.user_real_name;
	context.username= req.body.user_name;
	context.email = req.body.user_email;
	context.user_city = req.body.user_city;
	context.user_state = req.body.user_state;
	context.age = req.body.age;
	context.gender = req.body.user_gender;
	context.education = req.body.user_education;
	context.married = req.body.maritalStatus;
	context.accountId = req.session.user.accountId;

	dProfile.updateDemographicProfile(context, (err, result) => {
		if (err) {
			console.log("Error updating demographic profile");
			updateComplete();
		} else {
			updateComplete();
		}
	});

	userAccount.updateAccount(context, (err, result) => {
		if (err) {
			console.log("Error updating account");
			updateComplete();
		} else {
			updateComplete();
		}
	});


	if(context.user_city != null && context.user_state != null){
    	region.getrId(context, (err, res)=>{
		    if(err){
      			console.log("Error finding rid " + err);
      			updateComplete();
    		}
    		else{
      			if(res >= 0 ){
      				context.rId = res;
        			userAccount.updateRegionID(context, (err, res) => {
        				if(err){
        					console.log("Error updating region" + err);
            				updateComplete();
        				}
        				else{
        					updateComplete();
        				}
        			});
      			}
      			else{
        		//make new region, get id
        			region.newRegion(context, (err, res) =>{
          				if(err){
       				     	console.log("Error updating region" + err);
       				     	updateComplete();
          				}
          				else{
            				context.rId = res;
            				console.log("NEW region created, here is the id " + res);

            				userAccount.updateRegionID(context, (err, res) => {
		        				if(err){
		        					console.log("Error updating region to account" + err);
		            				updateComplete();
		        				}
		        				else{
		        					updateComplete();
		        				}
	        				});
          				}
        			});
      			}
    		}
   		});
	}
	else{
	  	//If the user deletes their city and state, we should handle that here
	    updateComplete();
	}

 	surveyInstance.getQuestion(req.session.user.accountId, (err, surveyResult) => {
		if (err) {
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
	    updateComplete()
	});

	//Removed password section, as that should probably go somewhere else + have some type of authentication for security. (a second modal?) 
	//It is not in the modal edit form on profile.handlebars
});

module.exports = router;
