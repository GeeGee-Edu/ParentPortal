app.controller("MemberController", function($scope, CohortMemberFactory) {
  $scope.cohortMembers = new CohortMemberFactory();
  $scope.days = ["Mon","Tue","Wed", "Thu"];
  $scope.studentName = "";

  //Filter selected cohorts
  $scope.cohortFilter = function(member){

    for(var i = 0; i< $scope.cohortMembers.uniqueCohorts.length; i++){
      //Check that the cohort is selected then check if member belongs to it
      if($scope.cohortMembers.uniqueCohorts[i].selected
        & member.cohort.toLowerCase().indexOf(
          $scope.cohortMembers.uniqueCohorts[i].name.toLowerCase()) > -1)
        return true;
      }
    return false;
  }

  //Only filter student name
  $scope.studentFilter = function(member){
    return member.fullname.toLowerCase().indexOf(
      $scope.studentName.toLowerCase()) > -1;
  }

});
