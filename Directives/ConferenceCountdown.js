
app.directive("conferenceCountdown", function(){
  
  
  var  controller = function($scope, $http, Service, $interval){

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
        if($scope.eventDate > currentDate){
        var secondsDate = (d - currentDate) / 1000;

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
      
      $http.get("https://www.eventbriteapi.com/v3/events/17562070626/?token=" + $scope.eventBriteKey)
      .success(function(data){
        
        $scope.eventDate = new Date(data.start.utc).getTime();
        timerUpdate($scope.eventDate);

        
      })
      .error(function(){
        //
      })
    }

    this.parseJsonDate = function(jsonDateString) {
       return new Date(parseInt(jsonDateString.replace('"', '')));
    }
  }
  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/conferenceCountdown.html',
    controller: controller,
    scope : {
      tab : "=tab",
      keys: "=keys"
    }
  }
  
});






