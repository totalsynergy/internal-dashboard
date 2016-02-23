app.directive("synergyTrialVersusActive", function(){
  

  var controller = function($scope, Synergy5Service){
  
      $scope.activeCount = 0;
      $scope.trialCount = 0;
      $scope.trialPercentage = 0;
      $scope.activePercentage = 0;
      $scope.trial = 0;
      $scope.active = 0;
      
      $scope.emptyData = [
           { key: "Business", y: 0 },
           { key: "Professional", y: 0 },
           { key: "Enterprise", y: 0 }
       ];
  
       $scope.originalData = [
          {Name : "Business", Count : 0},
          {Name : "Professional", Count : 0},
          {Name : "Enterprise", Count : 0},
          {Name : "Business Trial", Count : 0},
          {Name : "Professional Trial", Count : 0},
          {Name : "Enterprise Trial", Count : 0}
       ];
  
       $scope.pieData3 = [];
  
       $scope.pieData4 = [];
  
      $scope.$watch('keys', function(){
        $scope.totalSynergy5Key = $scope.keys[4];
        getData();
      })
      
      $scope.$watch('tab', function(){
        if($scope.tab == 24)
        {
          $scope.pieData3 = $scope.backup3;
          $scope.pieData4 = $scope.backup4;
        }
        /*else
        {
          console.log("Change to fake data");
          $scope.pieData3  = $scope.emptyData;
          $scope.pieData4 = $scope.emptyData;
        }
        */
      })
  
  
      $scope.$on('longDataFetch', function(){
        getData();
      })
  
      function getData(){
        Synergy5Service.getProductData($scope.totalSynergy5Key).then(function(success){
            $scope.data = success.data;
            sort(success.data);
            formatForGraph();
        })
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
        $scope.backup3 = $scope.pieData3;
        $scope.backup4 = $scope.pieData4;
      }
  
      function sort(clients){
        $scope.activeCount = 0;
        $scope.trialCount = 0;
        for(var i = 0; i < clients.length; i++){
          var type = clients[i].Product;
          increaseType(type, clients[i].Count);
          $scope.originalData.type += clients[i].Count;
        }
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
  };
  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/Synergy5TrialVersusActive.html',
    controller: controller,
    scope : {
      tab : "=tab",
      keys : "=keys"
    }
  }
  
});
