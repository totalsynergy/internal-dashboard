app.directive("internProductivity", function(){
  

  var controller = function($scope, Service){
    $scope.percentage = 98.35;
    $scope.internPieData = [
      {key: "Productive Time", y: 1.65},
      {key: "UnProductive Time", y: 98.35}
      ];

    $scope.$watch('tab', function(){
      $scope.tab = Service.tab;
      if(Service.tab == 15)
      {
        $scope.internPieData = [
          {key: "Productive Time", y: 1.65},
          {key: "UnProductive Time", y: 98.35}
        ];
      }
      else
      {
        $scope.internPieData = [
          {key: "Productive Time", y: 0},
          {key: "UnProductive Time", y: 0}
        ];
      }
    });

   $scope.xFunction = function(){
      return function() {
          return $scope.internPieData.key;
      };
    }

    $scope.yFunction = function(){
    	return function(d){
	  	  return d.y;
    	};
    }

    $scope.colorFunction = function() {
      var colorArray = ['#F39200', '#004F93'];
	    return function(d, i) {
    	return colorArray[i];
      };
    }

      
      
  };
  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/InternProductivity.html',
    controller: controller,
    scope : {
      tab : "=tab"
    }
  }
  
});
