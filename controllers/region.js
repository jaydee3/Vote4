var mysql = require('../dbcon.js');

//This function either returns
//	err if error
//	-1 if count is 0
// 	or the region Id if one is found
exports.getrId = (context, callback) => {
	//"select as count" because otherwise the row returns labeled COUNT(rId) and you cant use that to get the number bc JS thinks its a function
	mysql.pool.query(`SELECT COUNT(rId) as count FROM region where city = ? AND state = ?`, [context.user_city, context.user_state], (err, res) =>{
		if (err){
	      callback(err, null);
	    }
	    else{
	    	console.log("In getRID count = "); 
	    	//res = [RowDataPacket { count: 0 } ]
	    	//res[0] = RowDataPacket { count : 0}
	    	//res[0].count = 0

	    	console.log(res[0].count); // = 0
	    	if(res[0].count == 0){
				callback(null, -1);
	    	}
	    	else{
	    		mysql.pool.query(`SELECT rId FROM region WHERE city = ? AND state = ?`, [context.user_city, context.user_state], (err, res2) => {
				    if (err){
				      callback(err, null);
				    }
				    else{
				      callback(null, res2[0].rId);
				    }
			  	});
	    	}
	      
	    }
	});

};

exports.newRegion = (context, callback) => {
	mysql.pool.query(`INSERT INTO region (city, state) VALUES(?, ?)`, [context.user_city, context.user_state], (err, res) => {
	    if (err){
	      callback(err, null);
	    }
	    else{
	    	//No errors, get the region ID
	    	mysql.pool.query('SELECT MAX(rId) as id FROM region', (err, res2) => {
 				if (err){
				      callback(err, null);
			    }
			    else{
			    	//Total success, return the resulting Id
			     	callback(null, res2[0].id);
			    }
	    	});
	    }
  	});
};

exports.getCityState = (context, callback) =>{
	mysql.pool.query(`SELECT city, state FROM region WHERE rId = ?`, context, (err, row) => {
	    if (err){
	      	callback(err, null);
	    }
	    else{
	    	callback(null, row);
	    }
  	});
}