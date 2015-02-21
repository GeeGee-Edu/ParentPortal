/**
 * Run BDD tests
 *
 */
var Yadda = require('yadda');
var Sails = require('sails');

// Start Sails Server
// This takes time...
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
    }
  }, function(err, sails) {
    console.log('Sails Lifted!');
    app = sails;

    require('../test/test-db').populate(done);
  });
});

/**
 * Models
 */
describe("\n* Models", function() {
  require('../test/unit/models/user.spec');
  require('../test/unit/models/cohort.spec');
});


/**
 * Controllers
 */
describe("\n* Controllers", function() {
  //require('../test/unit/controllers/report.spec');
});

/**
 * Services
 */
describe("\n* Services", function() {
  require('../test/unit/services/latex.spec');
});
