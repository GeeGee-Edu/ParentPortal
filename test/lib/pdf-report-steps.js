var should = require('chai').should();
var English = require('yadda').localisation.English;
var http = require('http');

module.exports = (function() {

  var library = English.library();

  library.given("cohort has members", function(next) {
    this.app.models.cohortmember.find({
      where: {cohort: 1} //This cohort must have members
    }).limit(1).exec(function(err, member){
      should.exist(member);
      next();
    });
  });

  // library.given("cohort has no members", function(next) {
  //   this.app.models.cohortmember.find({
  //     where: {cohort: 1} //This cohort must not have members
  //   }).limit(1).exec(function(err, member){
  //     should.not.exist(member);
  //     next();
  //   });
  // });

  library.when("an authorised user clicks generate report", function(next) {
    http.get('http://localhost:1337/report', function (res) {
      res.statusCode.should.equal(200);
      next();
    });
  });


  library.then("a PDF is downloaded", function(next) {
    http.get('http://localhost:1337/report/pdf?cohortid=1', function (res) {
      res.statusCode.should.equal(200);
      next();
    });
  });

  return library;
})();
