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

    var headingColour = '9B9B9B';
    var rowColour = 'C0C0C0';

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
        return res.serverError(err);
      }

      if (enrolled.length === 0) {
        return res.badRequest('No users in that cohort', 'report');
      }

      var completedUsers = 0;
      for (var x = 0; x < enrolled.length; x++) {
        User.getCourseGrades({
            id: enrolled[x].user.id,
            timefrom: Date.parse(req.query.timefrom) / 1000,
            timeuntil: Date.parse(req.query.timeuntil) / 1000
          },
          /* jshint maxcomplexity : 10 */
          function(err, data) {
            if (err) {
              return res.serverError(err);
            }
            var userHasData = false; //We dont want to print out a blank report.

            var userTex = '\\section*{' + data.user.fullname() + '}\n';
            userTex += '\\setcounter{page}{1}\n';
            userTex += '\\thispagestyle{firststyle}\n';

            for (var i = 0; i < data.courses.length; i++) {
              var courseTex = '';
              var hasData = false;

              courseTex += '\\begin{table}[!htc]\n';
              courseTex += '\\caption*{' + data.courses[i].fullname + '}';
              courseTex += '\\begin{tabular}' + //16.6
                '{ | p{1.5cm} | p{4.5cm} | p{7.5cm} | p{1.4cm} | p{1.4cm} |}\n';
              courseTex += '\\rowcolor[HTML]{' + headingColour + '} \\hline\n';
              courseTex += '\\textbf{Date} & \\textbf{Activity} & ' +
                '\\textbf{Description} & \\textbf{Mark} & ' +
                '\\textbf{Out Of} \\\\ \\hline \n';

              for (var j = 0; j < data.grades.length; j++) {
                if (data.grades[j].item.course === data.courses[i].id &&
                  data.grades[j].item.itemname !== null &&
                  data.grades[j].usermodified !== null &&
                  data.grades[j].item.hidden == 0) { // jshint ignore:line
                  //Found grade data
                  hasData = true;
                  userHasData = true;

                  // Preprocess to escape TeX special chars (\ & _ % $ # ~ ^)
                  var removeChars = function(str) {
                    var chars = ['\_', '\%', '\#', '\'', '\"'];
                    for (var i = 0; i < chars.length; i++) {
                      str = String(str).replace(new RegExp(chars[i], 'g'),
                        '\\' + chars[i]);
                    }
                    String(str).replace(/\\/g, '\\textbackslash{}');
                    String(str).replace(/\^/g, '\\textasciicircum{}');
                    String(str).replace(/\~/g, '\\textasciitilde{}');

                    return str;
                  };

                  var date = data.grades[j].date();
                  var name = data.grades[j].item.itemname;
                  var desc = data.grades[j].item.iteminfo;
                  if (desc === null) {
                    desc = '';
                  }
                  var grade = Math.round(data.grades[j].finalgrade * 10) / 10;
                  var outOf = Math.round(data.grades[j].item.grademax);
                  var feedback = data.grades[j].feedback;

                  courseTex += '\\rowcolor[HTML]{' + rowColour + '}';
                  courseTex += removeChars(date) + ' & ';
                  courseTex += removeChars(name) + ' & ';
                  courseTex += removeChars(desc) + ' & ';
                  courseTex += '\\multicolumn{1}{c|}{' +
                    removeChars(grade) + '} & ';
                  courseTex += '\\multicolumn{1}{c|}{' +
                    removeChars(outOf) + '} \\\\ \\hline \n';


                  if (feedback !== '' && feedback !== null) {
                    courseTex += ' & \\multicolumn{4}{m{12cm}|}{' +
                      removeChars(feedback) + '}  \\\\ \\hline \n';
                  }
                }
              }
              courseTex += '\\end{tabular}\n';
              courseTex += '\\end{table}\n';

              if (hasData) {
                userTex += courseTex;
              }
            }

            if (userHasData) {
              tex += userTex + '\n \\cleardoublepage';
            }

            completedUsers += 1;

            /* global latex */
            if (completedUsers === enrolled.length) {

              tex += '\\end{document}';

              var repname;
              if(req.query.timefrom && req.query.timeuntil){
              var from = new Date(Date.parse(req.query.timefrom));
              var until = new Date(Date.parse(req.query.timeuntil));
              repname = req.query.cohortid + '-' +
                [from.getDate(), from.getMonth() + 1].join('') + '-' +
                [until.getDate(), until.getMonth() + 1].join('');
              }else{
                repname = req.query.cohortid + '-' + 'all';
              }
              var texfile = '.tmp/' + repname + '.tex'; ///date?
              // Write the tex file
              fs.writeFile(texfile, tex, function(err) {
                if (err) {
                  res.serverError(err);
                }

                // Now convert to pdf
                latex.createPDF({
                  texfile: texfile,
                  dir: 'report'
                }, function(err) {
                  if (err) {
                    res.serverError(err);
                  }
                  res.download('report/' + repname + '.pdf',
                    'file:///' + repname + '.pdf');
                });
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
  // user: function(req, res) {
  //   'use strict';

  //   User.getCourses(req.query.id, function(err, courses) {
  //     if (err) {
  //       res.send(err);
  //     }

  //     return res.json(courses);
  //   });
  // }
};
