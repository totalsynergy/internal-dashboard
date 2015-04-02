app.controller('mainController', function($scope, Service, $interval, $timeout, ngAudio){
    var time = 1;
    var counter = 1;
    $scope.speed = 1000;
    //$scope.tab = getTab();
    $scope.tab = 1;
    $scope.testNumber = test;
    $scope.pages = pages;
    $scope.amountOfPages = $scope.pages.length;
    $scope.myTimeout = null;
    $scope.timerBoolean = false;
    $scope.timer = 0;
    $scope.mouseTimer = 0;
    var timer = $timeout($scope.onTimeout, $scope.speed);

  //fix this loop

   // $scope.sound = ngAudio.load("assets/bell.mp3");


  $scope.error = {
      message: null,
      errorFunction: null,
  };


  $scope.errorList = [];
    function getTab(){
      for(i = 0; i < pages.length; i++){
        if($scope.pages[i].isSelected){
          $scope.tab = i + 1;
          Service.updateTab(i+1);}
      }
    }

    $scope.init = function(){
      goRight();
      timer = $timeout($scope.onTimeout, $scope.speed);
      //goRight();
      //$scope.newTime();
      $interval(function(){
        Service.sendForData();
      }, 300000);
      $interval(function(){
        Service.sendForCallsData();
      }, 3000000);
    }

    $scope.onTimeout = function(){
      if($scope.tab != 99){
        goRight();
      }
      $scope.timer = $timeout($scope.onTimeout, $scope.speed);
    }


    $scope.loop = function(){
      //console.log("IN THE LOOP");
      if($scope.tab != 99)
        goRight();
      //console.log("Speed: " + $scope.speed);
      $scope.timer = $timeout($scope.loop, $scope.speed);
      //
    };


    $scope.$on('selectedUpdated', function(){
      $scope.pages = Service.pages;
      $scope.speed = Service.speed;
    });

    $scope.$on('settingsClosed', function(){
      $timeout.cancel($scope.timer);
      $scope.loop();
    });

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });
    
    $scope.$on('pagesUpdated', function(){
      $scope.pages = Service.pages;
    });

    $scope.newTime = function(){
      if($scope.tab != 99)
      $timeout($scope.newTime, $scope.speed);
      goRight();
    }

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
      //Below is nextPage - 1 instead of nextPage to combat the need to re-enter the loop (which autmatically gosRight()
      Service.updateTab(nextPage-1);
      //$scope.$broadcast('change');
      $timeout.cancel($scope.timer);
      $scope.loop();
    }

    $scope.playClick = function(){
      $timeout.cancel($scope.timer);
      $scope.onTimeout();
    }

    $scope.pauseClick = function(){
      $timeout.cancel($scope.timer);
    }

    function goRight(){
      //console.log("goRight()");
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


    $scope.settingsButtonHit = function(){
      Service.updateTab(99);
      $scope.speed = parseInt($scope.speed);
      Service.updateSpeed($scope.speed);
      $timeout.cancel($scope.timer);
    };

    $scope.$on('speedUpdated', function(){
      $scope.speed = Service.speed;
    });

    $scope.$watch('speed', function() {
        Service.updateSpeed($scope.speed);
    });
    
    $(document).mousemove(function(){
      $timeout.cancel($scope.mouseTimer);
      $("body").css("cursor", "default");
      $("html").css("cursor", "default");
      $(".container").css("cursor", "default");
      makeMouseTimeout();
    });
    
    function makeMouseTimeout(){
      
      $scope.mouseTimer = $timeout(function(){
        $("body").css("cursor", "none");
        $("html").css("cursor", "none");
        $(".container").css("cursor", "none");
        $("body").blur();
        $("body").focus();
        $("html").blur();
        $("html").focus();
        $(".container").blur();
        $(".container").focus();
      },2000);
    }

  });