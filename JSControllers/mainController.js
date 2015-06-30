app.controller('mainController', function($scope, Service, $interval, $timeout, ngAudio){
  
    var time = 1;
    var counter = 1;
    $scope.speed = 1000;

    $scope.tab = 1;
    $scope.pages = pages;
    $scope.amountOfPages = $scope.pages.length;
    $scope.myTimeout = null;
    $scope.timerBoolean = false;
    $scope.timer = 0;
    $scope.mouseTimer = 0;
    var timer = $timeout($scope.onTimeout, $scope.speed);


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
    
    //Function Run when app initialised
    $scope.init = function(){
      
      goRight();
      timer = $timeout($scope.onTimeout, $scope.speed);
      
      //Create 2 different time intervals to fetch data. Once for more frequent data fetches (5 minutes)
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

      if($scope.tab != 99){
        goRight();
      }

      $scope.timer = $timeout($scope.loop, $scope.speed);

    };

    //Watchers to see any updates being applied
    
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
    
    $scope.$on('speedUpdated', function(){
      $scope.speed = Service.speed;
    });

    $scope.$watch('speed', function() {
        Service.updateSpeed($scope.speed);
    });
    
    // End watchers

    $scope.newTime = function(){
      if($scope.tab != 99)
      $timeout($scope.newTime, $scope.speed);
      goRight();
    }

    //Left Button Clicked
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
    
    //Right Button Clicked
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

      Service.updateTab(nextPage-1);

      //must cancel the current loop to avoid quick page changes
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

    //Different to $scope.goRight - generic function used by the loop
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


    $scope.settingsButtonHit = function(){
      
      Service.updateTab(99);
      
      $scope.speed = parseInt($scope.speed);
      
      Service.updateSpeed($scope.speed);
      
      $timeout.cancel($scope.timer);
    };

    //Cancels the current mouse timer and makes the mouse appear again
    $(document).mousemove(function(){
      
      $timeout.cancel($scope.mouseTimer);
      
      $("body").css("cursor", "default");
      $("html").css("cursor", "default");
      $(".container").css("cursor", "default");
      
      makeMouseTimeout();
    });
    
    //Makes the mouse disappear after two seconds, unless cancelled above
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