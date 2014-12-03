app.controller('FirstController', function($scope, Service, $interval, $timeout){
    var time = 1;
    var counter = 1;
    $scope.speed = 1000;
    //$scope.tab = getTab();
    $scope.tab = 1;
    $scope.testNumber = test;
    $scope.pages = pages;
    $scope.amountOfPages = $scope.pages.length;
    $scope.timer = $timeout($scope.loop, $scope.speed);
    $scope.timerBoolean = false;

  //fix this loop


    chrome.storage.local.get(null, function(result){
      if(result.pages != null)
      Service.updateKeys(result.eventBriteKey, result.totalSynergyKey, result.speed, result.pages);
    });

    function getTab(){
      for(i = 0; i < pages.length; i++){
        if($scope.pages[i].isSelected){
          $scope.tab = i + 1;
          Service.updateTab(i+1);}
      }
    }

    $scope.init = function(){
      goRight();
      $scope.loop();
      $interval(function(){
        Service.sendForData();
      }, 60000);
    }


    $scope.loop = function(){
      if($scope.tab != 99)
        goRight();
      $scope.timer = $timeout($scope.loop, $scope.speed);
      //
    }


    $scope.$on('selectedUpdated', function(){
      $scope.pages = Service.pages;
    })

    $scope.settingsHit = function(){
     // $scope.tab = 99;
      //counter = 6;
      Service.updateTab(99);
      $scope.loop();
    }

    $scope.settingsClose = function(){
      $scope.updateTab(counter);
    }

    $scope.$on('settingsClosed', function(){

      //$scope.loop;
    })

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    //kind of works

    $scope.leftButton = function(){
      var nextPage = $scope.tab - 1;
      while(nextPage >= 0){
        if(nextPage <= 0)
          nextPage = pages.length;
        if($scope.pages[nextPage - 1].isSelected)
          break;
        else
          nextPage--;
      }
      Service.updateTab(nextPage);
    }

    $scope.rightButton = function(){
      var nextPage = $scope.tab + 1;
      while(nextPage <= $scope.pages.length + 2){
        if(nextPage > $scope.pages.length)
          nextPage = 1;
        if($scope.pages[nextPage - 1].isSelected)
          break;
        else
          nextPage++;
      }
      Service.updateTab(nextPage);
    }

    function goRight(){
      var nextPage = $scope.tab + 1;
      while(nextPage <= $scope.pages.length + 2){
        if(nextPage > $scope.pages.length)
          nextPage = 1;
        if($scope.pages[nextPage - 1].isSelected)
          break;
        else
          nextPage++;
      }
      Service.updateTab(nextPage);
    }


    $scope.leftButtonHit = function(){
      //if not on settings page
      var nextPage = $scope.tab - 1;
      while(pages[nextPage - 1].isSelected = false || nextPage >= 0){
        if(nextPage == 0)
          nextPage = pages.length;
        else
          nextPage--;
      }

      Service.updateTab(nextPage);


      //if(counter == 1)
      //  Service.updateTab(pages.length);
      //else
      //  Service.updateTab(counter - 1);
    }

    $scope.rightButtonHit = function(){
      //if not on settings page
      if(counter == pages.length)
        Service.updateTab(1);
      else
        Service.updateTab(counter + 1);
      $scope.timerBoolean = true;
    }

    $scope.settingsButtonHit = function(){
      Service.updateTab(99);
      $scope.speed = parseInt($scope.speed);
      Service.updateSpeed($scope.speed);
    }

    $scope.$on('speedUpdated', function(){
      $scope.speed = Service.speed;
    });

    $scope.$watch('speed', function() {
        Service.updateSpeed($scope.speed);
    });

  });