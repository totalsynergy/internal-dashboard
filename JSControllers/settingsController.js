  app.controller('SettingsController', function($scope, Service, $rootScope){
   $scope.eventBriteKey = '';
   $scope.totalSynergyKey = '';
   $scope.slackKey = '';
   $scope.totalSynergy5Key = '';
   $scope.trelloKeys = '';
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
      $scope.trelloKeys = Service.trelloKeys;
      $scope.totalSynergy5Key = Service.totalSynergy5Key;
    })

    $scope.$on('speedUpdated', function(){
      $scope.speed = Service.speed;
    })

    $scope.save = function(){
      chrome.storage.local.set({'eventBriteKey': $scope.eventBriteKey});
      chrome.storage.local.set({'totalSynergyKey': $scope.totalSynergyKey});
      chrome.storage.local.set({'slackKey': $scope.slackKey});
      chrome.storage.local.set({'speed' : $scope.speed});
      chrome.storage.local.set({'trelloKeys' : $scope.trelloKeys});
      chrome.storage.local.set({'synergy5Keys' : $scope.totalSynergy5Key});
      chrome.storage.local.set({'pages' : $scope.pages});
      console.log($scope.totalSynergy5Key);
      Service.updateKeys($scope.eventBriteKey, $scope.totalSynergyKey, $scope.slackKey, $scope.trelloKeys, $scope.totalSynergy5Key, $scope.speed, $scope.pages);
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
      {"name" : "Total Synergy Gravatar", "isSelected" : false},
      {"name" : "Total SynergyGram", "isSelected" : false},
      {"name" : "Conference Total Attendees", "isSelected" : true},
      {"name" : "Conference Attendee Map", "isSelected" : true},
      {"name" : "Conference CountDown", "isSelected" : true},
      {"name" : "Help Desk Calls Categories", "isSelected" : false},
      {"name" : "Help Desk Call Response Time", "isSelected" : false},
      {"name" : "Help Desk Test Page", "isSelected" : false},
      {"name" : "Help Desk Top Callers", "isSelected" : false},
      {"name" : "Help Desk Time To Close Calls", "isSelected" : false},
      {"name" : "Development Trello Cards", "isSelected" : false},
      {"name" : "Development SlackPage", "isSelected" : false},
      {"name" : "Synergy 4 Cloud Users", "isSelected" : false},
      {"name" : "Synergy 4 Intern PieChart", "isSelected" : false},
      {"name" : "Synergy 4 Desktop Version Graph", "isSelected" : true},
      {"name" : "Synergy 4 Client Aus Map", "isSelected" : false},
      {"name" : "Synergy 4 World Map", "isSelected" : false},
      {"name" : "Synergy 5 Trial vs Active", "isSelected" : false},
      {"name" : "Synergy 5 Timeline", "isSelected" : false},
      {"name" : "Synergy 5 Client Count", "isSelected" : false},
      {"name" : "Synergy 5 World Map", "isSelected" : false}
    ];

  });