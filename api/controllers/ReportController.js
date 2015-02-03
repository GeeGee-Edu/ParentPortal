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
    var fs = require('fs');

    var html = fs.readFileSync('./views/report.html', 'utf8');
    /**
     * Print reports for a specific cohort.
     */
    CohortMember.find({
      where: {
        cohort: req.query.cohort
      }
    }).populate('user').exec(function(err, enrolled) {
      if (err) {
        console.log(err);
        return res.send(err);
      }

      var completedUser = 0;

      for (var x = 0; x < enrolled.length; x++) {
        console.log(enrolled[x]);

        UserService.getCourseGrades({
            id: enrolled[x].user.id
          },
          function(err, data) {
            if (err) {
              //console.log(err);
              return res.send(err);
            }
            var userHasData = false; //We dont want to print out a blank report.

            var datetime = new Date();
            var months = ['January', 'February', 'March',
              'April', 'May', 'June', 'July', 'August',
              'September', 'October', 'November', 'December'];
            var date = datetime.getDate()+ ' ' + months[datetime.getMonth()] +
              ' ' + datetime.getFullYear();

            var userTemp = '<div class="user-report">\n' +
              '<div class="header">\n'+
              /*'<span class="helper"></span>'+*/
              '<img src="http://localhost:1337/images/drongo2c.png">\n<p>' +
              data.user.fullname() + '</p><p style="font-size:15px;">'+
              date+'</p></div>';

            /**
             * Loop through all user's Courses
             */

            /* jshint ignore:start */
            for (var i = 0; i < data.courses.length; i++) {
              var courseTemp = "";
              var hasData = false; //No need to add blank courses

              courseTemp += '<div class="course">\n'+
              '<h2>' + data.courses[i].fullname + '</h2>\n';
              courseTemp += '<table>\n' +
              '<thead>\n<tr>\n' +
              '<th>Activity</th>\n<th class="marks">Mark (%)</th>\n<th class="feedback">Feedback</th>' +
              '</tr>\n</thead>\n<tbody>\n';

              /**
               * Loop through user's grades for current course.
               *
               * N.B not to show if no grades.
               *
               */
              for (var j = 0; j < data.grades.length; j++) {
                if (data.grades[j].item.course === data.courses[i].id &&
                  data.grades[j].item.itemname !== null &&
                  data.grades[j].usermodified !== null &&
                  data.grade[j].hidden === 0) {
                  hasData = true;
                  userHasData = true;

                  var feedback = data.grades[j].feedback;
                  if(feedback == null){
                    feedback = "";
                  }

                  courseTemp += '<tr>\n' +
                    '<td><strong>' + data.grades[j].item.itemname + '</strong></td>\n' +
                    '<td  class="marks" style="text-align: center;">' +
                    Math.round(data.grades[j].finalgrade * 100 / data.grades[j].rawgrademax) +
                    '</td>\n<td class="feedback">' + feedback + '</td>\n</tr>\n';
                }
              }
              courseTemp += '</tbody>\n</table>\n</div>'; //course
              if (hasData) {
                userTemp += courseTemp + '<hr>';
              }

            }
            /* jshint ignore:end */
            userTemp  = userTemp.slice(0,-4);
            userTemp += '</div>\n'; //user-report
            //Not sure if there could be a race for the html variable.
            if(userHasData){
              html += userTemp;
            }

            completedUser += 1;

            /**
             * Are we ready to compile the pdf yet?
             */
            if (completedUser === enrolled.length) {
              html += '</body>\n</html>';
              var pdf = require('html-pdf');
              console.log(html);
              var options = {
                filename: './reports.pdf',
                format: 'Letter',
                border: '10 mm',
                footer: {
                  height: '20mm',
                  contents: '<div class="footer">' +
                  'Bi-weekly report compiled by Kitsong.' +
                  '</div>'
                }
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
