/**
 * ReportControllerController
 *
 * @description :: Server-side logic for managing Reportcontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	/*
	*		Report front page
	*/
	index: function(req, res){
		res.view("report.ejs");
	},

	/*
	*	Return a users active courses with marks and 
	*	feedback
	*	
	*	Should return something like this:
	*
	*	courses = {
  *        name,
  *        total,
  *        items = {
  *          name
  *          total
  *          feedback
  *        }
  *      }    
  * !!!!
	*	Set up Grade 10 - 12 Design Courses
	* (BECKS)
	*
  * !!!!
	*/
	user: function(req, res){
		
		console.log('Requested : ' + req.query.id);

		User.find(req.query.id, function (err, user){
			//Fail Quickly!
			if(err) return res.send(400);
			user = user[0]
			console.log('Found : ' + user.fullname());

			//Fetch courses for this user
			User.getCourses(user.id, function(err, courses){
				if(err) return res.send(400);

				console.log('Courses : ' + courses.length);

				//Fetch all user's grades
				Grade.find({where: {user: user.id} }).populate('item').exec(function (err, grades) {
					res.json({courses: courses, grades: grades});
				});
			});
			
		});
	}

};

