/**
 * Cohort.js
 *
 * @description :: TODO: You might write a short summary
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  /*
   * Moodle table for the cohorts
   */
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

  getUsersData: function(opts, cb){
    'use strict';

    // Make allowance for the parameter to be an id or cohort
    var cohort = opts.cohort.id ? opts.cohort.id : opts.cohort;

    // Find users for cohort
    CohortMember.find({
      cohort: cohort
    }).populate('user').exec(function(err, enrolments) {
      if (err) {
        return cb(err);
      }

      // No users in this cohort
      if (enrolments.length === 0) {
        return cb('No users in this cohort');
      }

      var usersData = [];
      var user;
      for (var i = 0; i < enrolments.length; i++) {
        user = enrolments[i].user; // VERY NB because of the async loop
        User.getCourses({
          user: user
        }, function(err, courses){
          if(err){
            console.log(err);
            cb(err);
          }

          User.getGrades({
            user: user
          }, function(err, grades){
            if(err){
              cb(err);
            }
            usersData.push({
              user: user,
              courses: courses,
              grades: grades
            });
            if(usersData.length === enrolments.length){
              return cb(null, usersData);
            }
          });
        });
      }
    });
  }
};
