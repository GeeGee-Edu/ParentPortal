var path = require('path');
var Yadda = require('yadda');
var should = require('should'),
    CohortMember = require('../../api/models/CohortMember'),
    Waterline = require('waterline'),
    diskAdapter = require('sails-disk');
var app;

Yadda.plugins.mocha.StepLevelPlugin.init();

before(function(done) {
    // Create a model using sails-disk
    MovieModel.adapter = 'disk';
    Movie = Waterline.Collection.extend(MovieModel);
    new Movie({ adapters: { disk: diskAdapter }}, function(err, collection) {
        if (err) {
            done(err);
        }
        else {
            movieCollection = collection;
            collection.create({ movieId: '1', name: 'The Godfather', releaseDate: new Date(), rating: 'R'})
                .done(function(err, mockMovie) {
                    if (err) {
                        done(err);
                    }
                    else {
                        movie = mockMovie;
                        done();
                    }
                });
        }
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

/**
 * Delete everything from sails-disk.  A clean HD is a happy HD.
 */
after(function(done) {
    movieCollection.destroy().done(function(err) {
        if (err) {
            done(err);
        }
        else {
            done();
        }
    });
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

