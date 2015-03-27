app.controller('KPI27', function($scope, Service, ngAudio, $http){

         $scope.exampleData = [
         	{
 	           "key": "Series 1",
             "values": [ [ "2011", 0.2] , [ "2012" , 0.6], ["2013", 1], ["2014", 1.5], ["2015", 2.3]]
         	}
       	];


    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      weGotKey();
    });


    function weGotKey(){
      //some dataFetcher
      changePositionOfSquare();
    }

    function changePositionOfSquare(){
      var lastValue = 2.3;
      var highestValue = 2.3;
      var difference = highestValue - lastValue;
      console.log(lastValue);
      var percentageToMove = difference*20;
      $('.averageLifeSquare').css("top",percentageToMove + 20 + "%");
    }

    $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
    })

    $scope.colorFunction = function() {
	    return function(d, i) {
    	  return '#78ad29'
      };
    }



});