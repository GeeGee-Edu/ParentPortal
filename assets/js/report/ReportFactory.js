app.factory("ReportFactory", function($http) {
  // Define the Student function
  var Report = function(username) {
    this.initialize = function() {
      self.user = "";
    };

    this.initialize();
  };

  // Return a reference to the function
  return Report;
});
