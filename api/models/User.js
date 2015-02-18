/**
 * Student.js
 *
 * @description :: TODO
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  /*
   * Moodle table for the users
   */
  tableName: 'mdl_user',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      required: true
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

  /**
   * Fetch all of the courses this user is enrolled in.
   * @param  {int}      userid
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
          return cb(err);
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

              courses = courses.sort( function(a,b) {
                return String(a.fullname) < String(b.fullname);
              });


              return cb(null, courses);
            }
          });
        }
      });
  }

};
