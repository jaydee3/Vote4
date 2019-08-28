/* 
This is intended to be the base server JS file
 */

 /* Routers seperate out route handlers into different files in routes folder */
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const newUserRouter = require('./routes/newUser');
const userProfileRouter = require('./routes/userProfile');
const updateProfileRouter = require('./routes/updateProfile');
const matchRouter = require('./routes/match');

var express = require('express');
const app = express();
app.use(express.static('public'))		//Allows for serving of static files: http://expressjs.com/en/starter/static-files.html


const session = require('express-session');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

var handlebars = require("express-handlebars").create({
	defaultLayout:'main',
	helpers: {
	  	//Helper borrowed from https://stackoverflow.com/a/16928455
		//Usage in profile.handlebars
		//See also https://github.com/ericf/express-handlebars
		// What it does is take the value, such as 'TX' and find where it says 'value="TX"' in the HTML, and changes it to 'value="TX" selected="selected"'
	    select: function(selected, option){
	    	return option.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"');
	    }
  	}
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.use(express.static('public'));
app.use(session({ 
  secret: '$@s1dWp[]VQa9rs',
  resave: false,
  saveUninitialized: false,
}));


/*


handlebars.registerHelper('select', function(selected, options) {
    return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
});
*/
/*
 * Routes
 */
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/newUser', newUserRouter);
app.use('/profile', userProfileRouter);
app.use('/updateProfile', updateProfileRouter);
app.use('/match', matchRouter);

/* 
Start server
*/
app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
