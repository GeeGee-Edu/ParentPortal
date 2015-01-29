app.factory("ReportFactory", function($http) {
  // Define the Student function
  var Report = function(username) {
    this.initialize = function() {
      var self = this;
      var reportData = $http.get('/report?' + username);

      //Resolve promise
      reportData.then(function(response) {
        //This needs to fetch all report data to be shown

        self.data = response.data;
      },
      function(error){
        console.log(result);
      });
    };

    this.initialize();
  };

  // Return a reference to the function
  return Report;
});
