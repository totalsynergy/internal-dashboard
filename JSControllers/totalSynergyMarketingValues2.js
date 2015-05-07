app.controller('KPI34', function($scope, Service, $timeout){

    $scope.valueActive = 1;
    
    $scope.timer = null;
    $scope.timer2 = null;
    $scope.count = 0;
    
    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
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

    $scope.$on('keysUpdated', function(){
      
    });

    function runTimer(){
      var speedIntervals = Service.speed/3;
      
      //2 timers to iterate through values - 
      //which in turn makes certain divs ng-show and create slideshow appearnace
      $scope.timer = $timeout(function(){
        $scope.valueActive = 2;
        $scope.timer2 = $timeout(function(){
          $scope.valueActive = 3;
        },speedIntervals);
      },speedIntervals);
    }


});
