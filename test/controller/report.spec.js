var ReportController = require('../../api/controllers/ReportController'),
    sinon = require('sinon'),
    assert = require('assert');

describe('The Report Controller', function () {
    describe('when we load the index page', function () {
        it ('should render the view', function () {
            var view = sinon.spy();
            ReportController.index(null, {
                view: view
            });
            assert.ok(view.called);
        });
    });

    describe('when we load the \ page', function () {
        it ('should render the view', function () {
            var view = sinon.spy();
            ReportController.index(null, {
                view: view
            });
            assert.ok(view.called);
        });
    });
});
