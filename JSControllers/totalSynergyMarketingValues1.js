app.controller('KPI33', function($scope, Service){

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $scope.$on('keysUpdated', function(){
      
    });




});
