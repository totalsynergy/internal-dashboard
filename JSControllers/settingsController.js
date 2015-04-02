  app.controller('SettingsController', function($scope, Service, $rootScope, $http){
   $scope.eventBriteKey = '';
   $scope.totalSynergyKey = '';
   $scope.slackKey = '';
   $scope.totalSynergy5Key = '';
   $scope.trelloKeys = '';
   $scope.masterKey ='';
    $scope.speed = 10000;
    $scope.pages = null;
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
      $scope.pages = Service.pages;
    })

    $scope.$on('speedUpdated', function(){
      $scope.speed = Service.speed;
    })

    $scope.save = function(){
      if($scope.masterKey != ''){
        $http({
           url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/keys?codefortoday=' + $scope.masterKey,
           method: 'GET'
           }).success(function(d, status, headers, config){
             $scope.masterKey = 'Key Worked'
             if(d.data != null)
              arrangeKeys(d.data);
             else{
                $scope.masterKey = "Incorrect Key";
             }
           })
          .error(function(data, status, headers, config){
             $scope.masterKey = 'Error Occured';
          });
      }
      saveSpeedAndPages();
      Service.savePagesAndSpeed($scope.pages, $scope.speed);
    }

    function arrangeKeys(data){
      var trelloApplicationKey, trelloUserTokenKey, trelloCombinedKey = '';
      var fromAndTo = ["EventBrite Key", "Synergy 4 Key", "Slack", "Trello Application Key", "Trello User Token Key","Synergy 5 Key"];
      var keysArray = [];
      for(var j = 0; j < fromAndTo.length; j++){
        for(var i = 0 ; i < data.length; i++){
          if(fromAndTo[j] == data[i].Key){
            keysArray.push(data[i].Value);
            break;
          }
        }
      }
      saveKeysToLocalStorage(keysArray);
    }

    function saveKeysToLocalStorage(keysArray){
      chrome.storage.local.set({'eventBriteKey': keysArray[0]});
      chrome.storage.local.set({'totalSynergyKey': keysArray[1]});
      chrome.storage.local.set({'slackKey': keysArray[2]});
      chrome.storage.local.set({'speed' : $scope.speed});
      chrome.storage.local.set({'trelloKeys' : keysArray[3] + '-' + keysArray[4]});
      chrome.storage.local.set({'synergy5Keys' : keysArray[5]});
      chrome.storage.local.set({'pages' : Service.pages});
      Service.updateKeys(keysArray[0], keysArray[1], keysArray[2], keysArray[3] + '-' + keysArray[4], keysArray[5], $scope.speed, $scope.pages);
      Service.sendForData();
    }

    function saveSpeedAndPages(){
      chrome.storage.local.set({'speed' : $scope.speed});
      chrome.storage.local.set({'pages' : Service.pages});
    }

    $scope.restoreDefaults = function(){
      $scope.pages = restorePages;
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
      {"name" : "Totaltest Synergy Gravatar", "isSelected" : false},
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
      {"name" : "Development Relic", "isSelected" : false},
      {"name" : "Synergy 4 Cloud Users", "isSelected" : false},
      {"name" : "Synergy 4 Intern PieChart", "isSelected" : false},
      {"name" : "Synergy 4 Desktop Version Graph", "isSelected" : true},
      {"name" : "Synergy 4 Client Aus Map", "isSelected" : false},
      {"name" : "Synergy 4 World Map", "isSelected" : false},
      {"name" : "Synergy 4 PlaceHolder 1", "isSelected" : false},
      {"name" : "Synergy 4 PlaceHolder 2", "isSelected" : false},
      {"name" : "Synergy 4 Client Happy", "isSelected" : false},
      {"name" : "Synergy 4 Client Fine", "isSelected" : false},
      {"name" : "Synergy 4 Client Sad", "isSelected" : false},
      {"name" : "Synergy 5 Trial vs Active", "isSelected" : false},
      {"name" : "Synergy 5 Timeline", "isSelected" : false},
      {"name" : "Synergy 5 Client Count", "isSelected" : false},
      {"name" : "Synergy 5 World Map", "isSelected" : false},
      {"name" : "Synergy 5 Subscribers", "isSelected" : false},
      {"name" : "Synergy 5 Staff Distribution", "isSelected" : false},
      {"name" : "Synergy 5 Average Client Life", "isSelected" : false},
      {"name" : "Joke of The Day", "isSelected" : false},
      {"name" : "Leaderboard", "isSelected" : false}
    ];

  });