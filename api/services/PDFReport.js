/**
 * PDFReport Service.
 *
 */
/* global UserService */
exports.writePDF = function(options, cb) {
  'use strict';

  //Build up an html file to render
  var fs = require('fs');

  var html = fs.readFileSync('./views/report.html', 'utf8');
  /**
   * Print reports for a specific cohort.
   */
  CohortMember.find({
    where: {
      cohort: options.cohort
    }
  }).populate('user').exec(function(err, enrolled) {
    if (err) {
      return cb(err);
    }

    var completedUser = 0;

    for (var x = 0; x < enrolled.length; x++) {
      console.log(enrolled[x]);

      UserService.getCourseGrades({
          id: enrolled[x].user.id
        },
        function (err, data) {
          if (err) {
            return cb(err);
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


          for (var i = 0; i < data.courses.length; i++) {
            var courseTemp = '';
            var hasData = false; //No need to add blank courses

            courseTemp += '<div class="course">\n'+
            '<h2>' + data.courses[i].fullname + '</h2>\n';
            courseTemp += '<table>\n' +
            '<thead>\n<tr>\n' +
            '<th style="width: 10%;">Date</th>\n'+
            '<th style="width: 30%;">Activity</th>\n'+
            '<th style="width: 30%;">Description</th>\n' +
            '<th style="width: 10%;">Mark</th>\n'+
            '<th style="width: 10%;">Out of</th>' +
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
                data.grades[j].hidden === 0) {
                //Found grade data
                hasData = true;
                userHasData = true;

                var desc = data.grades[j].item.iteminfo;
                if(desc === null){
                  desc = '';
                }
                courseTemp += '<tr style="background: #f0f0f2;">\n' +
                  '<td>' + data.grades[j].date() + '</td>\n' +
                  '<td><strong>' + data.grades[j].item.itemname +
                  '</strong></td>\n' + '<td>' + desc + '</td>\n' +
                  '<td style="text-align: center;">' +
                    Math.round(data.grades[j].finalgrade) + '</td>\n' +
                  '<td style="text-align: center;">' +
                    Math.round(data.grades[j].rawgrademax) + '</td></tr>\n';

                var feedback = data.grades[j].feedback;
                if(feedback !== '' && feedback !== null){
                  courseTemp += '<tr><td></td><td colspan="4">\n' +
                  feedback + '</td></tr>\n';
                }

              }
            }
            courseTemp += '</tbody>\n</table>\n</div>'; //course
            if (hasData) {
              userTemp += courseTemp + '<hr>';
            }

          }

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
                return cb(err);
              }

              cb(null, result);
            });
          }
        });
    }
  });
};
