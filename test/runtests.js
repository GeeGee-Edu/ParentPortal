var Sails = require('sails');

before(function(done) {
  console.log('Lifing Sails...');
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
    console.log('Sails Lifted!');
    app = sails;
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
