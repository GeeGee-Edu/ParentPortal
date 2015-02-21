var should = require('chai').should();
var expect = require('chai').expect;
var English = require('yadda').localisation.English;
var http = require('http');

module.exports = (function() {

  var library = English.library();

  /**
   *
   * GIVENS
   *
   */
  library.given("cohort doesn't exist", function(next) {
    Cohort.getUsersData({
      cohort: 1000
    }, function(err, data){
      expect(err).to.exist; // jshint ignore:line
      expect(err).to.be.equal('Invalid Cohort');
      next();
    });
  });

  library.given("cohort has no members", function(next) {
    Cohort.getUsersData({
      cohort: 3
    }, function(err, data){
      expect(err).to.exist; // jshint ignore:line
      next();
    });
  });

  library.given("cohort has members without grades", function(next) {
    Cohort.getUsersData({
      cohort: 2
    }, function(err, data){
      expect(err).to.exist; // jshint ignore:line
      next();
    });
  });

  library.given("cohort has members with grades", function(next) {
    Cohort.getUsersData({
      cohort: 1
    }, function(err, data){
      expect(err).not.to.exist; // jshint ignore:line
      expect(data).to.have.length.above(0);
      expect(data[0]).to.have.property('user');
      expect(data[0].user).to.exist; // jshint ignore:line
      expect(data[0]).to.have.property('grades');
      expect(data[0].grades).to.have.length.above(0);
      expect(data[0]).to.have.property('courses');
      expect(data[0].courses).to.have.length.above(0);
      next();
    });
  });

  library.given("cohort has members with grades in timeframe", function(next) {
    Cohort.getUsersData({
      cohort: 1,
      timefrom: 10,
      timeuntil: 20
    }, function(err, data){
      expect(err).not.to.exist; // jshint ignore:line
      expect(data).to.have.length.above(0);
      expect(data[0]).to.have.property('user');
      expect(data[0].user).to.exist; // jshint ignore:line
      expect(data[0]).to.have.property('grades');
      expect(data[0].grades).to.have.length.above(0);
      expect(data[0]).to.have.property('courses');
      expect(data[0].courses).to.have.length.above(0);
      next();
    });
  });

  /**
   *
   * WHENS
   *
   */
  library.when("an authorised user clicks generate report", function(next) {
    http.get('http://localhost:1337/report/', function (res) {
      //This needs to use authorisation
      res.statusCode.should.equal(200);
      next();
    });
  });

  /**
   *
   * THENS
   *
   */
  library.then("grades should be sorted", function(next) {
    Cohort.getUsersData({
      cohort: 1
    }, function(err, data){
      var grades = data[0].grades;
      for (var i = 0; i < grades.length - 1; i++) {
        grades[i].timemodified.should.be.at.least(grades[i+1].timemodified);
      }
      next();
    });
  });

  library.then("grades should be sorted and only in timeframe", function(next) {
    Cohort.getUsersData({
      cohort: 1,
      timefrom: 10,
      timeuntil: 20
    }, function(err, data){
      var grades = data[0].grades;
      for (var i = 0; i < grades.length - 1; i++) {
        grades[i].timemodified.should.be.at.least(grades[i+1].timemodified);
        grades[i].timemodified.should.be.at.most(20);
        grades[i].timemodified.should.be.at.least(10);
      }
      grades[grades.length-1].timemodified.should.be.at.most(20);
      grades[grades.length-1].timemodified.should.be.at.least(10);
      next();
    });
  });

  library.then("invalid cohort 400 error", function(next) {
    http.get('http://localhost:1337/report/pdf?cohortid=100', function (res) {
      res.statusCode.should.equal(400);
      //res.error.should.equal("Invalid Cohort");
      next();
    });
  });

  library.then("no members 400 error", function(next) {
    http.get('http://localhost:1337/report/pdf?cohortid=3', function (res) {
      res.statusCode.should.equal(400);
      //res.error.should.equal("No Members");
      next();
    });
  });

  library.then("no grades 400 error", function(next) {
    http.get('http://localhost:1337/report/pdf?cohortid=2', function (res) {
      res.statusCode.should.equal(400);
      //res.error.should.equal("No Grades");
      next();
    });
  });

  library.then("a PDF is downloaded", function(next) {
    http.get('http://localhost:1337/report/pdf?cohortid=1', function (res) {
      res.statusCode.should.equal(200);
      next();
    });
  });

  library.then("a timeframed PDF is downloaded", function(next) {
    http.get('http://localhost:1337/report/pdf?cohortid=1&timefrom=01/01/1970&timeuntil=01/01/2000', function (res) {
      res.statusCode.should.equal(200);
      next();
    });
  });

  return library;
})();
