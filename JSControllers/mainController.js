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
    $scope.timer;
    var timer = $timeout($scope.onTimeout, $scope.speed);

  //fix this loop

   // $scope.sound = ngAudio.load("assets/bell.mp3");


  $scope.error = {
      message: null,
      errorFunction: null,
  };


  $scope.errorList = [];

    chrome.storage.local.get(null, function(result){
      if(result.pages != null)
      Service.updateKeys(result.eventBriteKey, result.totalSynergyKey, result.slackKey,  result.trelloKeys, result.synergy5Keys, result.speed, result.pages);
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
    }


    $scope.$on('selectedUpdated', function(){
      $scope.pages = Service.pages;
    })

    $scope.$on('settingsClosed', function(){
      $timeout.cancel($scope.timer);
      $scope.loop();
    })

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
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
      console.log("Cancelling timer");
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
    }

    $scope.$on('speedUpdated', function(){
      $scope.speed = Service.speed;
    });

    $scope.$watch('speed', function() {
        Service.updateSpeed($scope.speed);
    });

    $scope.dateIsApril1st = function(){
      var date = new Date();
      return date.getMonth() == 3 && date.getDate() == 1;
    }

    $scope.runAprilFools = function(){
      /*   BELOW IS THE APRIL FOOLS FUNCTION WHICH DISPLAYS A APRIL FOOLS JOKE
      $timeout(function(){
        $('.aprilFools').html("APRIL FOOLS");
        $('.googleAdvisor').html("From the number 1 intern - Adam In. Tern");
        $timeout(function(){
          $('.aprilFoolsHolder').remove();
        },1200000);
      },600000)
      */
    }
    
    /*
    $("*").css('cursor', 'none');
      var mouseTimer;
      
    $(document).mousemove(function() {
      console.log("mouse move");
      //mouseTimeout();     
    });

    function mouseTimeout(){
      mouseTimer = $timeout(function(){
            console.log("Timeout Reached");
            changeMouse()
          },2000)
    }
    
    function changeMouse(){
      $("*").css('cursor', 'none');
    }
    */

  });