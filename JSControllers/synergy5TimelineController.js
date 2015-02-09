app.controller('KPI19', function($scope, Service, ngAudio, $http){

    $scope.exampleData = [
         {
             "key": "Basic",
             "values": [ [ 1 , 5] , [ 2 , 6] , [ 3 , 7], [4,8.5], [5, 19]]
         },
         {
             "key": "Professional",
             "values": [ [ 1 , 1] , [ 2 , 4] , [ 3 , 3], [4,8.5], [5, 19]]
         },
         {
             "key": "Enetprise",
             "values": [ [ 1 , 5] , [ 2 , 5] , [ 3 , 2], [4,8.5], [5, 3]]
         },
         {
             "key": "Trial",
             "values": [ [ 1 , 3] , [ 2 , 4] , [ 3 , 3.8], [4,4.5], [5, 11]]
         }
     ];

    $scope.xAxisTickFormatFunction = function(){
    return function(d){
        return d3.time.format('%b')(new Date(d));
      }
    }

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      //weGotKey();
    });

    $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
    })
});