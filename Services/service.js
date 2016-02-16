

  /*
  
  Needs to be factored into smaller more suitable services.
  Currently controllers handle most AJAX requests - should be moved into service
  
  
  */
  app.factory('Service' , function($rootScope, $http){
    
    //The service object
    var service = {};
    
    //Service Variables 
    service.tab = 3;
    service.second = 0;
    service.speed = 15000;
    service.pages = pages;
    service.eventData = {};
    service.totalAttendees = 0;
    service.totalSynergyKey = "";
    service.eventBriteKey = "";
    service.slackKey = "";
    service.yammerKey = "";
    service.callsData = null;
    service.progressData = null;
    service.images = [];
    service.synergy5Data = null;
    service.abc123 = null;
    service.staffInfo = null;
    service.bomBeginningPageState = null;
    service.trelloLists = [];
    service.trelloListSelected = '';
    service.twitterBearerToken = '';
    service.twitterKey = '';
    service.twitterSecret = '';
    service.keysArray = [];
    
    //functions
    
    service.loadData = function initialiseLoad(){
      chrome.storage.local.get(null, function(result){
        
        //If Chrome get local storage is successful
        if(result.speed != null) {//added the speed here for future checks
                  
            //comment this if you need to restore pages
            service.updatePagesAndSpeed(result.pages, result.speed);
            service.updateKeys(result.eventBriteKey, result.totalSynergyKey, result.slackKey, result.trelloKeys, result.synergy5Keys, result.yammer, result.twitterKey, result.twitterSecret);
  
  
            this.trelloUserAuth = result.trelloUserAuth;
            service.trelloListSelected = result.trelloListSelected;
            service.getTrelloBoards(result.trelloKeys, result.trelloUserAuth);
          
            service.authenticateTwitter(result.twitterKey, result.twitterSecret); //pass the keys from local storage
        }
      });
    }
    

    //Saves the Keys in the Service and sends a broadcast to all controllers
    service.updateKeys = function(eventKey, tsKey, sKey, trKey, s5Key, yam, twitterK, twitterS){
      
      this.totalSynergyKey = tsKey;
      this.eventBriteKey = eventKey;
      this.slackKey = sKey;
      this.trelloKeys = trKey;
      this.totalSynergy5Key = s5Key;
      this.yammerKey = yam;
      this.twitterKey = twitterK;
      this.twitterS = twitterS;
      
      this.keysArray = [tsKey, eventKey, sKey, trKey, s5Key, yam, twitterK, twitterS];

      $rootScope.$broadcast("keysUpdated");

    }
    
    service.updatePagesAndSpeed = function(pages, speed){
      for(var i = 0; i < this.pages.length; i++)
      {
        for(var j = 0; j < pages.length; j++)
        {
          if(pages[j].name == this.pages[i].name)
          {
            this.pages[i].isSelected = pages[j].isSelected;
            break;
          }
        }
      }

      this.speed = speed;
      $rootScope.$broadcast("selectedUpdated");
    }
    
    //Retains the trello List selected in local storage
    service.saveTrelloListId = function(listId){
      chrome.storage.local.set({'trelloListSelected' : listId});
      service.trelloListSelected = listId;
      $rootScope.$broadcast('trelloListUpdated');
    }
    

    service.updateTab = function(value, cb){
        this.tab = value;
        this.soundCallback = cb;
        $rootScope.$broadcast("tabUpdated");
    }
    
    //Update the gravatars to be used in trello/leaderboard etc.
    service.updateGravatars = function(images){
      this.images = images;
      $rootScope.$broadcast("gravatarsUpdated");
    }
    
    //Shares the list of staff names/emails
    service.updateStaffInfo = function(d){
      this.staffInfo = d;
      $rootScope.$broadcast("staffInfoUpdated");
    }
    
    //Event Brite Data is been updated
    service.updateEventData = function(value){
      this.eventData = value;
      $rootScope.$broadcast("eventDataUpdated")
    }

    service.updateTotalAttendees = function(value){
      this.totalAttendees = value;
      $rootScope.$broadcast("attendeesUpdated");
    }
    
    //A data fetch message called every 5 minutes - used for controllers which need frequent data fetch such as conference
    /*
    service.sendForData = function(){
      $rootScope.$broadcast("fetchEventData");
      $rootScope.$broadcast("5minuteDataFetch");
    }
    
    //Slower data fetch called once an hour
    service.sendForDataLong = function(){
      $rootScope.$broadcast("fetchCallsData");
      $rootScope.$broadcast("hourlyDataCall");
    }
    */
    
    //Share/Update the synergy 5 statistics
    service.updateSynergy5Data = function(data){
      this.synergy5Data = data;
      $rootScope.$broadcast("synergy5DataUpdated");
    }
    
    service.updateTrelloSelectedName = function(name){
      service.trelloSelectedName = name;
      $rootScope.$broadcast("trelloSelectedNameUpdate");
    }

    //Slower Call used to independently update ABC123 clients - for testing with help desk speeds
    service.updateABC123 = function(data){
      this.abc123 = data;
      $rootScope.$broadcast("abc123Updated");
    }
    
    //Change a single page status - used to dynamically change BOM page
    service.changeIndividualPage = function(name, boolean){
      
      for(var i = 0; i < this.pages.length; i++){
        
        if(name == this.pages[i].name){
          this.pages[i].isSelected = boolean;
          break;
        }
        
      }
      
      $rootScope.$broadcast("selectedUpdated");
    }
    
    //Use the user auth to get the list of boards they are assigned to
    service.getTrelloBoards = function(keys, userAuth){
      
      if(keys && keys != ''){
        var trelloSplitKeys = keys.split("-");
        var url = 'https://api.trello.com/1/tokens/' + userAuth + '/member/idBoards?key=' + keys + '&token=' + userAuth;
        var modifiedUrl = url.replace(/\s/g, '');
  
        $http.get(modifiedUrl)
        .success(function(data){
            service.getTrelloLists(data,trelloSplitKeys[0], userAuth);
        })
        .error(function(data){

        });
      }
    }
    
    //batch call with the board id's to get potential lists to show
    service.getTrelloLists = function(boards, appKey, userKey){
      
      var batchString = '';
      
      for(var i =0; i < boards.length; i++){
        if(i !== 0)
          batchString += ",";
        batchString += "/1/boards/" + boards[i] + "?lists=open";
      }
      
      var batchUrl = 'https://api.trello.com/1/batch/?urls=' + batchString + '&key=' + appKey + '&token=' + userKey;
      var modUrl = batchUrl.replace(/\s/g, '');
      
            
      var trelloInfo = [];
      var that = this;
      
      
      $http.get(modUrl)
      .success(function(success){

          for (var i = 0; i < success.length; i++) {
            
            var board = success[i][200];
        
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

            //this.boardsInformation.push(boardObject);
          }
          that.trelloList = trelloInfo;
          $rootScope.$broadcast('trelloListUpdated');
      })
      .error(function(data){
          
      });
    }
    
    //Use Basic Auth to get a 'bearer-token' from Twitter to use in HTTP GET requests
    service.authenticateTwitter = function(twitterKey, twitterSecret){
      
      var key = twitterKey;
      var secretKey = twitterSecret;
      
      //Twitter Basic Ouath requires this step for future updates.
      var encodedKey = encodeURIComponent(key);
      var encodedSecretKey = encodeURIComponent(secretKey);
      
      var concatenatedKey = encodedKey + ":" + encodedSecretKey;
      var base64String = btoa(concatenatedKey);
      
      
      $http({
           url: 'https://api.twitter.com/oauth2/token',
           method: 'POST',
           headers: {
             'Authorization' : 'Basic '+ base64String,
             'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8'
           },
           data : 'grant_type=client_credentials'
        })
        .success(function(successData){
          service.twitterBearerToken = successData.access_token;
          $rootScope.$broadcast("Twitter Authenticated");
        })
        .error(function(errorData){
          
        });
    };
    
    //Return the index of the Bom Radar page
    function findBombPage(){
      for(var i = 0; i < this.pages.length; i++){
        if('Bom Radar' == this.pages[i].name){
          return i;
        }
      }
      return "Page does not exist";
    };

    //Return the service object with the 
    return service;
});
