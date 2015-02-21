module.exports = {
  populate: function(done){
    var tasks = 0;

    var checkdone = function(){
      if(--tasks === 0){
        done();
      }
    };

    var addGrade = function(opts, cb) {
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
          cb();
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
            cb();
          });
        });
      });
    };

    User.create({
      firstname: 'John',
      lastname: 'Foo',
      username: 'jfoo'
    }).exec(function(err, user) {
      tasks++;
      enrolCourse({
        user: user,
        fullname: 'Course A',
        shortname: 'A'
      }, function(){
        checkdone();
      });

      tasks++;
      enrolCourse({
        user: user,
        fullname: 'Course B',
        shortname: 'B'
      }, function(){
        checkdone();
      });
    });

    tasks++;
    User.create({
      firstname: 'Bob',
      lastname: 'Foo',
      username: 'bfoo'
    }).exec(function(err, user) {
      checkdone();
    });

    tasks++;
    addGrade({
      user: 1,
      course: 1,
      itemname: 'Item A',
      iteminfo: 'Item A is very important',
      feedback: 'Feedback A',
      timemodified: 5
    }, function(){
      checkdone();
    });

    tasks++;
    addGrade({
      user: 1,
      course: 1,
      itemname: 'Item B',
      iteminfo: 'Item B is not very important',
      feedback: null,
      timemodified: 20
    }, function(){
      checkdone();
    });

    tasks++;
    addGrade({
      user: 1,
      course: 1,
      itemname: 'Item C',
      iteminfo: 'Item C is very important',
      feedback: null,
      timemodified: 14
    }, function(){
      checkdone();
    });

    tasks++;
    addGrade({
      user: 1,
      course: 1,
      itemname: 'Item D',
      iteminfo: 'Item D is very important',
      feedback: 'Feedback D',
      timemodified: 10
    }, function(){
      checkdone();
    });

    tasks++;
    addGrade({
      user: 1,
      course: 1,
      itemname: 'Item E',
      iteminfo: 'Item E is very important',
      feedback: 'Feedback E',
      timemodified: 25
    }, function(){
      checkdone();
    });

    tasks++;
    Cohort.create({
      name: 'Has Member with Grades'
    }).exec(function(err, cohort) {
      mainCohort = cohort;
      CohortMember.create({
        cohort: cohort,
        user: 1
      }).exec(function(err, cohortMember){
        checkdone();
      });
    });

    tasks++;
    Cohort.create({
      name: 'Has Member without Grades'
    }).exec(function(err, cohort) {
      CohortMember.create({
        cohort: cohort,
        user: 2
      }).exec(function(err, cohortMember){
        checkdone();
      });
    });

    tasks++;
    Cohort.create({
      name: 'Has no Members'
    }).exec(function(err, cohort) {
      checkdone();
    });

    tasks++;
    Cohort.create({
      name: 'Populated'
    }).exec(function(err, cohort) {
      CohortMember.create({
          cohort: cohort,
          user: 1
      }).exec(function(err, cohortmember) {
          checkdone();
      });
    });
  }
};
