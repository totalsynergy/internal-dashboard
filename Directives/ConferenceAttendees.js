
app.directive("conferenceAttendees", function(){
  
  
    var controller = function($scope, Service, ngAudio){
    $scope.totalAttendees = 0;
    $scope.sound = ngAudio.load("assets/bell.mp3");
    $scope.count = 0;

    $scope.$on('attendeesUpdated', function() {
      if($scope.totalAttendees != Service.totalAttendees && $scope.totalAttendees != 0){
        $scope.sound.play();
        Service.updateTab(3);
      }
      $scope.totalAttendees = Service.totalAttendees;
      if($scope.totalAttendees >= 112 || ($scope.totalAttendees >= 100 && $scope.totalAttendees <= 102) && $scope.count == 0){
        runConfetti();
        $scope.count++;
      }
    });

  }
  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/conferenceAttendees.html',
    controller: controller,
    scope: {
      tab : "=tab",
    }
  }
  
});






