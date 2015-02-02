/**
 * CourseGrades Service.
 *
 *
 */
exports.getCourseGrades = function(options, cb) {
  'use strict';

  User.findById(options.id, function(err, user) {
    if (err) {
      console.log(err);
      return cb(err);
    }

    /**
     * These are to help with async fetching of each.
     * I'm sure there's a better way...
     */
    var courses;
    var grades;

    user = user[0];
    console.log('Found : ' + user.fullname() + '\n');

    /**
     * Fetch courses for this user
     */
    User.getCourses({
      id: user.id
    }, function(err, cs) {
      if (err) {
        return cb(err);
      }

      courses = cs;
      console.log('Courses found : ' + courses.length);

      /**
       * Check if we're ready to return
       */
      if (grades) {
        console.log('Done.\n---');
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
      }
    }).populate('item').exec(
      function(err, gs) {
        if (err) {
          console.log(err);
          return cb(err);
        }

        grades = gs;
        console.log('Grades found : ' + grades.length);

        /**
         * Check if we're ready to return
         */
        if (courses) {
          console.log('Done.\n---');
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
