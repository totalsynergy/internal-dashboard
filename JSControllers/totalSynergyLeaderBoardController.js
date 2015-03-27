app.controller('KPI29', function($scope, Service){

    $scope.employees = [
      {"Name" : "Adsam", "Number": 4},
      {"Name" : "Adadm", "Number": 8},
      {"Name" : "Adafm", "Number": 5},
      {"Name" : "Adgam", "Number": 9},
      {"Name" : "Ahdam", "Number": 6},
      {"Name" : "Adjam", "Number": 10},
      {"Name" : "Adjam", "Number": 7}
    ];
    
    //Variable used modularly divide employees into 3 groups
    $scope.divisor = 7;
    
    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $scope.$on('staffInfoUpdated', function(){
      $scope.staffInfo = Service.staffInfo;
    });
    
    $scope.getColumn = function(number){
      //Here we go +2 since the $index count in ng-repeat skips firstPlace and starts at 0
      return parseInt((number + 2)%3);
    }

});
