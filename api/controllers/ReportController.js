/**
 * ReportController
 *
 * @description :: Server-side logic for managing Reports
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {

  /**
   * Reports  Home page
   */
  index: function(req, res) {
    'use strict';
    return res.view('report.ejs');
  },

  /**
   * Generate a pdf Report.
   *
   * N.B. query.cohort required.
   *
   */
  /* global UserService */
  pdf: function(req, res) {
    'use strict';

    console.log('\n---');
    console.log('Requested Cohort ID: ' + req.query.cohort);

    //Build up an html file to render
    var html = '';
    html +=
"<style>table {\
  border-collapse: separate;\
  border-spacing: 0;\
  color: #4a4a4d;\
  font: 14px/1.4 'Helvetica Neue', Helvetica, Arial, sans-serif;\
}\
th,\
td {\
  padding: 10px 15px;\
  vertical-align: middle;\
}\
thead {\
  background: #395870;\
  background: linear-gradient(#49708f, #293f50);\
  color: #fff;\
  font-size: 11px;\
  text-transform: uppercase;\
}\
th:first-child {\
  border-top-left-radius: 5px;\
  text-align: left;\
}\
th:last-child {\
  border-top-right-radius: 5px;\
}\
tbody tr:nth-child(even) {\
  background: #f0f0f2;\
}\
td {\
  border-bottom: 1px solid #cecfd5;\
  border-right: 1px solid #cecfd5;\
}\
td:first-child {\
  border-left: 1px solid #cecfd5;\
}</style>";
    /**
     * Print reports for a specific cohort.
     */
    CohortMember.find({
      where: {
        cohort: req.query.cohort
      }
    }).populate('user').exec(function(err, enrolled) {
      if (err) {
        return res.send(err);
      }

      var completedUser = 0;

      for (var x = 0; x < enrolled.length; x++) {
        UserService.getCourseGrades({
            id: enrolled[x].user.id
          },
          function(err, data) {
            if (err) {
              return res.send(err);
            }

            var userTemp = '<div class="user-report">';
            userTemp += '<h1 style="text-align=centre;">' +
              data.user.fullname() + '</h1>';

            /**
             * Loop through all user's Courses
             */

            /* jshint ignore:start */
            for (var i = 0; i < data.courses.length; i++) {
              var courseTemp = "";
              var hasData = false;

              courseTemp += "<div class='course'><h2>" + data.courses[i].fullname + "</h2>";
              courseTemp += "<table class='pure-table'>";
              courseTemp += "<thead><tr><th>Activity</th><th>Mark</th><th>Feedback</th></tr></thead><tbody>";

              /**
               * Loop through user's grades for current course.
               *
               * N.B not to show if no grades.
               *
               */
              for (var j = 0; j < data.grades.length; j++) {
                if (data.grades[j].item.course === data.courses[i].id &&
                  data.grades[j].item.itemname !== null &&
                  data.grades[j].usermodified !== null) {
                  hasData = true;

                  courseTemp += "<tr>";
                  courseTemp += "<td>" + data.grades[j].item.itemname + "</td>";
                  courseTemp += "<td>" +
                    Math.round(data.grades[j].finalgrade * 100 / data.grades[j].rawgrademax) +
                    "% </td>";
                  courseTemp += "<td>" + data.grades[j].feedback + "</td>";
                  courseTemp += "</tr>";
                }
              };
              courseTemp += "</tbody></table></div>"; //course
              if(hasData){
                userTemp += courseTemp;
              }

            }
            /* jshint ignore:end */

            userTemp += '</div>'; //user-report
            //Not sure if there could be a race for the html variable.
            html += userTemp;

            completedUser += 1;

            /**
             * Are we ready to compile the pdf yet?
             */
            if (completedUser === enrolled.length) {
              var pdf = require('html-pdf');
              var options = {
                filename: './reports.pdf',
                format: 'Letter'
              };

              //Create PDF from html string
              pdf.create(html, options).toFile(function(err, result) {
                if (err) {
                  console.log(err);
                  return res.send(err);
                }

                console.log(result);
                res.send('Done'); //Improve here
              });
            }
          });
      }

    });



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
  /* global UserService */
  user: function(req, res) {
    'use strict';

    console.log('\n---');
    console.log('Requested id: ' + req.query.id);

    UserService.data({
      id: req.query.id
    }, function(err, data) {
      if (err) {
        res.send(err);
      }

      return res.json(data);
    });
  }

};
