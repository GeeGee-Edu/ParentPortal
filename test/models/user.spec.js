var User = require('../../api/models/User'),
    sinon = require('sinon'),
    assert = require('assert');

describe('The User Model', function() {
    var tempUser;
    describe('fetching a user', function () {
        it('should return a user', function (done) {
            User.find().exec(function (err, user) {
                if(!err && user){
                    tempUser = user;
                    done();
                }
            });
        });
    });
    describe('fetching a user\'s courses', function() {
        it('should return course names and ids', function(done) {
            User.getCourses({
                userid: tempUser.id
            }, function(err, courses) {
                if(courses[0].name && courses[0].id){
                    done();
                }
            });
        });

        it("should call the callback for a valid id", function() {
            var callback = sinon.spy();
            User.getCourses(1, callback);

            assert(callback.called);
        });

        // it("should call the callback for an invalid id", function() {
        //     var callback = sinon.spy();
        //     User.getCourses(-1, callback);

        //     assert(callback.called);
        // });

    });
});
