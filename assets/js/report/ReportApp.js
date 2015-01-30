/*
 * Written by Gary Krige
 */
/* global angular */
var reportApp = angular.module('reportApp', []);

reportApp.controller('ReportController', function($scope, ReportFactory) {
  'use strict';

  $scope.report;

  $scope.newReport = function(name){
    $scope.report = new ReportFactory(name);
  };

});
