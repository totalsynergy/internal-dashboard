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
        $scope.NSW = 0;
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
              
                var noSpaces = data[i].State.replace(/\s/g, '');
                var uppercaseState = noSpaces.toUpperCase();
                
                switch(uppercaseState){
                 case 'NSW': $scope.NSW++;
                             $scope.total++;
                             break;
                 case 'ACT': $scope.ACT++;
                             $scope.total++;
                             break;
                 case 'QLD': $scope.QLD++;;
                             $scope.total++;
                             break;
                 case 'VIC': $scope.VIC++;
                             $scope.total++;
                             break;
                 case 'TAS': $scope.TAS++;
                             $scope.total++;
                             break;
                 case 'NT':  $scope.NT++;
                             $scope.total++;
                             break;
                 case 'WA':  $scope.WA++;;
                             $scope.total++;
                             break;
                 case 'SA':  $scope.SA++;;
                             $scope.total++;
                             break;
                 default:   $scope.international++; 
                             break;
                  }
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
