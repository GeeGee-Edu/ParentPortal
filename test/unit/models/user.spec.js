var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

before(function(done) {
  var tasks = 0;
  var addGrade = function(opts, cb) {
    tasks++;
    GradeItem.create({
      itemname: opts.itemname,
      iteminfo: opts.iteminfo,
      grademax: 10,
      hidden: 0,
      course: opts.course
    }).exec(function(err, item) {
      Grade.create({
        user: opts.user,
        item: item,
        finalgrade: 5,
        rawgrademax: 10,
        usermodified: 100,
        timemodified: opts.timemodified,
        hidden: 0,
        feedback: opts.feedback
      }).exec(function(err, grade) {
        tasks--;
        if (tasks === 0) {
          done();
        }
      });
    });
  };
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
        }).exec(function(err, userenrol) {
          addGrade({
            user: opts.user,
            course: course,
            itemname: 'Item A',
            iteminfo: 'Item A is very important',
            feedback: 'Feedback A',
            timemodified: 5
          });
          addGrade({
            user: opts.user,
            course: course,
            itemname: 'Item B',
            iteminfo: 'Item B is not very important',
            feedback: null,
            timemodified: 16
          });
          addGrade({
            user: opts.user,
            course: course,
            itemname: 'Item C',
            iteminfo: 'Item C is very important',
            feedback: null,
            timemodified: 14
          });
          addGrade({
            user: opts.user,
            course: course,
            itemname: 'Item D',
            iteminfo: 'Item D is very important',
            feedback: 'Feedback D',
            timemodified: 12
          });
          addGrade({
            user: opts.user,
            course: course,
            itemname: 'Item E',
            iteminfo: 'Item E is very important',
            feedback: 'Feedback E',
            timemodified: 25
          });
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

  User.create({
    firstname: 'Bob',
    lastname: 'Foo',
    username: 'bfoo'
  }).exec(function(err, user) {});
});


/**
 * User Model Unit tests
 *
 */
describe('- User', function() {

  /**
   * getCourses
   *
   */
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
          cache_courses[i].fullname.should.be.most(cache_courses[i+1].fullname);
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

  /**
   * CourseGrades
   *
   */
  describe('getCourseGrades', function() {
    describe('valid user with grades and a timeframe', function() {
      var cache_courseGrades;
      it('should return an object', function(done) {
        User.getCourseGrades({
          id: 1,
          timefrom: 10,
          timeuntil: 20
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

      it('should contain courses and grades', function() {
        cache_courseGrades.should.have.property('courses');
        cache_courseGrades.courses.should.have.length.above(0);
        cache_courseGrades.should.have.property('grades');
        cache_courseGrades.grades.should.have.length.above(0);
      });

      it('should have grades sorted by time', function() {
        var grades = cache_courseGrades.grades;
        for (var i = 0; i < grades.length - 1; i++) {
          grades[i].timemodified.should.be.at.least(grades[i+1].timemodified);
        }
      });

      it('should contain grades only inside the timeframe', function() {
        var grades = cache_courseGrades.grades;
        for (var i = 0; i < grades.length; i++) {
          grades[i].timemodified.should.be.below(20);
          grades[i].timemodified.should.be.above(10);
        }
      });
    });

    describe('valid user without grades', function() {
      var cache_courseGrades;
      it('should return an object', function(done) {
        User.getCourseGrades({
          id: 2
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

      it('should return an empty list of grades and courses', function() {
        cache_courseGrades.should.have.property('grades');
        cache_courseGrades.grades.should.have.length(0);
        cache_courseGrades.should.have.property('courses');
        cache_courseGrades.courses.should.have.length(0);

      });
    });

    describe('invalid user', function() {
      it('should return an error', function(done) {
        User.getCourseGrades({
          id: 100
        }, function(err) {
          should.exist(err);
          done();
        });
      });
    });
  });
});
