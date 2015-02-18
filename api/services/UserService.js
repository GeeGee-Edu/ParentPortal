/**
 * CourseGrades Service.
 *
 *
 */
exports.getCourseGrades = function(options, cb) {
  'use strict';

  User.findById(options.id, function(err, user) {
    if (err) {
      return cb(err);
    }

    /**
     * These are to help with async fetching of each.
     * I'm sure there's a better way...
     */
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
    Grade.find({
      where: {
        user: user.id
      },
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
};
