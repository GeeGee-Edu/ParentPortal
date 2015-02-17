var should = require('should');
var English = require('yadda').localisation.English;
var http = require('http');

module.exports = (function() {

  var library = English.library();

  library.given("cohort 1 has members", function(next) {
    var report = require('../../api/services/Report');
    report.generateHTML({cohort: 6});

    this.app.models.cohortmember.find({
      where: {cohort: 1}
    }).limit(1).exec(function(err, member){

      should(member).be.ok;
      next();
    });
  });

  library.when("an authorised user clicks generate report", function(next) {
    http.get('http://localhost:1337/', function (res) {
      res.statusCode.should.equal(200);
      next();
    });
  });


  library.then("a PDF is downloaded", function(next) {

    next();
  });

  return library;
})();
