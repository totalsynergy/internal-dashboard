app.directive("synergyValues", function(){


  var controller = function($scope, Service, $timeout){

    $scope.valueActive = 1;
    
    $scope.timer = null;
    $scope.timer2 = null;
    $scope.count = 0;
    
    $scope.$on("keysUpdated", function(){console.log("atles we found it");})
    
    $scope.$watch('tab', function(){

      if($scope.tab == 34){
        runTimer();
        $scope.count = 0;
      }
      else if($scope.count == 0){
        $timeout.cancel($scope.timer); $timeout.cancel($scope.timer2);
        $timeout(function(){
          $scope.valueActive = 1;
        },1000);

        $scope.count++;
      }
    });


    function runTimer(){
      var speedIntervals = Service.speed/3;

      $scope.timer = $timeout(function(){
        $scope.valueActive = 2;
        $scope.timer2 = $timeout(function(){
          $scope.valueActive = 3;
        },speedIntervals);
      },speedIntervals);
    }


  };

  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/SynergyValues.html',
    controller: controller,
    scope: {
      tab : "=tab"
    }
  }
  
});
