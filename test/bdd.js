var Yadda = require('yadda');
var Sails = require('sails');

Yadda.plugins.mocha.StepLevelPlugin.init();

before(function(done) {
  Sails.lift({
    log: {
      level: 'error'
    },
    models: {
      connection: 'localServer',
      migrate: 'safe'
    }
  }, function(err, sails) {
    app = sails;
    if (err){
      return done(err);
    }
    done(err, sails);
  });
});

// Global after hook
after(function(done) {
  Sails.lower(done);
});


it('--- BDD Tests (via Yadda) ---', function(done){
    new Yadda.FeatureFileSearch('test/features').each(function(file) {

        featureFile(file, function(feature) {

            var libraries = require_feature_libraries(feature);
            var yadda = Yadda.createInstance(libraries, {app: app});

            scenarios(feature.scenarios, function(scenario) {
                steps(scenario.steps, function(step, done) {
                    yadda.run(step, done);
                });
            });
        });
    });
    done();
});

function require_feature_libraries(feature) {
    return feature.annotations.libraries.split(', ').reduce(require_library, []);
}

function require_library(libraries, library) {
    return libraries.concat(require('./lib/' + library + '-steps'));
}