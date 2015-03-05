app.controller('KPI18', function($scope, Service, ngAudio, $http){

    $scope.activeCount = 0;
    $scope.trialCount = 0;
    $scope.trialPercentage = 0;
    $scope.activePercentage = 0;
    $scope.trial = 0;
    $scope.active = 0;

    $scope.pieData = [
         { key: "Basic", y: 5 },
         { key: "Professional", y: 8 },
         { key: "Enterprise", y: 4 }
     ];

     $scope.pieData2 = [
     	  { key: "Basic", y: 20 },
         { key: "Professional", y: 30 },
         { key: "Enterprise", y: 30 },
     ];

     $scope.originalData = [
        {Name : "Basic", Count : 0},
        {Name : "Professional", Count : 0},
        {Name : "Enterprise", Count : 0},
        {Name : "Basic Trial", Count : 0},
        {Name : "Professional Trial", Count : 0},
        {Name : "Enterprise Trial", Count : 0}
     ];

     $scope.pieData3 = [];

     $scope.pieData4 = [];

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $scope.$on('keysUpdated', function(){
      $scope.totalSynergy5Key = Service.totalSynergy5Key;
      weGotKey();
    })


    $scope.$on('callsDataUpdated', function(){
      weGotKey();
    })

    function weGotKey(){
      $http({
         url: 'https://beta.totalsynergy.com/internalkpi/totalsynergy/summary/product',
         method: 'POST',
         headers: {'Content-Type': 'application/json', 'internal-token' : $scope.totalSynergy5Key}
         }).success(function(d, status, headers, config){
           $scope.data = d.data;
           sort(d.data);
           formatForGraph();
         })
        .error(function(data, status, headers, config){
           $scope.data = "fail";
        });
    }

    function formatForGraph(){
      $scope.pieData3 = [];
      $scope.pieData4 = [];
      var trial = 0;
      var active = 0;
      for(var i = 0; i < 3; i++){
        var object = {key: $scope.originalData[i].Name, y : $scope.originalData[i].Count};
        $scope.pieData3.push(object);
        active += $scope.originalData[i].Count;
      }
      for(var j = 3; j < 6; j++){
        var object = {key: $scope.originalData[j].Name, y : $scope.originalData[j].Count};
        $scope.pieData4.push(object);
        trial += $scope.originalData[j].Count;
      }
      $scope.trial = trial;
      $scope.active = active;
      $scope.trialPercentage = Math.floor(trial/(trial + active)*100);
      $scope.activePercentage = Math.floor(active/(trial + active)*100);
    }

    function sort(clients){
      $scope.activeCount = 0;
      $scope.trialCount = 0;
      for(var i = 0; i < clients.length; i++){
        var type = clients[i].Product;
        increaseType(type, clients[i].Count);
        $scope.originalData.type += clients[i].Count;
      }
      Service.updateSynergy5Data($scope.originalData);
    }

    function increaseType(type, count){
      for(var i = 0; i < $scope.originalData.length; i++){
        if(type == $scope.originalData[i].Name ){
          $scope.originalData[i].Count = 0;
          $scope.originalData[i].Count += count;
          break;
        }
      }
    }

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
      var colorArray = ['#009EE3', '#78AD29', '#F39200'];
	    return function(d, i) {
    	return colorArray[i];
      };
    }
});