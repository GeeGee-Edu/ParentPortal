/**
 * User.js
 *
 * @description :: Users are who we are gathering stats for from Moodle
 */
module.exports = {

  tableName: 'mdl_user',
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    firstname: {
      type: 'string'
    },
    lastname: {
      type: 'string'
    },
    username: {
      type: 'string'
    },
    email: {
      type: 'email'
    },

    // This might need more options "F L" vs "L, F"
    fullname: function() {
      'use strict';
      return this.firstname + ' ' + this.lastname;
    }
  },

  /**
   * Fetch all a users grades with an optional timeframe.
   *
   * @param  {[int]}    opts.user       [the user to fetch grades for]
   * @param  {[int]}    opts.timefrom   [lower time bound]
   * @param  {[int]}    opts.timeuntil  [upper time bound]
   * @param  {Function} cb              [callback]
   */
  getGrades: function(opts, cb) {
    'use strict';

   // Make allowance for the parameter to be an id or user
    var user = opts.user.id ? opts.user.id : opts.user;

    // If the either time bound is not present, set it to max
    if(!opts.timefrom){ opts.timefrom = -8640000000000; }
    if(!opts.timeuntil){ opts.timeuntil = 8640000000000; }

    // Fetch the grades
    Grade.find({
      timemodified: {
        '>=': opts.timefrom,
        '<=': opts.timeuntil
      },
      user: user,
      sort: 'timemodified DESC'
    }).populate('item').exec( function(err, grades) {
      if (err) { return cb(err); }

      return cb(null, grades);
    });
  },

  /**
   * Fetch all of the courses this user is enrolled in.
   *
   * @param  {[int]}    opts.user  [the user to fetch courses for]
   * @param  {Function} cb         [callback]
   */
  getCourses: function(opts, cb) {
    'use strict';

    // Make allowance for the parameter to be an id or user
    var user = opts.user.id ? opts.user.id : opts.user;

    // Find enrolments
    UserEnrolment.find({
      user: user
    }).populate('enrolment').exec(
      function(err, userEnrolments) {
        if (err) { cb(err); }

        // This user has no enrollments -> empty return, not error
        if (userEnrolments.length === 0) {
          return cb(null, userEnrolments);
        }

        // Fetch the courses from the enrolments
        var courses = [];
        userEnrolments.forEach(function(userEnrolment){
          Course.find({
            id : userEnrolment.enrolment.course
          }, function(err, course) {
            if (err) { return cb(err); }

            courses.push(course[0]);

            // We're dealing with parallel fetching
            if (courses.length === userEnrolments.length) {

              // We need a sorted list
              courses = courses.sort(
                function(a, b) {
                  return String(a.fullname) < String(b.fullname);
                });

              return cb(null, courses);
            }
          });
        });
      });
  }
};
