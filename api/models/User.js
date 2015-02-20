/**
 * User.js
 *
 * @description :: TODO
 * @docs        :: http://sailsjs.org/#!documentation/models
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

  getGrades: function(opts, cb) {
    'use strict';

   // Make allowance for the parameter to be an id or user
    var user = opts.user.id ? opts.user.id : opts.user;

    // If the either time bound is not present, set it to max
    if(!opts.timefrom){
      opts.timefrom = -8640000000000000; //min
    }
    if(!opts.timeuntil){
      opts.timeuntil = 8640000000000000; //max
    }

    // Fetch the grades
    Grade.find({
      timemodified: {
        '>=': opts.timefrom,
        '<=': opts.timeuntil
      },
      user: user,
      sort: 'timemodified DESC'
    }).populate('item').exec( function(err, grades) {
      if (err) {
        return cb(err);
      }
      cb(null, grades);
    });
  },

  /**
   * Fetch all of the courses this user is enrolled in.
   */
  getCourses: function(opts, cb) {
    'use strict';

    // Make allowance for the parameter to be an id or user
    var user = opts.user.id ? opts.user.id : opts.user;

    // Find enrolments
    UserEnrolment.find({
      user: user
    }).populate('enrolment').exec(
      function(err, enrols) {
        if (err) {
          cb(err);
        }

        // This user has no enrollments -> empty return, not error
        if (enrols.length === 0) {
          return cb(null, enrols);
        }

        // Fetch the courses from the enrolments
        var courses = [];
        for (var i = 0; i < enrols.length; i++) {
          Course.findById(enrols[i].enrolment.course, function(err, course) {
            if (err) {
              return cb(err);
            }

            courses.push(course[0]);

            // We're dealing with parallel fetching
            if (courses.length === enrols.length) {
              // We need an alphabetical list
              courses = courses.sort(function(a, b) {
                return String(a.fullname) < String(b.fullname);
              });
              return cb(null, courses);
            }
          });
        }
      });
  }
};
