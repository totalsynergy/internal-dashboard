app.controller('mainController', function($scope, Service, $interval, $timeout, ngAudio, $rootScope){
  
    $scope.speed = 1000;
    $scope.tab = 1;    
    $scope.pages = pages;
    $scope.keys = [];

    $scope.timer = 0;
    $scope.mouseTimer = 0;
    
    var vm = $scope;

    var timer = $timeout($scope.onTimeout, $scope.speed);

    
    //Function Run when app initialised
    $scope.init = function(){
      Service.loadData();
      goRight();
      timer = $timeout($scope.onTimeout, $scope.speed);
      
      //Start the cycle to fetch data
      $interval(function(){
        $rootScope.$broadcast("shortDataFetch");
      }, 300000);
      $interval(function(){
        $rootScope.$broadcast("longDataFetch");
      }, 2000000);
      
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
    
    $scope.$on('keysUpdated', function(){
      $scope.keys = Service.keysArray;
      $rootScope.$broadcast('serviceHasKeys');
    })

    $scope.$on('tabUpdated', function(){

      if($scope.pages[Service.tab - 1].isSelected)
      {
        $scope.tab = Service.tab;
        if(Service.soundCallback)
          Service.soundCallback();
        $timeout.cancel($scope.timer);
        $scope.timer = $timeout($scope.loop, $scope.speed);
      }
    });
    
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
      
      $scope.tab = nextPage;
      Service.tab = nextPage;
    }
    
    //Right Button Clicked
    //REFACTOR to call goRight
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

      $scope.tab = nextPage - 1;
      Service.tab = nextPage - 1;

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
        {
          nextPage = 1;  
        }
        if($scope.pages[nextPage - 1].isSelected)
        {
          break;
        }
        else
        {
          nextPage++;
        }
      }
      
      $scope.tab = nextPage;
      Service.tab = nextPage;
    }


    $scope.settingsButtonHit = function(){
      console.log("Hit");
      $scope.tab = 99;
      Service.tab = 99;
      $scope.speed = parseInt($scope.speed);
      $timeout.cancel($scope.timer);

    };
    
    
(function IFFE(){
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
})();


  });