app.directive("synergyClientPassive", function(){
  

  
  var controller = function($scope, Synergy4Service, $timeout){

    $scope.clientNames1 = [
    ];

    $scope.clientNames2 = [
      ];

      $scope.clientNames3 = [
      ];

    $scope.b1 = true;
    $scope.b2 = false;
    $scope.b3 = false;

    $scope.timeout1 = 0;
    $scope.timeout2 = 0;
    $scope.timeout3 = 0;
    $scope.count = 0;

    $scope.$watch('tab', function(){
      if($scope.tab == 22){
        changeBooleans();
        slideUp();
        $scope.count = 0;
      }
      else if($scope.count == 0){
        pageChanged();
        $scope.count++;
      }
    });
    
    $scope.$on('abc123Updated', function(){
      $scope.abc123 = Synergy4Service.clientRanks;
      sortBs();
    })

    function sortBs(){
      for(var  i = 0; i < $scope.abc123.length; i++){
        if($scope.abc123[i].CategoryName == "B1"){
          $scope.clientNames1 = $scope.abc123[i].Clients;
        }
        else if($scope.abc123[i].CategoryName == "B2"){
          $scope.clientNames2 = $scope.abc123[i].Clients;
        }
        else if($scope.abc123[i].CategoryName == "B3"){
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

    function changeBooleans(){  //CHANGE THIS TO THE VARIABLE SERVICE.SPEED
      $scope.b1 = true;
      $scope.b2 = false;
      $scope.b3 = false;
      $scope.timeout1 = $timeout(function(){
        $scope.b1 = false; $scope.b2 = true;
      },2000 + $scope.speed/3);  //need at 7000
      $scope.timeout2 = $timeout(function(){
        $scope.b2 = false; $scope.b3 = true;
      },2000 + $scope.speed/1.5); // need at 12000
    }


    function slideUp(){
      var timeToSlide = $scope.speed - 2000;
      $scope.timeout3 = $timeout(function(){
        var percentageToSlide = 110000/($(window).height()); //change height of slide here
        $('.clientNameHolder2').animate({top: '-=' + percentageToSlide + '%'},timeToSlide);

      }, 2000);

    }

    function pageChanged(){
      $('.clientNameHolder2').stop();
      $timeout(function(){
          $('.clientNameHolder2').css('top', '20%');
      },5000);
      $timeout.cancel($scope.timeout1);
      $timeout.cancel($scope.timeout2);
      $timeout.cancel($scope.timeout3);
    }


   };

  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/SynergyPassiveClients.html',
    controller: controller,
    scope : {
      speed : "=speed",
      tab : "=tab"
    }
  }
  
});
