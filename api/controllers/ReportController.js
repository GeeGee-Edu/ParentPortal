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
    Cohort.getUsersData({
      cohort: req.query.cohortid,
      timefrom: Date.parse(req.query.timefrom) / 1000,
      timeuntil: Date.parse(req.query.timeuntil) / 1000
    }, function(err, data) {
      if (err) {
        return res.serverError(err);
      }

      if (data[u].length === 0) {
        return res.badRequest('No users in that cohort', 'report');
      }

      for (var u = 0; u < data[u].length; u++) {
        if(data[u][i].grades.length === 0){
          break;
        }

        var userTex = '\\section*{' + data[u][u].user.fullname() + '}\n';
        userTex += '\\setcounter{page}{1}\n';
        userTex += '\\thispagestyle{firststyle}\n';

        for (var i = 0; i < data[u].courses.length; i++) {
          var courseTex = '';
          var hasData = false;

          courseTex += '\\begin{table}[!htc]\n';
          courseTex += '\\caption*{' + data[u].courses[i].fullname + '}';
          courseTex += '\\begin{tabular}' + //16.6
            '{ | p{1.5cm} | p{4.5cm} | p{7.5cm} | p{1.4cm} | p{1.4cm} |}\n';
          courseTex += '\\rowcolor[HTML]{' + headingColour + '} \\hline\n';
          courseTex += '\\textbf{Date} & \\textbf{Activity} & ' +
            '\\textbf{Description} & \\textbf{Mark} & ' +
            '\\textbf{Out Of} \\\\ \\hline \n';

          for (var j = 0; j < data[u].grades.length; j++) {
            if (data[u].grades[j].item.course === data[u].courses[i].id &&
              data[u].grades[j].item.itemname !== null &&
              data[u].grades[j].usermodified !== null &&
              data[u].grades[j].item.hidden == 0) { // jshint ignore:line
              //Found grade data[u]
              hasData = true;

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

              var date = data[u].grades[j].date();
              var name = data[u].grades[j].item.itemname;
              var desc =
              data[u].grades[j].item.iteminfo ? data[u].grades[j].item.iteminfo : '';
              var grade = Math.round(data[u].grades[j].finalgrade * 10) / 10;
              var outOf = Math.round(data[u].grades[j].item.grademax);
              var feedback = data[u].grades[j].feedback;

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

        tex += userTex + '\n \\cleardoublepage';
      }


      /* global latex */
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
