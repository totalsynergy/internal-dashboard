app.directive("synergy5Lifetime", function(){
  

  var controller = function($scope, Service, ngAudio, $http){

       $scope.exampleData = [
       	{
            "key": "Series 1",
           "values": [ ["0", 0.05], [ "1", 0.2] , [ "2" , 0.6], ["4", 1], ["6", 1.5], ["8", 1.7], ["10", 1.75]]
       	}
     	];
  
  
      $scope.xAxisTickFormatFunction = function(){
      return function(d){
          return d3.time.format('%b')(new Date(d));
        }
      }

      $scope.colorFunction = function() {
  	    return function(d, i) {
      	  return '#78ad29'
        };
      }
  };
  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/Synergy5Lifetime.html',
    controller: controller,
    scope : {
      tab : "=tab"
    }
  }
  
});
