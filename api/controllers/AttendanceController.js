/**
* AttendanceController
*
* @description :: Server-side logic for managing attendances
* @help        :: See http://links.sailsjs.org/docs/controllers
*/

module.exports = {

	/*
	*/
	index: function(req, res){
		res.view("attendance.ejs");

		/*
		//This should pick a cohort (hardcoded to 1)
		CohortMember.find().where({ cohort: 1 }).exec(function (err, member) {
			if(err) res.send(400);

			//Build user list
			var users = [];

			for(var i = 0; i < member.length; i++){
				//Fetch user information
				User.findOne().where({ id : member[i].user }).exec(function (err, user) {
					if(err) res.send(400)

					// Add user to list
					users.push(user);

					//Wait for the list to be fully populated
					if(users.length == member.length){
						res.view('attendance.ejs', {users: users});
					}
				});
			}

		});*/

	}

};
