
app.controller('KPI22', function($scope, Service){


    $scope.subscribers = [
        {"Name" : "General", "Percent" : 24},
        {"Name" : "Environ.", "Percent" : 1},
        {"Name" : "Engineer", "Percent" : 12},
        {"Name" : "Construction", "Percent" : 31},
        {"Name" : "Architect", "Percent" : 7},
        {"Name" : "Urban", "Percent" : 19},
        {"Name" : "Project Management", "Percent" : 18},
        {"Name" : "Survey", "Percent" : 12}
      ];

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      fillSubscribers();
    });

    function fillSubscribers(){
      console.log("LETSFILL");
      for(var i = 0; i < $scope.subscribers.length; i++){
        $('.fillingDiv' + i).css('height', $scope.subscribers[i].Percent + '%');
      }
    }



   });
