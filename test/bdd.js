/**
 * Run BDD tests
 *
 */
var Yadda = require('yadda');
var Sails = require('sails');

Yadda.plugins.mocha.StepLevelPlugin.init();

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


describe('', function() {
  it('initialize yadda', function(done) {

    new Yadda.FeatureFileSearch('test/features').each(function(file) {

      featureFile(file, function(feature) {

        var libraries = require_feature_libraries(feature);
        var yadda = Yadda.createInstance(libraries, {
          app: app
        });

        scenarios(feature.scenarios, function(scenario) {
          steps(scenario.steps, function(step, done) {
            yadda.run(step, done);
          });
        });
      });
    });
    done();
  });
});

function require_feature_libraries(feature) {
    return feature.annotations.libraries.split(', ').reduce(require_library, []);
}

function require_library(libraries, library) {
    return libraries.concat(require('./lib/' + library + '-steps'));
}

// Stop the Sail Server
after(function(done) {
  Sails.lower(done);
});
