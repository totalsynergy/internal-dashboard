app.controller('KPI17', function($scope, Service, $http, gravatarService){
    $scope.stat = "";
    $scope.your_email = "adamhannigan@hotmail.com";

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
      weGotKey();
    })

    function weGotKey(){
      //debugger
       $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/Clients',
         method: 'POST',
         headers : {'internal-token' : $scope.totalSynergyKey}
         }).success(function(d, status, headers, config){
           //$scope.data = d.data
           count(d.data);
           $scope.data = d.data;
         })
        .error(function(data, status, headers, config){
           $scope.data = "fail";
        });
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

  });