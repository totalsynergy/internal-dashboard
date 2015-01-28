app.controller('SixteenthKPI', function($scope, Service, ngAudio, $http){
    $scope.pieData = [
         { key: "Profressional", y: 5 },
         { key: "Enterprise", y: 8 },
         { key: "Abandoned", y: 4 }
     ];

     $scope.pieData2 = [
     	  { key: "Basic", y: 20 },
         { key: "Professional", y: 30 },
         { key: "Enterprise", y: 30 },
     ];

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      //weGotKey();
    });

    $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
    })

    $scope.xFunction = function(){
      return function(d){
	  	  return d.key;
    	};
    }

    $scope.yFunction = function(){
    	return function(d){
	  	  return d.y;
    	};
    }

    $scope.colorFunction = function() {
      var colorArray = ['#F39200', '#009EE3', '#78AD29'];
	    return function(d, i) {
    	return colorArray[i];
      };
    }
});