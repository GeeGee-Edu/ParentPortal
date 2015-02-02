/*
 * Written by Gary Krige
 */
/* global angular */
var reportApp = angular.module('reportApp', []);

reportApp.controller('ReportController', function($scope, ReportFactory) {
  'use strict';

  //Start with null user.
  $scope.report = undefined;

  /**
   * Get a new user's report
   * @param  {string} name
   * @return {null}
   */
  $scope.newReport = function(name){
    $scope.report = new ReportFactory(name);
  };
});
