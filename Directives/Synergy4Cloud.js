app.directive("synergy4Cloud", function(){
  

  var controller = function($scope, $http, Service, $interval){
  
    $scope.cloudUptakeData = null;
    $scope.pieData = null;
    $scope.percentage = 0;

    $scope.$watch('tab', function(){
      if($scope.tab == 14){
        $scope.pieData = $scope.originalData;
      }
      else{
        $scope.pieData = [{key: "Not On Cloud", y: 100}, {key: "On Cloud", y: 0}];
      }
    });

    $scope.$on('shortDataFetch', function(){
      getCloudData();
    })

   $scope.$watch('keys', function(){
      $scope.totalSynergyKey = $scope.keys[0];
      getCloudData();
    })

    function getCloudData(){
       $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/CloudUptake',
         method: 'POST',
         headers : {'internal-token' : $scope.totalSynergyKey}
         })
         .success(function(d, status, headers, config){
           
           $scope.cloudUptakeData = d.data;
           sortData(d.data);
           
         })
        .error(function(data, status, headers, config){
           $scope.data2 = "fail";
        });
    }

    $scope.colorFunction = function() {
      var colorArray = ['#F39200', '#004F93'];
	    return function(d, i) {
    	return colorArray[i];
      };
    }

    function sortData(data){
      
      if(data && data !== null){
        $scope.percentage = parseInt((data[0].Count / (data[0].Count + data[1].Count ))*100);
        
        var dataToPass = [];
        var dataArray = {key: "Not On Cloud", y: data[1].Count};
        
        dataToPass.push(dataArray);
        
        var dataArray2 = {key: "On Cloud", y: data[0].Count};
        
        dataToPass.push(dataArray2);
        
        $scope.pieData = dataToPass;
        $scope.originalData = dataToPass;
      }
    }

    $scope.xFunction = function(){
      return function() {
          return $scope.pieData.key;
      };
    }

    $scope.yFunction = function(){
    	return function(d){
	  	  return d.y;
    	};
    }

  };
  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/Synergy4Cloud.html',
    controller: controller,
    scope : {
      tab : "=tab",
      keys : "=keys"
    }
  }
  
});
