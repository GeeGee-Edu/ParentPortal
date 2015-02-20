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

    fullname: function() {
      'use strict';

      return this.firstname + ' ' + this.lastname;
    }
  },

  getCourseGrades: function(options, cb) {
    'use strict';

    User.find({
      where: {
        id: options.id
      }
    }).exec(function(err, user) {
      if (err) {
        return cb(err);
      }

      if (user[0] === undefined) {
        return cb('Student doesn\'t exist');
      }

      var courses;
      var grades;
      user = user[0];

      /**
       * Fetch courses for this user
       */
      User.getCourses({
          id: user.id
        },
        function(err, cs) {
          if (err) {
            return cb(err);
          }

          courses = cs;
          /**
           * Check if we're ready to return
           */
          if (grades) {
            return cb(null, {
              user: user,
              courses: courses,
              grades: grades
            });
          }
        });

      /**
       * Fetch all user's grades
       */
      if(!options.timefrom){
        options.timefrom = -8640000000000000; //min
      }
      if(!options.timeuntil){
        options.timeuntil = 8640000000000000; //max
      }
      Grade.find({
        timemodified: {
          '>': options.timefrom,
          '<': options.timeuntil
        },
        user: user.id,
        sort: 'timemodified'
      }).populate('item').exec(
        function(err, gs) {
          if (err) {
            return cb(err);
          }

          grades = gs;
          /**
           * Check if we're ready to return
           */
          if (courses) {
            return cb(null, {
              user: user,
              courses: courses,
              grades: grades
            });
          }
        }
      );
    });
  },

  /**
   * Fetch all of the courses this user is enrolled in.
   * @param  {int}      options.id
   * @param  {Function} cb        Callback function
   * @return {[Course => {id, name}]}           Array of courses
   */
  getCourses: function(options, cb) {
    'use strict';
    var courses = [];

    UserEnrolment.find({
      where: {
        user: options.id
      }
    }).populate('enrolment').exec(
      function(err, enrols) {
        if (err) {
          cb(err);
        }

        if (enrols.length === 0) {
          cb(null, enrols);
        }

        /**
         * Pick out only the Course details from the enrolment
         */
        for (var i = 0; i < enrols.length; i++) {
          Course.findById(enrols[i].enrolment.course, function(err, cs) {
            if (err) {
              return cb(err);
            }

            courses.push(cs[0]);

            if (courses.length === enrols.length) {

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
