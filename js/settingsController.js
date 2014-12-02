  app.controller('SettingsController', function($scope, Service){
   $scope.eventBriteKey = '';
   $scope.totalSynergyKey = '';
    $scope.speed = 10000;
    $scope.pages = pages;
    $scope.practiceNumber = 10;

    $scope.speedChange = function(){
      $scope.speed = parseInt($scope.speed);
    }

     $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $scope.$on('keysUpdated', function(){
      $scope.eventBriteKey = Service.eventBriteKey;
      $scope.totalSynergyKey = Service.totalSynergyKey;
    })

    $scope.$on('speedUpdated', function(){
      $scope.speed = Service.speed;
    })

    $scope.save = function(){
      chrome.storage.local.set({'eventBriteKey': $scope.eventBriteKey});
      chrome.storage.local.set({'totalSynergyKey': $scope.totalSynergyKey});
      chrome.storage.local.set({'speed' : $scope.speed});
      chrome.storage.local.set({'pages' : $scope.pages});
      Service.updateKeys($scope.eventBriteKey, $scope.totalSynergyKey, $scope.speed, $scope.pages);
      Service.sendForData();
    }

    $scope.settingsClose = function(){
      for(i = 0; i < pages.length; i++)
        if($scope.pages[i].isSelected){
          $scope.tab = i + 1;
          Service.updateTab(i + 1);
          $rootScope.$broadcast('settingsClosed')
        }
    }

    $scope.turnOffPage = function(page){
      page.isSelected = !page.isSelected;
      Service.updatePages($scope.pages);
    }

    //when ever a pages state is changed > run updatePagesCount

    $scope.$watch('speed', function(){
      Service.updateSpeed($scope.speed);
    })


    $scope.$on('selectedUpdated', function(){
      $scope.pages = Service.pages;
    })

  });