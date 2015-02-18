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

  pdf: function(req, res) {
    'use strict';

    //Build up a tex file
    var fs = require('fs');
    var tex = fs.readFileSync('./views/latex/layout.tex', 'utf8');

    /**
     * Generate reports for a specific cohort.
     */
    CohortMember.find({
      where: {
        cohort: req.query.cohortid
      }
    }).populate('user').exec(function(err, enrolled) {
      if (err) {
        return res.send(400, err);
      }
      console.log(enrolled);

      var completedUsers = 0;
      for (var x = 0; x < enrolled.length; x++) {
        User.getCourseGrades({
            id: enrolled[x].user.id
          },
          function(err, data) {
            if (err) {
              return res.send(400, err);
            }
            var userHasData = false; //We dont want to print out a blank report.

            var userTex = '\\section*{' + data.user.fullname() + '}\n';

            /* jshint ignore:start */
            for (var i = 0; i < data.courses.length; i++) {
              var courseTex = '';
              var hasData = false;

              courseTex += '\\subsection*{' + data.courses[i].fullname + '}\n';
              courseTex += '\\begin{table}[h]\n';
              courseTex += '\\begin{tabular}{ | p{1.5cm} | p{6cm} | p{6cm} | p{1.5cm} | p{1.5cm} |}\n'; //16.6
              courseTex += '\\rowcolor[HTML]{C0C0C0} \\hline\n';
              courseTex += '\\textbf{Date} & \\textbf{Activity} & \\textbf{Description} & \\textbf{Mark} & \\textbf{Out Of} \\\\ \\hline \n';

              for (var j = 0; j < data.grades.length; j++) {
                if (data.grades[j].item.course === data.courses[i].id &&
                  data.grades[j].item.itemname !== null &&
                  data.grades[j].usermodified !== null &&
                  data.grades[j].item.hidden === 0) {
                  //Found grade data
                  hasData = true;
                  userHasData = true;

                  var desc = data.grades[j].item.iteminfo;
                  if (desc === null) {
                    desc = '';
                  }
                  courseTex += '\\rowcolor[HTML]{9B9B9B}';
                  courseTex += data.grades[j].date() + ' & ';
                  courseTex += data.grades[j].item.itemname + ' & ';
                  courseTex += desc + ' & ';
                  courseTex += Math.round(data.grades[j].finalgrade * 10) / 10 + ' & ';
                  courseTex += Math.round(data.grades[j].item.grademax) + ' \\\\ \\hline \n';

                  var feedback = data.grades[j].feedback;
                  if (feedback != "" && feedback != null) {
                    courseTex += ' & \\multicolumn{4}{m{12cm}|}{' + feedback + '}  \\\\ \\hline \n';
                  }

                }
              }
              courseTex += '\\end{tabular}\n';
              courseTex += '\\end{table}\n'

              if (hasData) {
                userTex += courseTex;
              }
            }
            /* jshint ignore:end */

            if (userHasData) {
              tex += userTex;
            }

            completedUsers += 1;

            /* global latex */
            if (completedUsers === enrolled.length) {

              tex += '\\end{document}';

              latex.createPDF({
                tex: tex,
                filename: 'report'
              }, function() {
                res.download('report.pdf', 'file:///report.pdf');
              });
            }
          });
      }
    });
  },

  /**
   * Sends user's active courses with grades and feedback.
   *
   * @param  {[type]} req
   * @param  {[type]} res
   */
  user: function(req, res) {
    'use strict';

    User.getCourses(req.query.id, function(err, courses) {
      if (err) {
        res.send(err);
      }

      return res.json(courses);
    });
  }

};
