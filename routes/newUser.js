//Routes file for new user page

const express = require('express');
const router = express.Router();
const userAcct = require('../controllers/userAccount.js');
const region = require('../controllers/region.js');
const pProfile = require('../controllers/politicalProfile.js');
const dProfile = require('../controllers/demographicProfile.js');

/*Get the new user page*/
router.get('/',function(req,res,next){
    res.render('newUser');
});


/*
Post from the form in newUser.handlebars
req.body (uses body-parser) comes from the form input names.
It is in the form {user_name: 'Andrew', user_email: 'my@email.com', user_password: '12345' }

Find userAcct.addNew in controllers/userAccount.js
get by credentials returns an obj containing username, id, email

To do: 
getRid references region. It should return the id of the region, and if one doesntexist, create one. It does not do this yet.

*/
router.post('/', function(req, res, next){
  console.log('NEW USER POST REQ');

  function makeUser(){
    // Creates a new user account. Error stays on the new user page, tells them that the profile is taken
    userAcct.addNew(credentials, (err, result) => {
      if (err) {
        const feedback = 'That username or email address is already in use (TESTING: SOMETHING WENT WRONG IN BUILDING A NEW PROFILE. SEE ERRORS ON CONSOLE, AND contollers/userAcct.js, routes/newUser.js)';
        res.render('newUser', {
          session: req.session,
          feedback: feedback,
        });
      }

      else {
        //Success, Log in
        userAcct.getByCredentials(credentials, (err, result) => {
          if (!result[0]) {
            //Error loggin in, hopefully doesnt happen right after creating this profile
            const feedback = 'Something seems to have gone wrong.';
            res.render('newUser', {
              session: req.session,
              feedback: feedback,
            });
          } else {
            credentials.accountId = result[0].accountId;
            // Successful log in, add demo profile, political profile
            /*
            These both appear to be working properly, except for marriage status in demograph. profile
            check the console to be sure
            */
            dProfile.addDemographicProfile(credentials, (err, profileResult) => {
             if (err) {
                console.log("Could not create demographic profile for accountId " + result[0].accountId);
                console.log(err);
             }
             else{
               console.log("Successfully created demographic profile for accountId " + result[0].accountId);
             }
             });    
            pProfile.newPoliticalProfile(credentials, (err, res) =>{
             if (err){
                console.log("Could not create political profile for accountId " + result[0].accountId);
                console.log(err);
              }
              else{
                console.log("Successfully created political profile for accountId " + result[0].accountId);
              }
           
            });

            //Everything to do with the sql is done now, create a cookie, and set session user, then go to profile page
            req.session.cookie.maxAge = 24 * 60 * 60 * 1000;
            req.session.user = result[0];
            res.redirect('/profile');
          }

        });
      }
    });
  }

	let credentials = req.body;
  /*Creds =
  user_real_name
  user_name
  user_email
  user_password
  user_city
  user_state
  user_gender
  user_education: HS, BACC, MASTERS, PHD
  maritalstatus: sinlge, married, widowed, divorced
  age
  */

  //Get region id, seems to work, but doesnt send back information if one is not found
  //TODO: make it so that if it returns one, set that as the regionid in credentials
  //      othewise, make an rId, and get that, and set it as credentials.rId

  if(credentials.user_city != null && credentials.user_state != null){
    region.getrId(credentials, (err, res)=>{
    if(err){
      console.log("Error finding rid " + err);
      makeUser();
    }
    else{
      if(res >= 0 ){
        credentials.rId = res;
        makeUser();
      }
      else{
        //make new region, get id
        region.newRegion(credentials, (err, res) =>{
          if(err){
            console.log(err);
            makeUser();
          }
          else{
            credentials.rId = res;
            console.log("NEW region created, here is the id " + res);
            makeUser();
          }
        });
      }
    }
   });
  }
  else{
    credentials.rId = null;
    makeUser();
  }


})

//exports to router, used in ../app.js
module.exports = router;
