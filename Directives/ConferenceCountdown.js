
app.directive("conferenceCountdown", function(){
  
  
  var  controller = function($scope, $http, Service, $interval, EventbriteService){

    $scope.days = 0;
    $scope.hours = 0;
    
    
    $scope.$watch('keys', function(){
      $scope.eventBriteKey = $scope.keys[1];
      $scope.totalSynergyKey = $scope.keys[0];
      getConferenceData();
    })

    function timerUpdate(d){

      
  
      $interval(function(){

        var currentDate = new Date().getTime();
      

        if($scope.eventDate > currentDate)
        {

          var secondsDate = ($scope.eventDate - currentDate) / 1000;
  
          $scope.days = parseInt(secondsDate / 86400);
          var secondsLeft = secondsDate % 86400;
  
          $scope.hours = parseInt(secondsLeft / 3600);
          secondsLeft = secondsLeft % 3600;
  
          $scope.minutes = parseInt(secondsLeft / 60);
          $scope.seconds = parseInt(secondsLeft % 60);

        }
      },1000);  //change this to minutes
    }

    function getConferenceData(){
      
      $scope.eventDate = new Date(2017, 2, 16, 8, 0, 0, 0).getTime();
      timerUpdate($scope.eventDate);

    }

    this.parseJsonDate = function(jsonDateString) {
       return new Date(parseInt(jsonDateString.replace('"', '')));
    }
  }
  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/ConferenceCountdown.html',
    controller: controller,
    scope : {
      tab : "=tab",
      keys: "=keys"
    }
  }
  
});






