/**
 * ReportController
 *
 * @description :: Server-side logic for managing Reports
 */
module.exports = {

  /**
   * Index page for reports
   *
   * @param  {[http]} res [reports view / error]
   */
  index: function(req, res) {
    'use strict';
    return res.view('report.ejs');
  },

  /**
   * Compile a pdf report and send back to be downloaded
   *
   * @param  {[int]}  req.query.cohortid   [cohortid for cohort to be printed]
   * @param  {[int]}  req.query.timefrom   [lower time bound]
   * @param  {[int]}  req.query.timeuntil  [upper time bound]
   *
   * @param  {[http]} res                  [pdf download / error]
   */
  pdf: function(req, res) {
    'use strict';

    // Quick access, easy to change front-end names
    var cohortid = req.query.cohortid;
    var timefrom = Date.parse(req.query.timefrom) / 1000;
    var timeuntil = Date.parse(req.query.timeuntil) / 1000;

    // TODO: These should come from a config file
    var headingColour = '9B9B9B';
    var rowColour = 'C0C0C0';

    // Fetch tex layout
    var fs = require('fs');
    var tex = fs.readFileSync('./views/latex/layout.tex', 'utf8');

    // Fetch data for cohort
    Cohort.getUsersData({
      cohort: cohortid,
      timefrom: timefrom,
      timeuntil: timeuntil
    }, function(err, data) {
      if (err) {
        return res.badRequest(err, 'report');
      }

      // Loop through each user
      for (var u = 0; u < data.length; u++) {
        // Check if this user is worth our time...
        if(data[u].grades.length === 0 || data[u].courses.length === 0){
          break;
        }

        // Set up user heading
        var userTex = '\\section*{' + data[u].user.fullname() + '}\n';
        userTex += '\\setcounter{page}{1}\n';
        userTex += '\\thispagestyle{firststyle}\n';

        // Add all courses
        data[u].courses.forEach(function(course){
          var courseTex = '';
          var hasData = false; // Flag for whether this course has grades

          // Set up the table and headings
          courseTex += '\\begin{table}[!htc]\n';
          courseTex += '\\caption*{' + course.fullname + '}';
          courseTex += '\\begin{tabular}' + //16.6
            '{ | p{1.5cm} | p{4.5cm} | p{7.5cm} | p{1.4cm} | p{1.4cm} |}\n';
          courseTex += '\\rowcolor[HTML]{' + headingColour + '} \\hline\n';
          courseTex += '\\textbf{Date} & \\textbf{Activity} & ' +
            '\\textbf{Description} & \\textbf{Mark} & ' +
            '\\textbf{Out Of} \\\\ \\hline \n';

          // Add relevant grades
          (data[u].grades).filter(function(grade){
            // Rules for printing a grade on the report
            if (grade.item.course === course.id && // Correct course
              grade.item.itemname !== null && // Has a name
              grade.usermodified !== null && // User has done the activity
              grade.item.hidden == 0) { // jshint ignore:line
              return true;
            }
          }).forEach(function(grade){
            hasData = true; // This course has some data

            // Escape all special LaTex characters
            var escapeChars = function(str) {

              // Backslash escapable
              var chars = ['_', '%', '#', '\'', '\"', '\$'];

               // Do this before the others
              str = str.replace(/\\/g, '\\textbackslash{}');

              chars.forEach(function(c){
                str = String(str).replace(new RegExp(c, 'g'), '\\' + c);
              });
              // LaTex special escape method
              str = str.replace(/\^/g, '\\textasciicircum{}');
              str = str.replace(/~/g, '\\textasciitilde{}');

              return str;
            };

            // Process all grade data
            var date = grade.date();
            var name = escapeChars(grade.item.itemname);
            var desc = grade.item.iteminfo ?
              escapeChars(grade.item.iteminfo) : '';
            var feedback = grade.feedback ?
              escapeChars(grade.feedback) : '';
            var finalGrade = Math.round(grade.finalgrade * 10) / 10;
            var outOf = Math.round(grade.item.grademax);

            // Put data into the table
            courseTex += '\\rowcolor[HTML]{' + rowColour + '}';
            courseTex += date + ' & ';
            courseTex += name + ' & ';
            courseTex += desc + ' & ';
            courseTex += '\\multicolumn{1}{c|}{' + finalGrade + '} & ';
            courseTex += '\\multicolumn{1}{c|}{' + outOf + '} \\\\ \\hline \n';

            // Check if we need a feedback row
            if (feedback !== '') {
              courseTex += ' & \\multicolumn{4}{m{12cm}|}{' +
                feedback + '}  \\\\ \\hline \n';
            }
          });

          // End table and add to userTex
          courseTex += '\\end{tabular}\n';
          courseTex += '\\end{table}\n';
          if (hasData) { userTex += courseTex; }
        });

        // Finish user and move to a new odd page
        tex += userTex + '\n \\cleardoublepage \n';
      }

      tex += '\\end{document}';

      // File name parameters
      var from = req.query.timefrom ?
        (new Date(req.query.timefrom)).getMonth() + 1 : 'Begin';
      var until = req.query.timeuntil ?
        (new Date(req.query.timeuntil)).getMonth() + 1 : 'End';

      // "1-(4-*)"
      var reportName = cohortid + 'From' + from + 'To' + until;

      // Write the tex file
      fs.writeFile('.tmp/' + reportName + '.tex', tex, function(err) {
        if (err) { res.serverError(err); }

        //vWrite the PDF
        /* global latex */
        latex.createPDF({
          texfile: '.tmp/' + reportName + '.tex',
          dir: 'report'
        }, function(err) {
          if (err) { res.serverError(err); }

          // Send file for download
          res.download('report/' + reportName + '.pdf',
            'file:///' + reportName + '.pdf');
        });
      });
    });
  },

  /**
   * Compile a pdf report and send back to be downloaded
   *
   * @param  {[int]}  req.query.user  [user]
   * @param  {[http]} res             [json user data / error]
   */
  user: function(req, res) {
    'use strict';

    User.getCourses(req.query.user, function(err, courses) {
      if (err) { res.send(err); }

      return res.json(courses);
    });
  }
};
