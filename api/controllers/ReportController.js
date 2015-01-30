/**
 * ReportController
 *
 * @description :: Server-side logic for managing Reports
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * Reports  Home page
   * @param  {json} req
   * @param  {json} res
   */
  index: function(req, res) {
    'use strict';
    return res.view('report.ejs');
  },

  /**
   * Sends user's active courses with grades and feedback.
   * !!!!
   *  Set up Grade 10 - 12 Design Courses
   * (BECKS)
   *
   * !!!!
   * @param  {[type]} req
   * @param  {[type]} res
   */
  user: function(req, res) {
    'use strict';

    console.log('\n---');
    console.log('Requested name: ' + req.query.name);

    User.findByFirstname(req.query.name, function(err, user) {
      if (err) {
        console.log(err);
        return res.send(400);
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
      User.getCourses(user.id, function(err, cs) {
        if (err) {
          return res.send(400);
        }

        courses = cs;
        console.log('Courses found : ' + courses.length);

        /**
         * Check if we're ready to return
         */
        if (grades) {
          console.log('Done.\n---');
          return res.json({
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
            return res.send(400);
          }

          grades = gs;
          console.log('Grades found : ' + grades.length);

          /**
           * Check if we're ready to return
           */
          if (courses) {
            console.log('Done.\n---');
            return res.json({
              courses: courses,
              grades: grades
            });
          }
        }
      );
    });
  }

};
