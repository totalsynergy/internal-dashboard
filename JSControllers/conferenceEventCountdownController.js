app.controller('KPI5', function($scope, $http, Service, $interval){

    $scope.days = 0;
    $scope.hours = 0;
    $scope.minutes = 0;
    $scope.keyTester = eventBriteKey;

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $scope.$on('keysUpdated', function(){
      $scope.eventBriteKey = Service.eventBriteKey;
      $scope.totalSynergyKey = Service.totalSynergyKey;
      weGotKey();
    })

    $scope.$on('selectedUpdated', function(){
      $scope.pages = Service.pages;
    })

    $scope.$on('eventDataUpdated', function(){
      $scope.eventData = Service.eventData;
    })

    function timerUpdate(d){
      $interval(function(){
        var currentDate = new Date().getTime();
        if($scope.eventDate > currentDate){
        var secondsDate = (d - currentDate) / 1000;

        $scope.days = parseInt(secondsDate / 86400);
        var secondsLeft = secondsDate % 86400;

        $scope.hours = parseInt(secondsLeft / 3600);
        secondsLeft = secondsLeft % 3600;

        $scope.minutes = parseInt(secondsLeft / 60);
        $scope.seconds = parseInt(secondsLeft % 60);
        }
      },1000);  //change this to minutes
    }

    function weGotKey(){
      $http.get("https://www.eventbriteapi.com/v3/events/13747447987/?token=" + $scope.eventBriteKey)
      .success(function(data){
        $scope.eventDate = new Date(data.start.utc).getTime();
        timerUpdate($scope.eventDate);
        $scope.eventData = data;
      })
      .error(function(){
        //
      })
    }

    this.parseJsonDate = function(jsonDateString) {
       return new Date(parseInt(jsonDateString.replace('"', '')));
    }
  });