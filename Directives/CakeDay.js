app.directive("cakeDay", function(){


  var controller = function($scope, BambooHRService, ngAudio, $http, $interval){
  
      $scope.$watch('keys', function(){
        $scope.bambooHRKey = $scope.keys[6];
        getBirthdays();
      });
      
      $interval(getBirthdays, 2000000);
      
      function getBirthdays(){
        
        //Not yet implemented
        
        /*
        BambooHRService.getBirthdays($scope.bambooHRKey).then(function(success){
          sortBirthdays(success);
        });
        */
      }
      
      function sortBirthdays(data){
        //do something
      }
  
  };

  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/CakeDay.html',
    controller: controller,
    scope: {
      tab : "=tab",
      keys: "=keys"
    }
  }
  
});
