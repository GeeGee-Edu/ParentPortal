/**
 * Cohort Unit tests
 *
 */
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var mainCohort;

before(function(done) {
  var tasks = 3;

  Cohort.create({
    name: 'Has Member with Grades'
  }).exec(function(err, cohort) {
    mainCohort = cohort;
    CohortMember.create({
      cohort: cohort,
      user: 1
    }).exec(function(err, cohortMember){
      tasks--;
      if(tasks === 0){
        done();
      }
    });
  });

  Cohort.create({
    name: 'Has Member without Grades'
  }).exec(function(err, cohort) {
    CohortMember.create({
      cohort: cohort,
      user: 2
    }).exec(function(err, cohortMember){
      tasks--;
      if(tasks === 0){
        done();
      }
    });
  });

  Cohort.create({
    name: 'Has no Members'
  }).exec(function(err, cohort) {
    tasks--;
    if(tasks === 0){
      done();
    }
  });
});

/**
 * Cohort Model Unit tests
 */
describe('- Cohort', function() {
  /*
   * getUsersData
   */
  describe('getUsersData', function() {
    it('should accept cohort or id as opts.cohort', function(done){
      Cohort.getUsersData({
        cohort: 1
      }, function(err, data1) {
        should.not.exist(err);
        Cohort.getUsersData({
          cohort: mainCohort
        }, function(err, data2) {
          should.not.exist(err);
          data1.length.should.equal(data2.length); // Not the best test
          done();
        });
      });
    });
    describe('valid cohort with 1 member with grades', function() {
      var cache_data;
      it('should return an array of 1 object', function(done) {
        Cohort.getUsersData({
          cohort: 1
        }, function(err, data) {
          cache_data = data;
          should.not.exist(err);
          data.should.have.length(1);
          done();
        });
      });

      it('object should contain a user', function() {
        cache_data[0].should.have.property('user');
      });

      it('object should contain non-empty courses', function() {
        cache_data[0].should.have.property('courses');
        cache_data[0].courses.length.should.be.above(0);
      });

      it('object should contain non-empty grades', function() {
        cache_data[0].should.have.property('grades');
        cache_data[0].grades.length.should.be.above(0);
      });
    });

    describe('valid cohort with 1 member without grades', function() {
      var cache_data;
      it('should return an array of 1 object', function(done) {
        Cohort.getUsersData({
          cohort: 2
        }, function(err, data) {
          cache_data = data;
          should.not.exist(err);
          data.should.have.length(1);
          done();
        });
      });

      it('object should contain a user', function() {
        cache_data[0].should.have.property('user');
      });

      it('object should contain empty courses', function() {
        cache_data[0].should.have.property('courses');
        cache_data[0].courses.length.should.equal(0);
      });

      it('object should contain empty grades', function() {
        cache_data[0].should.have.property('grades');
        cache_data[0].grades.length.should.equal(0);
      });
    });

    describe('invalid cohort', function() {
      var cache_data;
      it('should return an error', function(done) {
        Cohort.getUsersData({
          cohort: 100
        }, function(err, data) {
          should.exist(err);
          done();
        });
      });
    });
  });
});
