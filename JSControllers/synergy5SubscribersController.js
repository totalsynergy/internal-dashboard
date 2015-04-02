
app.controller('KPI28', function($scope, Service, $http){


    $scope.subscribers = [
        {"Name" : "General", "Percent" : 0},
        {"Name" : "Environ", "Percent" : 0},
        {"Name" : "Engineer", "Percent" : 0},
        {"Name" : "Construction", "Percent" : 0},
        {"Name" : "Architect", "Percent" : 0},
        {"Name" : "Urban", "Percent" : 0},
        {"Name" : "Project Manager", "Percent" : 0},
        {"Name" : "Survey", "Percent" : 0}
      ];

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      fillSubscribers();
    });

    $scope.$on('keysUpdated', function(){
      $scope.totalSynergy5Key = Service.totalSynergy5Key;
      weGotKey();
    })


    $scope.$on('callsDataUpdated', function(){
      weGotKey();
    })

    function fillSubscribers(){
      for(var i = 0; i < $scope.subscribers.length; i++){
        $('.fillingDiv' + i).css('height', $scope.subscribers[i].Percent + '%');
      }
    }

    function weGotKey(){
      $http({
         url: 'https://beta.totalsynergy.com/internalkpi/totalsynergy/summary/industries',
         method: 'POST',
         headers: {'Content-Type': 'application/json', 'internal-token' : $scope.totalSynergy5Key}
         }).success(function(d, status, headers, config){
           $scope.data = d.data;
           sort(d.data);
         })
        .error(function(data, status, headers, config){
           $scope.data = "fail";
        });
    }

    function sort(data){
      var total = 0;
      for(var j = 0; j < data.length; j++){
        total += data[j].Count;
      }
      for(var h = 0; h < data.length; h++){
        for(var i = 0; i  < $scope.subscribers.length; i++){
          if(data[h].Name == $scope.subscribers[i].Name){
            $scope.subscribers[i].Percent = Math.floor((data[h].Count/total)*100);
          }
        }
      }
    }



   });
