app.controller('SettingsController', function($scope, Service, $rootScope, $http){
    
   $scope.eventBriteKey = '';
   $scope.totalSynergyKey = '';
   $scope.slackKey = '';
   $scope.totalSynergy5Key = '';
   $scope.trelloKeys = '';
   $scope.masterKey ='';
   $scope.speed = 10000;
   $scope.pages = pages;
   $scope.practiceNumber = 10;
   $scope.trelloListSelected = {"listId":"556b9a17dd087e37aac39776","listName":"Sprint Backlog"};
   $scope.trelloAuthWorks = false;


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
    });

    $scope.$on('speedUpdated', function(){
      $scope.speed = Service.speed;
    });
    
    

    $scope.$watch('speed', function(){
      Service.updateSpeed($scope.speed);
    });


    $scope.$on('selectedUpdated', function(){
      $scope.pages = Service.pages;
    });
    
    //Save the listID and sort the order of lists so user knows which list was previously selected
    $scope.$on('trelloListUpdated', function(){

      $scope.trelloAuthWorks = true;
      
      $scope.trelloLists = Service.trelloList;
      
      $scope.trelloListSelected.listId = Service.trelloListSelected;
      $scope.trelloListSelected.listName = $scope.getDefaultList();
      
    });
    
    //Goes through Trello Lists and finds the previously selected one - puts this as default in select ng-options
    $scope.getDefaultList = function(){
      
      //even though scope not within blocks still declare
      var selectedObject= {};
      
      if($scope.trelloLists[0].name === "Currently Selected"){
        $scope.trelloLists.shift();
      }

      
      for(var i = 0; i < $scope.trelloLists.length; i++){
        
        for(var j = 0; j < $scope.trelloLists[i].lists.length; j++){

          if($scope.trelloLists[i].lists[j].listId == Service.trelloListSelected){
            
            selectedObject = { 
              "name" : "Currently Selected", 
              "lists" : [
                {"listId":$scope.trelloLists[i].lists[j].listId,"listName":$scope.trelloLists[i].lists[j].listName}
              ]
            };           // return $scope.trelloLists[i].lists[j].listName;
            Service.updateTrelloSelectedName($scope.trelloLists[i].lists[j].listName);
          }
          
        }
      }
      
      $scope.trelloLists.unshift(selectedObject);
      
    }
    
    //Saves pages and Speed. If syenrgy call was successful save these keys
    $scope.save = function(){
      if($scope.masterKey != ''){
        $http({
           url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/keys?codefortoday=' + $scope.masterKey,
           method: 'GET'
           }).success(function(d, status, headers, config){
             
             $scope.masterKey = 'Key Worked';

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
      
      //Only load this if we are set up with auth
      if($scope.trelloAuthWorks)
        Service.saveTrelloListId($scope.trelloListSelected.listId);

      
    }
    
    //Arranges the keys 
    //removed trello user token key from list so it does not use the one feed gives
    function arrangeKeys(data){
      
      var trelloApplicationKey, trelloUserTokenKey, trelloCombinedKey = '';
      var fromAndTo = ["EventBrite Key", "Synergy 4 Key", "Slack", "Trello Application Key","Synergy 5 Key", "yammer", "TwitterKey", "TwitterSecret"];
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
    
    //Save keys and then notify service of the change
    function saveKeysToLocalStorage(keysArray){
      chrome.storage.local.set({'eventBriteKey': keysArray[0]});
      chrome.storage.local.set({'totalSynergyKey': keysArray[1]});
      chrome.storage.local.set({'slackKey': keysArray[2]});
      chrome.storage.local.set({'speed' : $scope.speed});
      chrome.storage.local.set({'trelloKeys' : keysArray[3]});
      chrome.storage.local.set({'synergy5Keys' : keysArray[4]});
      chrome.storage.local.set({'yammer' : keysArray[5]});
      chrome.storage.local.set({'twitterKey' : keysArray[6]});
      chrome.storage.local.set({'twitterSecret' : keysArray[7]});
      chrome.storage.local.set({'pages' : Service.pages});
      Service.updateKeys(keysArray[0], keysArray[1], keysArray[2], keysArray[3], keysArray[4], keysArray[5], keysArray[6], keysArray[7], $scope.speed, $scope.pages);
      Service.sendForData();
    }

    function saveSpeedAndPages(){
      chrome.storage.local.set({'speed' : $scope.speed});
      chrome.storage.local.set({'pages' : Service.pages});
    }

    //Make sure the page we go back to is selected
    $scope.settingsClose = function(){
      
      for(i = 0; i < pages.length; i++)
        if($scope.pages[i].isSelected){
          $scope.tab = i + 1;
          Service.updateTab(i + 1);
          $rootScope.$broadcast('settingsClosed')
        }
        
    }
    
    //load the trello authorization
    $scope.authorizeTrello = function(){
      $(".synergyPages").append("<webview src='https://trello.com/1/authorize?key=d04c9c2bd2be123721cdbf17f78f5c20&name=Synergy+Dashboard&expiration=never&response_type=token&scope=read' id='trelloAuthorize' onload='trelloChange' scrolling='no'></webview>");
      var webview = document.getElementById("trelloAuthorize");
      webview.addEventListener("loadstop", $scope.trelloChange);

    };
    
    //Check whether the current webview contains the key we need
    $scope.trelloChange = function(){
        
       var webview = document.getElementById("trelloAuthorize");
       
       webview.executeScript(
        {code: 'document.getElementsByTagName ("PRE")[0].firstChild.data'},
        function(results) {

          if(results && results != ''){
            
            var key = results[0].replace(/(\r\n|\n|\r)/gm," ");
            
            $("#trelloAuthorize").remove();
            
            chrome.storage.local.set({'trelloUserAuth' : key });
            
            $scope.trelloAuthWorks = true;
          }

      });
    };

    $scope.turnOffPage = function(page){
      page.isSelected = !page.isSelected;
      Service.updatePages($scope.pages);
    }



  });