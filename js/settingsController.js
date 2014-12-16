  app.controller('SettingsController', function($scope, Service){
   $scope.eventBriteKey = '';
   $scope.totalSynergyKey = '';
   $scope.slackKey = '';
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
      $scope.slackKey = Service.slackKey;
    })

    $scope.$on('speedUpdated', function(){
      $scope.speed = Service.speed;
    })

    $scope.save = function(){
      chrome.storage.local.set({'eventBriteKey': $scope.eventBriteKey});
      chrome.storage.local.set({'totalSynergyKey': $scope.totalSynergyKey});
      chrome.storage.local.set({'slackKey': $scope.slackKey});
      chrome.storage.local.set({'speed' : $scope.speed});
      chrome.storage.local.set({'pages' : $scope.pages});
      Service.updateKeys($scope.eventBriteKey, $scope.totalSynergyKey, $scope.slackKey, $scope.speed, $scope.pages);
      Service.sendForData();
    }

    $scope.restoreDefaults = function(){
      Service.restore(15, restorePages);
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


    var restorePages = [
      {"name" : "Cloud Users", "isSelected" : false},
      {"name" : "Another PieChart", "isSelected" : false},
      {"name" : "Desktop Version Graph", "isSelected" : true},
      {"name" : "Total Attendees", "isSelected" : true},
      {"name" : "Attendee Map", "isSelected" : true},
      {"name" : "conference CountDown", "isSelected" : true},
      {"name" : "Gravatar", "isSelected" : false},
      {"name" : "Synergy Clients", "isSelected" : false},
      {"name" : "Help Desk 1", "isSelected" : false},
      {"name" : "Help Desk 2", "isSelected" : false},
      {"name" : "Help Desk 3", "isSelected" : false},
      {"name" : "Test3", "isSelected" : false}
    ];

  });