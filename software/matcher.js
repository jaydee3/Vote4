const matcher = require('../controllers/matcher.js');

exports.refreshMatchPercentages = (id) =>{
	deleteScores(id);
	matchCandidates(id);
	console.log("software/matcher.js: Update match percentages complete")
};

function update(id) {
	var context = {};
	context.accountId = id;
	context.oId = 1;
      	matcher.getOffice(context, (err, office) => {
		if (err) {
			console.log("Error getting office in match.js");
		}
		else {
			console.log("Office " + JSON.stringify(office[0]));
			context.office = office[0];
			matcher.getMatches(context, (err, matches) => {
				if (err) {
					console.log("Error getting matches in  match.js");
				}
				else if (matches[0] == undefined) {
					console.log("No matches found in match.js");
					//context.feedback = ("No matches found for this user!");
				}
				else {
					context.candidate = matches;
					console.log("Context in match.js" + JSON.stringify(context));
				}
			});
		}
	});
}
	
function deleteScores(id){
	var context = {};
	context.accountId = id;
    matcher.deleteScores(context, (err, scores) => {
		if (err) {
			console.log("Error deleting scores in match.js");
		}
		else {
			console.log("Scores have been deleted in match.js");
		}
	});
};

//This function provides match scores for each candidate
function matchCandidates(id){
	//get the user's answers
	var context = {};
	context.accountId = id;
      	matcher.getAnswers(context, (err, userAnswer) => {
		if (err) {
		      console.log("Error user answers match.js");
		}
		else if (!userAnswer[0]){ //if there were no user answers
			console.log("This user has not completed any answers");
		}
		else{//if the query was successful
			var context = {};
			context.oId = 1;
			context.accountId = id;
			matcher.getCandidates(context, (err, candidates) => {
				if (err) {
				      console.log("Error getting questions in match.js");
				}
				else{//if the query was successful
					if (!candidates[0]) { //test to see if any candidates were found
						context.feedback = 'No candidates for this region';
						console.log('No candidates for this region');
					} 
					else { //if candidates were found
						candidates.forEach(function(candidate) {
							var answerCount = 0;
							var scoreSum = 0;
							matcher.getAnswers(candidate, (err, candidateAnswer) => {
								if (err) {
								      console.log("Error getting user answers in match.js");i
								}
								else{//if the query was successful
									if (!candidateAnswer[0]) { //test to see if any answer were found
										console.log('No answers found for candidate');
										return; //stop processing this candidate
									} 
									else { //if candidates answers were found
										candidateAnswer.forEach(function(candAns) {
											userAnswer.forEach(function(userAns){
												if (userAns.qId == candAns.qId){
													scoreSum += Math.abs(userAns.answer - candAns.answer);
													answerCount++;
													//console.log("Candidate: " + candAns.accountId + " User qid: " + userAns.qId + " Candidate qId: " + candAns.qId + " Score Sum: " + scoreSum + " answerCount: " + answerCount);
												}
											});
										});
										var matchScore = (1 - (scoreSum / (answerCount * 5))) * 100
										//console.log("Candidate ID: " + candidate.accountId + "  Match Score: " + matchScore);
										if (!isNaN(matchScore)) {
											context = {};
											context.accountId = id;
											context.cId = candidate.accountId;
											context.score = matchScore;
											//console.log('Match results: ' + JSON.stringify(context));
											matcher.saveScore(context, (err, results) => {
												if (err) {
				      									console.log("Error saving score in match.js");
												}	
												else{//if the query was successful
   											 		console.log('Score ' + matchScore + ' saved for candidate ' + candidate.accountId + ' in match.js');
												}
											});	
										}		
										//Todo: Test to see if matchScore is NaN, and do not save to database if it is	
									}
								}
							});//end of matcher.getAnswers

						}); //end of candidate.forEach
					update(id);
					}
				}	
			});//end of matcher.getCandidates
		}
	});//end of matcher.getAnswers
};//end of function match candidate