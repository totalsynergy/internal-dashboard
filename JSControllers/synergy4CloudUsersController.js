//FOR LOGICAL REASONS THE NAME WILL REMAIN FIRSTKPI INSTEAD OF CLOUDUPTAKE PAGE


app.controller('KPI14', function($scope, $http, Service, $interval){
    $scope.keyAvailable = false;
    $scope.totalSynergyKey = "empty";
    $scope.cloudUptakeData = null;
    $scope.onCloud = 0;
    $scope.notOnCloud = 0;
    $scope.pieData = null;
    $scope.percentage = 0;

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      if(Service.tab == 14){
        $scope.pieData = $scope.originalData;
      }
      else{
        $scope.pieData = [{key: "Not On Cloud", y: 100}, {key: "On Cloud", y: 0}];
      }
    });

    $scope.$on('fetchEventData', function(){
      weGotKey();
    })

   $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
      weGotKey();
    })

    function weGotKey(){
       $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/CloudUptake',
         method: 'POST',
         headers : {'internal-token' : $scope.totalSynergyKey}
         }).success(function(d, status, headers, config){
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
      $scope.percentage = parseInt((data[0].Count / (data[0].Count + data[1].Count ))*100);
      var dataToPass = [];
      var dataArray = {key: "Not On Cloud", y: data[1].Count};
      dataToPass.push(dataArray);
      var dataArray2 = {key: "On Cloud", y: data[0].Count};
      dataToPass.push(dataArray2);
      cloudConversionData = dataToPass;
      $scope.pieData = dataToPass;
      $scope.originalData = dataToPass;
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

  });










