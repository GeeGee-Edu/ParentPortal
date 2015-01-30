/* global reportApp */
reportApp.factory('ReportFactory', function($http) {
  'use strict';

  /**
   * This is the ReportRactory.
   * @param {string} name
   */
  var Report = function(name) {
    this.initialise = function() {
      var self = this;
      var reportData = $http.get('/report/user?name=' + name);

      reportData.then(function(response) {
          self.courses = response.data.courses;
          self.grades = response.data.grades;
          console.log('Courses : ' + self.courses.length);
        },
        function(error) {
          console.log('Report' + error);
        }
      );
    };

    this.initialise();
  };

  return Report;
});
