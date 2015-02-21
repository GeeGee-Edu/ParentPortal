/**
 * Cohort.js
 *
 * @description :: Cohorts contain groups of users
 */
module.exports = {

  tableName: 'mdl_cohort',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: 'string'
    }
  },

  /**
   * Fetch all the data for users from a certain cohort.
   *
   * @param  {[int]}    opts.cohort [The cohort to be fetched]
   * @param  {Function} cb          [callback]
   */
  getUsersData: function(opts, cb){
    'use strict';

    // Make allowance for the parameter to be an id or cohort
    var cohort = opts.cohort.id ? opts.cohort.id : opts.cohort;

    // Find users for cohort
    CohortMember.find({
      cohort: cohort
    }).populate('user').exec(function(err, enrolments) {
      if (err) { return cb(err); }
      // No users in this cohort
      if (enrolments.length === 0) { return cb('No users in this cohort'); }

      // Build up a list of data in the form {user, [courses], [grades]}
      var usersData = [];
      enrolments.forEach(function(enrolment){

        // Get courses
        User.getCourses({
          user: enrolment.user
        }, function(err, courses){
          if(err){ cb(err); }

          // Then fetch grades
          User.getGrades({
            user: enrolment.user
          }, function(err, grades){
            if(err){ cb(err); }

            // Add the object
            usersData.push({
              user: enrolment.user,
              courses: courses,
              grades: grades
            });

            // Check if we're done
            if(usersData.length === enrolments.length){
              return cb(null, usersData);
            }
          });
        });
      });
    });
  }
};
