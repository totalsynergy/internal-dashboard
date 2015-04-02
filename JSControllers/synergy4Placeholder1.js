app.controller('KPI19', function($scope, Service){

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $scope.$on('keysUpdated', function(){

    });

});
