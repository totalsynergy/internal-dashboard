app.directive("synergyClientPromotors", function(){
  
  var controller = function($scope, Synergy4Service, $timeout, $http){

    $scope.clientNames1 = [
    ];

    $scope.clientNames2 = [
      ];

      $scope.clientNames3 = [
      ];

    $scope.abc123 = [];

    $scope.a1 = true;
    $scope.a2 = false;
    $scope.a3 = false;

    $scope.timeout1 = 0;
    $scope.timeout2 = 0;
    $scope.timeout3 = 0;
    $scope.count = 0;

    $scope.$watch('tab', function(){

      if($scope.tab == 21){
        slideUp();
        $scope.count = 0;
      }
      else if($scope.count == 0){
        pageChanged();
        shuffleClientNames();
        $scope.count++;
      }
    });

    $scope.$watch('keys', function(){
      $scope.totalSynergyKey = $scope.keys[0];
      Synergy4Service.getClientRanks($scope.totalSynergyKey);
    })
    
    $scope.$on('abc123Updated', function(){
        $scope.abc123 = Synergy4Service.clientRanks;
        sortAs();
    })


    function sortAs(){
      for(var  i = 0; i < $scope.abc123.length; i++){
        if($scope.abc123[i].CategoryName == "A1"){
          $scope.clientNames1 = $scope.abc123[i].Clients;
        }
        else if($scope.abc123[i].CategoryName == "A2"){
          $scope.clientNames2 = $scope.abc123[i].Clients;
        }
        else if($scope.abc123[i].CategoryName == "A3"){
          $scope.clientNames3 = $scope.abc123[i].Clients;
        }
      }
      shuffleClientNames();
    }

    function shuffleClientNames(){
      shuffle($scope.clientNames1);
      shuffle($scope.clientNames2);
      shuffle($scope.clientNames3);
    }

    function shuffle(o){ //v1.0
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
    };

    function slideUp(){

      var timeToSlide = $scope.speed - 2000;
      $scope.timeout3 = $timeout(function(){
        var percentageToSlide = 110000/($(window).height()); //change the height of the slide here
        $('.clientNameHolder').animate({top: '-=' + percentageToSlide + '%'},timeToSlide);
      }, 2000);

    }

    function pageChanged(){
      $('.clientNameHolder').stop();
      $timeout(function(){
          $('.clientNameHolder').css('top', '20%');
      },5000);
      $timeout.cancel($scope.timeout1);
      $timeout.cancel($scope.timeout2);
      $timeout.cancel($scope.timeout3);
    }


   };

  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/SynergyClientPromotors.html',
    controller: controller,
    scope : {
      tab : "=tab",
      keys : "=keys",
      speed : "=speed"
    }
  }
  
});
