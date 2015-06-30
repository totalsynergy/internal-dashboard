
app.controller('KPI21', function($scope, Service, $timeout, $http){

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
    $scope.speed = 20000;
    $scope.timeout1 = 0;
    $scope.timeout2 = 0;
    $scope.timeout3 = 0;
    $scope.count = 0;

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
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

    $scope.$on('keysUpdated', function(){
      $scope.speed = Service.speed;
      $scope.totalSynergyKey = Service.totalSynergyKey;
      weGotKey();
    })

    function weGotKey(){
      $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/ClientRanks',
         method: 'POST',
         headers : {'internal-token' : $scope.totalSynergyKey}
         }).success(function(d, status, headers, config){
           $scope.data = d.data;
           sortData(d.data);
         })
        .error(function(data, status, headers, config){
           $scope.data2 = "fail";
        });
    }

    function sortData(data){
      if(data && data != null){
        for(var i = 0; i < data.length; i++){
          var category = data[i].ClientRanking;
          var clientName = data[i].LicenseName;
          addNameToCategory(category, clientName);
        }
        sortAs();
        Service.updateABC123($scope.abc123);
      }
    }

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

    function addNameToCategory(category, clientName){
      for(var i = 0; i < $scope.abc123.length; i++){
        if(category == $scope.abc123[i].CategoryName){
          $scope.abc123[i].Clients.push(clientName);
          return;
        }
      }
      var emptyArray = [clientName];
      var jsonCategoryObject = {"CategoryName" : category, "Clients": emptyArray};
      $scope.abc123.push(jsonCategoryObject);
    }



    function slideUp(){
      console.log("A1 IS SLIDING");
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


   });







