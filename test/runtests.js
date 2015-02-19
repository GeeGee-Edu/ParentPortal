var Sails = require('sails');

before(function(done) {
  Sails.lift({
    log: {
      level: 'error'
    },
    connections: {
      testDB: {
        adapter: 'sails-memory'
      }
    },
    models: {
      connection: 'testDB',
      migrate: 'drop'
    },

  }, function(err, sails) {
    app = sails;

    // Global models
    User = app.models.user;
    UserEnrolment = app.models.userenrolment;
    Enrolment = app.models.enrolment;
    Course = app.models.course;

    done(err);
  });
});

/**
 * Models
 */
require('../test/unit/models/user.spec');

/**
 * Controllers
 */
//require('../test/unit/controllers/report.spec');

/**
 * Services
 */
require('../test/unit/services/latex.spec');

/**
 * BDD
 */
require('../test/yadda-tests');

// Global after hook
after(function(done) {
  Sails.lower(done);
});
