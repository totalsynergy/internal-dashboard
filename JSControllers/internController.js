
app.controller('SecondKPI', function($scope, Service){
    $scope.percentage = 96.5;
    $scope.internPieData = [
      {key: "Productive Time", y: 8},
      {key: "UnProductive Time", y: 96.5}
      ];

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      if(Service.tab == 2){
        $scope.internPieData = [
          {key: "Productive Time", y: 8},
          {key: "UnProductive Time", y: 96.5}
        ];
      }
      else{
        $scope.internPieData = cloudConversionData;
      }
    });

    $scope.$on('attendeesUpdated', function() {
      $scope.totalAttendees = Service.totalAttendees;
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

   });







