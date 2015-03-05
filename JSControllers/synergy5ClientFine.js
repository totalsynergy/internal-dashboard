
app.controller('KPI25', function($scope, Service, $timeout){

    $scope.clientNames1 = [
    ];

    $scope.clientNames2 = [
      ];

      $scope.clientNames3 = [
      ];

    $scope.b1 = true;
    $scope.b2 = false;
    $scope.b3 = false;
    $scope.speed = 20000;
    $scope.timeout1;
    $scope.timeout2;
    $scope.timeout3;
    $scope.count = 0;

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      if($scope.tab == 25){
        changeBooleans();
        slideUp();
        $scope.count = 0;
      }
      else if($scope.count == 0){
        pageChanged();
        $scope.count++;
      }
    });

    $scope.$on('keysUpdated', function(){
      $scope.speed = Service.speed;
    })

    $scope.$on('abc123Updated', function(){
      $scope.abc123 = Service.abc123;
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
      console.log("A1 IS SLIDING");
      var timeToSlide = $scope.speed - 2000;
      $scope.timeout3 = $timeout(function(){
        var percentageToSlide = 110000/($(window).height()); //change height of slide here
        $('.clientNameHolder2').animate({top: '-=' + percentageToSlide + '%'},timeToSlide, function(){
          $timeout(function(){
            $('.clientNameHolder2').css('top', '20%');
          },2000);
        });

      }, 2000);

    }

    function pageChanged(){
      $('.clientNameHolder2').stop();
      $('.clientNameHolder2').css('top', '20%');
      $timeout.cancel($scope.timeout1);
      $timeout.cancel($scope.timeout2);
      $timeout.cancel($scope.timeout3);
    }


   });







