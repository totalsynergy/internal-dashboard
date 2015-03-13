app.controller('KPI19', function($scope, Service, ngAudio, $http){

         $scope.exampleData = [
         	{
 	           "key": "Series 1",
<<<<<<< HEAD
             "values": [ ["0", 0.05], [ "1", 0.2] , [ "2" , 0.6], ["4", 1], ["6", 1.5], ["8", 1.7], ["10", 1.75]]
=======
             "values": [ [0, 0.05], [ 1, 0.2] , [ 2 , 0.6], [4, 1], [6, 1.5], [8, 1.7], [1.75]]
>>>>>>> origin/master
         	}
       	];


<<<<<<< HEAD


=======
>>>>>>> origin/master
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

    $scope.colorFunction = function() {
	    return function(d, i) {
    	  return '#78ad29'
<<<<<<< HEAD
      };
    }



=======
    };
}
>>>>>>> origin/master
});