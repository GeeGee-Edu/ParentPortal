/**
 * ReportController
 *
 * @description :: Server-side logic for managing Reports
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
/* global Report */
module.exports = {

  /**
   * Reports  Home page
   */
  index: function(req, res) {
    'use strict';
    return res.view('report.ejs');
  },

  /**
   * Generate html Report.
   *
   * N.B. query.cohort required.
   *
   */
  html: function(req, res) {
    'use strict';
    console.log('---\nRequested Cohort ID: ' + req.param('cohort'));

    Report.generateHTML({cohort: req.param('cohort')}, function(err, html){
      if(err){
        console.log(err);
        res.send(err);
      }

      console.log('DONE\n---');
      return res.send(html);
    });

  },

  pdf: function(req, res){
    'use strict';

    console.log(req.param('cohort'));

    var page = require('phantom');

    page.create(function(ph){
      ph.createPage(function(page) {
        page.open('http://localhost:1337/report/html?cohort=' +
          req.param('cohort'), function(status) {
            console.log(status);

            page.set('paperSize', {
              format: 'A4',
              orientation: 'portrait',
              margin: '1cm'
            });

            page.render('report.pdf', function(){
              res.download('report.pdf', 'file:///report.pdf');
              ph.exit();
            });
          });
      });
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
