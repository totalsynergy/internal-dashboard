app.directive("synergy4AustraliaMap", function(){


  var controller = function($scope, $http, Synergy4Service){

    $scope.$watch('keys', function(){
      $scope.totalSynergyKey = $scope.keys[0];
      getMapData();
    })
    
    $scope.$on('longDataFetch', function(){
      getMapData();
    })
    
    $scope.$on('synergy4MapData', function(){
      count(Synergy4Service.mapData.data);
    })

    function getMapData(){
      Synergy4Service.getMapData($scope.totalSynergyKey);
    }
    
    


    function count(data){
        $scope.total = 0;
        $scope.NSW = 1;
        $scope.ACT = 0;
        $scope.QLD = 0;
        $scope.VIC = 0;
        $scope.TAS = 0;
        $scope.NT = 0;
        $scope.WA = 0;
        $scope.SA = 0;
        $scope.international = 0;
        
        if(data && data != null){
          for(i = 0; i < data.length; i++){
            if(data[i].Active && !data[i].NoUpgrades && !data[i].Testing){
                switch(data[i].State){
                 case 'NSW': $scope.NSW++;
                             break;
                 case 'ACT': $scope.ACT++;
                             break;
                 case 'QLD': $scope.QLD += 1;
                             break;
                 case 'VIC': $scope.VIC++;
                             break;
                 case 'TAS': $scope.TAS += 1;
                             break;
                 case 'NT': $scope.NT += 1;
                             break;
                 case 'WA': $scope.WA += 1;
                            break;
                 case 'SA': $scope.SA += 1;
                            break;
                  default: ;
                  }
               if(data[i].Country != 'Australia')
                $scope.international++;
               else
                $scope.total++;
                }
            }
        }
    }

  
  };

  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/Synergy4AustraliaMap.html',
    controller: controller,
    scope: {
      tab : "=tab",
      keys: "=keys"
    }
  }
  
});
