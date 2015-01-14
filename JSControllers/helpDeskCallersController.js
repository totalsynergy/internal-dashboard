app.controller('TwelthKPI', function($scope, Service, ngAudio){
    $scope.totalAttendees = 0;
    $scope.count = 0;

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

});