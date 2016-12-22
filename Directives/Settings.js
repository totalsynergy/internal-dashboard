
app.directive("settings", function(){
  
  
  var  controller = function($scope, Service, $rootScope, $http, TrelloService){

   $scope.trelloKeys = '';
   $scope.masterKey ='';
   $scope.leaderboardSlug = '';
   
   $scope.yammerKey = '';
   $scope.yammerClientId = '';

   //$scope.pages = pages;
   $scope.practiceNumber = 10;
   $scope.trelloListSelected = {"listId":"556b9a17dd087e37aac39776","listName":"Sprint Backlog"};
   $scope.trelloAuthWorks = false;

    $scope.$watch('keys', function(){
    
      $scope.trelloKeys = $scope.keys[3];
      $scope.leaderboardSlug = Service.leaderboardSlug;
     

    });
    
    //Save the listID and sort the order of lists so user knows which list was previously selected
    $scope.$on('trelloListUpdated', function(){
      $scope.trelloListSelected.listId = Service.trelloListSelected;
    });
    
    $scope.$on('keysUpdated', function getTrelloLists(){
      //Keys update - get the synergy slug
      console.log("Change to slug!");
      $scope.leaderboardSlug = Service.leaderboardSlug;
      console.log("Settings changed and now: " + Service.leaderboardSlug);
      $scope.trelloKeys = Service.trelloKeys.split("-");
      $scope.trelloUserAuth = Service.trelloUserAuth;
      $scope.yammerKey = Service.yammerKey;
      $scope.yammerClientId = Service.yammerClientId;
      getTrelloInformation();
    });
    
    function getTrelloInformation(){
      
      TrelloService.getTrelloBoards($scope.trelloKeys, $scope.trelloUserAuth).then(function(success){
        return success;
      })
      .then(function(trelloBoards){
        TrelloService.getTrelloLists(trelloBoards, $scope.trelloKeys, $scope.trelloUserAuth).then(function(success){
          return success
        });     
      })
      .then(function(trelloLists){
        sortTrelloLists(trelloLists);
      });

    }
    
    function sortTrelloLists(listData){
      
      var trelloInfo = [];
      
      for (var i = 0; i < listData.length; i++) {
        var board = listData[i][200];
        var boardObject = {
            "id": board.id,
            "name": board.name,
            "lists": []
        };
        
        for (var j = 0; j < board.lists.length; j++) {
          var list = board.lists[j];
          var listObject = {
              "listId": list.id,
              "listName": list.name,
          };
        
          boardObject.lists.push(listObject);
        }
        
        trelloInfo.push(boardObject);

      }
      
      $scope.trelloLists = trelloInfo;
      $scope.trelloListSelected.listId = Service.trelloListSelected;
      getDefaultList();
    }
    
    
    //Goes through Trello Lists and finds the previously selected one - puts this as default in select ng-options
    function getDefaultList(){
      
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
            break;
          }
          
        }
      }
      
      $scope.trelloLists.unshift(selectedObject);
    }
    
    //Saves pages and Speed. If syenrgy call was successful save these keys
    $scope.save = function(){
      
      if($scope.masterKey == "magicRestore")
      {
        $scope.pages = pages;
        $scope.speed = 5;
      }
      
      updatePagesAndSpeed();
      
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
      
      //Save the leaderboard slug
      if($scope.leaderboardSlug)
        chrome.storage.local.set({'leaderboardSlug': $scope.leaderboardSlug});
      //Only load this if we are set up with auth
      if($scope.trelloAuthWorks)
        Service.saveTrelloListId($scope.trelloListSelected.listId);

      
    }
    
    //Arranges the keys 
    //removed trello user token key from list so it does not use the one feed gives
    function arrangeKeys(data){

            
      console.log("Keys are: " + JSON.stringify(data));
      var trelloApplicationKey, trelloUserTokenKey, trelloCombinedKey = '';
      var fromAndTo = ["EventBrite Key", "Synergy 4 Key", "Slack", "Trello Application Key","Synergy 5 Key", "yammer", "TwitterKey", "TwitterSecret", "bamboohr", "yammerClientId"];
      var keysArray = [];
      
      if(data){
        for(var j = 0; j < fromAndTo.length; j++){
          
          for(var i = 0 ; i < data.length; i++){
            
            if(fromAndTo[j] == data[i].Key){
              keysArray.push(data[i].Value);
              break;
            }
            
          }
        }
      }

      saveKeysToLocalStorage(keysArray);
    }
    
    function updatePagesAndSpeed(){
      chrome.storage.local.set({'pages' : $scope.pages});
      chrome.storage.local.set({'speed' : $scope.speed});
      
      Service.updatePagesAndSpeed($scope.pages, $scope.speed);
    }
    
    //Save keys and then notify service of the change
    function saveKeysToLocalStorage(keysArray){
      
      chrome.storage.local.set({'eventBriteKey': keysArray[0]});
      chrome.storage.local.set({'totalSynergyKey': keysArray[1]});
      chrome.storage.local.set({'slackKey': keysArray[2]});
      chrome.storage.local.set({'trelloKeys' : "d04c9c2bd2be123721cdbf17f78f5c20"});
      chrome.storage.local.set({'synergy5Keys' : keysArray[4]});
      chrome.storage.local.set({'yammer' : keysArray[5]});
      chrome.storage.local.set({'twitterKey' : keysArray[6]});
      chrome.storage.local.set({'twitterSecret' : keysArray[7]});
      chrome.storage.local.set({'bambooHrKey' : keysArray[8]});
      chrome.storage.local.set({'yammerClientId' : keysArray[9]});
            
      Service.updateKeys(keysArray[0], keysArray[1], keysArray[2], keysArray[3], keysArray[4], keysArray[5], keysArray[6], keysArray[7], keysArray[8], keysArray[9]);
      Service.sendForData();
    }

    //Make sure the page we go back to is selected
    $scope.settingsClose = function(){
      
      for(i = 0; i < pages.length; i++)
        if($scope.pages[i].isSelected){
          $scope.tab = i + 1;
          Service.updateTab(i + 1, null);
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
      
      for(var i = 0; i< $scope.pages.length; i++)
      {
        if(page.name == $scope.pages[i].name)
        {
          $scope.pages[i].isSelected = !page.isSelected;
          //page.isSelected = !page.isSelected;
        }
      }
      

    }
    
  }
  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/Settings.html',
    controller: controller,
    scope : {
      pages: "=pages",
      speed: "=speed",
      keys: "=keys",
      tab: "="
    }
  }
  
});






