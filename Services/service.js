

  /*
  
  Needs to be factored into smaller more suitable services.
  
  
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
    service.bambooHrKey = "";
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
    service.yammerClientId = '';
    service.keysArray = [];
    
    //Default set to totalsynergydev
    service.leaderboardSlug = "totalsynergydev";
    
    //Functions
    service.loadData = loadData;
    service.updateKeys = updateKeys;
    service.updatePagesAndSpeed = updatePagesAndSpeed;
    service.updateTab = updateTab;
    
    //functions
    
    function loadData(){
      chrome.storage.local.get(null, function(result){
        
        //If Chrome get local storage is successful
        if(result.speed != null) {//added the speed here for future checks
                  
            //comment this if you need to restore pages
            service.updatePagesAndSpeed(result.pages, result.speed);
            service.updateKeys(result.eventBriteKey, result.totalSynergyKey, result.slackKey, result.trelloKeys, result.synergy5Keys, result.yammer, result.twitterKey, result.twitterSecret, result.bambooHrKey, result.yammerClientId);
            
            //If a slug exists, change the default
            if(result.leaderboardSlug)
            {
              service.leaderboardSlug = result.leaderboardSlug;
            }

  
            this.trelloUserAuth = result.trelloUserAuth;
            service.trelloListSelected = result.trelloListSelected;
            if(service.trelloListSelected && service.trelloListSelected != "")
              $rootScope.$broadcast('trelloListUpdated');

            $rootScope.$broadcast("keysUpdated");

        }
      });
    }
    

    //Saves the Keys in the Service and sends a broadcast to all controllers
    function updateKeys(eventKey, tsKey, sKey, trKey, s5Key, yam, twitterK, twitterS, bambooHrKey, yammerClientId){
      
      this.totalSynergyKey = tsKey;
      this.eventBriteKey = eventKey;
      this.slackKey = sKey;
      this.trelloKeys = trKey;
      this.totalSynergy5Key = s5Key;
      this.yammerKey = yam;
      this.twitterKey = twitterK;
      this.twitterS = twitterS;
      this.bambooHrKey = bambooHrKey;
      this.yammerClientId = yammerClientId;
      this.keysArray = [tsKey, eventKey, sKey, trKey, s5Key, yam, twitterK, twitterS, bambooHrKey, yammerClientId];

    }
    
    function updatePagesAndSpeed(pages, speed){
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
    
    function updateTab(value, cb){
        this.tab = value;
        this.soundCallback = cb;
        $rootScope.$broadcast("tabUpdated");
    }
    
    //Retains the trello List selected in local storage
    service.saveTrelloListId = function(listId){
      chrome.storage.local.set({'trelloListSelected' : listId});
      service.trelloListSelected = listId;
      $rootScope.$broadcast('trelloListUpdated');
    }
    
    //Update the gravatars to be used in trello/leaderboard etc.
    service.updateGravatars = function(images){
      this.images = images;
      $rootScope.$broadcast("gravatarsUpdated");
    }

    service.updateTrelloSelectedName = function(name){
      service.trelloSelectedName = name;
      $rootScope.$broadcast("trelloSelectedNameUpdate");
    }

    //Return the service object with the 
    return service;
});
