var Yadda = require('yadda');

Yadda.plugins.mocha.StepLevelPlugin.init();

it('--- BDD Tests ---', function(done){

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
