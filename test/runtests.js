var path = require('path');
var Yadda = require('yadda');
var should = require('should');
var Sails = require('sails/lib/app');
var app = Sails();

Yadda.plugins.mocha.StepLevelPlugin.init();

before(function(done) {
    // Lift Sails and store the app reference
    app.lift({
        globals: true,
        models: {
            connection: 'geegeeServer'
        }
    }, function() {
        done();
    });
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
// After Function
after(function(done) {

    app.lower(done);
});

function require_feature_libraries(feature) {
    return feature.annotations.libraries.split(', ').reduce(require_library, []);
}

function require_library(libraries, library) {
    return libraries.concat(require('./lib/' + library + '-steps'));
}



// describe.only('Cohort', function() {
//     describe('id 1', function() {
//         it('should have members', function (done) {
//             CohortMember.find().limit(1).exec(function(err, member) {
//                 member.should.be.ok;
//                 done();
//             });
//         });
//     });
// });

