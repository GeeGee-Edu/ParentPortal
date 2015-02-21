/**
 * User Unit tests
 *
 */
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

describe('- User', function() {
  /**
   * getCourses
   */
  describe('getCourses', function() {
    it('should accept user or id as opts.user', function(done){
      User.getCourses({
        user: 1
      }, function(err, courses1) {
        should.not.exist(err);

        User.findById(1, function(err,user){
          User.getCourses({
            user: user[0]
          }, function(err, courses2) {
            should.not.exist(err);
            done();
          });
        });
      });
    });
    describe('valid user enrolled in 2 courses', function() {
      var cache_courses;
      it('should return a list of 2 courses', function(done) {
        User.getCourses({
          user: 1
        }, function(err, courses) {
          cache_courses = courses;
          should.not.exist(err);
          courses.should.have.length(2);
          done();
        });
      });

      it('should contain course details', function() {
        cache_courses[0].should.have.property('fullname');
        cache_courses[0].should.have.property('shortname');
      });

      it('should be sorted alphabetically', function() {
        for (var i = 0; i < cache_courses.length - 1; i++) {
          (cache_courses[i].fullname > cache_courses[i+1].fullname).should.be.true; // jshint ignore:line
        }
      });
    });

    describe('valid user not enrolled in any courses', function() {
      it('should return an empty list', function(done) {
        User.getCourses({
          user: 2
        }, function(err, courses) {
          should.not.exist(err);
          courses.should.have.length(0);
          done();
        });
      });
    });

    describe('invalid user', function() {
      it('should return an empty list', function(done) {
        User.getCourses({
          user: 100
        }, function(err, courses) {
          courses.should.be.length(0);
          done();
        });
      });
    });
  });

  /**
   * CourseGrades
   */
  describe('getGrades', function() {
    it('should accept user or id as opts.user', function(done){
      User.getGrades({
        user: 1
      }, function(err, grades1) {
        should.not.exist(err);
        User.findById(1, function(err,user){
          User.getGrades({
            user: user[0]
          }, function(err, grades2) {
            should.not.exist(err);
            done();
          });
        });
      });
    });
    describe('valid user with 3 grades in the timeframe', function() {
      var cache_grades;
      it('should return a list of 3 grades', function(done) {
        User.getGrades({
          user: 1,
          timefrom: 10,
          timeuntil: 20
        }, function(err, grades) {
          cache_grades = grades;
          should.not.exist(err);
          grades.should.have.length(3);
          done();
        });
      });

      it('should have grades sorted by time oldest to newest)', function() {
        for (var i = 0; i < cache_grades.length - 1; i++) {
          cache_grades[i].timemodified.should.be.at.least(cache_grades[i+1].timemodified);
        }
      });

      it('should contain grades only inside the timeframe', function() {
        for (var i = 0; i < cache_grades.length; i++) {
          cache_grades[i].timemodified.should.be.at.most(20);
          cache_grades[i].timemodified.should.be.at.least(10);
        }
      });
    });

    describe('valid user with grades without a timeframe', function() {
      it('should return a list of 5 grades', function(done) {
        User.getGrades({
          user: 1
        }, function(err, grades) {
          should.not.exist(err);
          grades.should.have.length(5);
          done();
        });
      });
    });

    describe('valid user without grades', function() {
      it('should return an empty list', function(done) {
        User.getGrades({
          user: 2
        }, function(err, grades) {
          should.not.exist(err);
          grades.should.have.length(0);
          done();
        });
      });
    });

    describe('invalid user', function() {
      it('should return an error', function(done) {
        User.getGrades({
          user: 100
        }, function(err, grades) {
          grades.should.be.length(0);
          done();
        });
      });
    });
  });
});
