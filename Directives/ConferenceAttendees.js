
app.directive("conferenceAttendees", function(){
  
  
    var controller = function($scope, MailchimpService, Service, ngAudio){
      
      $scope.totalAttendees = 0;
      $scope.sound = ngAudio.load("assets/bell.mp3");
      $scope.count = 0;
  
      $scope.$on('attendeesUpdated', function() {
        if($scope.totalAttendees != MailchimpService.totalAttendees && $scope.totalAttendees != 0){
          Service.updateTab(3, function(){
            $scope.sound.play();
          });
        }
        $scope.totalAttendees = MailchimpService.totalAttendees;
        if($scope.totalAttendees >= 112 || ($scope.totalAttendees >= 100 && $scope.totalAttendees <= 102) && $scope.count == 0){
          runConfetti("canvas");
          $scope.count++;
        }
      });

  }
  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/ConferenceAttendees.html',
    controller: controller,
    scope: {
      tab : "=tab",
    }
  }
  
});






