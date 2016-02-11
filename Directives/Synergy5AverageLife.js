app.directive("synergy5AverageLife", function(){
  

  var controller = function($scope, Service, ngAudio, $http){

     $scope.exampleData = [
     	{
          "key": "Series 1",
         "values": [ [ "2011", 0.2] , [ "2012" , 0.6], ["2013", 2.3], ["2014", 1.5], ["2015", 2.3]]
     	}
   	];

    $scope.colorFunction = function() {
	    return function(d, i) {
    	  return '#78ad29'
      };
    }



};
  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/Synergy5AverageLife.html',
    controller: controller,
    scope:{
      tab : "=tab"
    }
  }
  
});
