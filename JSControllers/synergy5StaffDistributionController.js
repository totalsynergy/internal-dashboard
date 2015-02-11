
app.controller('KPI23', function($scope, Service){


    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

   });







