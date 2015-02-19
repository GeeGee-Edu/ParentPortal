var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

before(function(done) {
  var tasks = 2;
  var enrolCourse = function(opts, cb) {
    Course.create({
      fullname: opts.fullname,
      shortname: opts.shortname
    }).exec(function(err, course) {

      Enrolment.create({
        course: course
      }).exec(function(err, enrolment) {

        UserEnrolment.create({
          user: opts.user,
          enrolment: enrolment
        }).exec(function(err, res) {
          tasks--;
          if (tasks === 0) {
            done();
          }
        });
      });
    });
  };
  User.create({
    firstname: 'John',
    lastname: 'Foo',
    username: 'jfoo'
  }).exec(function(err, user) {

    enrolCourse({
      user: user,
      fullname: 'Course A',
      shortname: 'A'
    });
    enrolCourse({
      user: user,
      fullname: 'Course B',
      shortname: 'B'
    });
  });
});

describe('User Model', function() {
  describe('getCourses', function() {
    describe('valid user enrolled in 2 courses', function() {
      var cache_courses;
      it('should return a list of 2 courses', function(done) {
        User.getCourses({
          id: 1
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
          (cache_courses[i].fullname > cache_courses[i + 1].fullname).should.be.true; // jshint ignore:line
        }
      });
    });

    describe('valid user not enrolled in any courses', function() {
      it('should return an empty list of courses', function(done) {
        User.getCourses({
          id: 100
        }, function(err, courses) {
          should.not.exist(err);
          courses.should.have.length(0);
          done();
        });
      });
    });
  });

  describe('getCourseGrades', function() {
    describe('valid user enrolled in a course with grades', function() {
      var cache_courseGrades;
      it('should return an object', function(done) {
        User.getCourseGrades({
          id: 1
        }, function(err, courseGrades) {
          cache_courseGrades = courseGrades;
          should.not.exist(err);
          courseGrades.should.be.an('object');
          done();
        });
      });

      it('should contain a user', function() {
        cache_courseGrades.should.have.property('user');
        cache_courseGrades.user.should.exist; // jshint ignore:line
      });

      it('should contain courses', function() {
        cache_courseGrades.should.have.property('courses');
        cache_courseGrades.courses.should.have.length.above(0); // jshint ignore:line
      });

      it('should contain and grades', function() {
        cache_courseGrades.should.have.property('grades');
        cache_courseGrades.grades.should.have.length.above(0); // jshint ignore:line
      });

      it('should have grades sorted by time', function() {
        var grades = cache_courseGrades.grades;
        for (var i = 0; i < grades.length - 1; i++) {
          (grades[i].timemodified < grades[i + 1].timemodified).should.be.true; // jshint ignore:line
        }
      });
    });

    describe('valid user not enrolled in any courses', function() {
      it('should return an empty list of courses', function(done) {
        User.getCourses({
          id: 100
        }, function(err, courses) {
          should.not.exist(err);
          courses.should.have.length(0);
          done();
        });
      });
    });
  });
});
