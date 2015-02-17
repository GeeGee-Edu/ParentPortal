var assert = require('assert');
var English = require('yadda').localisation.English;
var ReportController = require('../../api/controllers/ReportController'); // The library that you wish to test

module.exports = (function() {
  var library = English.library();

  library.given("a week of grades from a cohort of users", function(next) {
    next();
  });

  library.given("students with different length reports", function(next) {
    next();
  });


  library.when("the manager clicks print", function(next) {
    next();
  });

  library.when("the report is downloaded", function(next) {
    next();
  });


  library.then("should download a pdf report", function(next) {
    next();
  });

  library.then("each report should start on a new page", function(next) {
    next();
  });

  return library;
})();
