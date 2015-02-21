/**
 * User Unit tests
 *
 */
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var mainUser;

before(function(done) {
  var grades = 0;
  var courses = 0;
  var doneFlag = false;

  var addGrade = function(opts, cb) {
    grades++;
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
        grades--;
        if (grades === 0) {
          if(doneFlag){
            done();
          }
          doneFlag = true;
        }
      });
    });
  };

  var enrolCourse = function(opts, cb) {
    courses++;
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
          courses--;
          if (courses === 0) {
            if(doneFlag){
              done();
            }
            doneFlag = true;
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
    mainUser = user;
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

  addGrade({
    user: 1,
    course: 1,
    itemname: 'Item A',
    iteminfo: 'Item A is very important',
    feedback: 'Feedback A',
    timemodified: 5
  });
  addGrade({
    user: 1,
    course: 1,
    itemname: 'Item B',
    iteminfo: 'Item B is not very important',
    feedback: null,
    timemodified: 20
  });
  addGrade({
    user: 1,
    course: 1,
    itemname: 'Item C',
    iteminfo: 'Item C is very important',
    feedback: null,
    timemodified: 14
  });
  addGrade({
    user: 1,
    course: 1,
    itemname: 'Item D',
    iteminfo: 'Item D is very important',
    feedback: 'Feedback D',
    timemodified: 10
  });
  addGrade({
    user: 1,
    course: 1,
    itemname: 'Item E',
    iteminfo: 'Item E is very important',
    feedback: 'Feedback E',
    timemodified: 25
  });
});

/**
 * User Model Unit tests
 */
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
        User.getCourses({
          user: mainUser
        }, function(err, courses2) {
          should.not.exist(err);
          courses1.length.should.equal(courses2.length); // Not the best test
          done();
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
        User.getGrades({
          user: mainUser
        }, function(err, grades2) {
          should.not.exist(err);
          grades1.length.should.equal(grades2.length); // Not the best test
          done();
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
