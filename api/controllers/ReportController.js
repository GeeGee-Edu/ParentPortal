/**
 * ReportController
 *
 * @description :: Server-side logic for managing Reports
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
/* global PDFReport */
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

    PDFReport.writePDF({cohort: req.query.cohort}, function(err, result){
      if(err){
        console.log(err);
        res.send(err);
      }

      res.send('done\n' + result);
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
