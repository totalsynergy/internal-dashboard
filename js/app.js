

  angular.module('appService', []).factory('Service' , function($rootScope, $http){
    var service = {};
    service.tab = 3;
    service.second = 0;
    service.speed = 15000;
    service.pages = null;
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
    
    chrome.storage.local.get(null, function(result){
      if(result.pages != null && result.speed != null) {//added the speed here for future checks
        this.trelloUserAuth = result.trelloUserAuth;
        service.updateKeys(result.eventBriteKey, result.totalSynergyKey, result.slackKey,  result.trelloKeys, result.synergy5Keys, result.yammer, result.speed, result.pages);
        service.trelloListSelected = result.trelloListSelected;
        service.getTrelloBoards(result.trelloKeys, result.trelloUserAuth);
        //service.authenticateTwitter(); //pass the keys from local storage
      }
    });

    
    function changePagesSelected(pageData){
      for(var i = 0; i < pageData.length; i++){
        for(var j = 0; i < pages.length; j++){
          if(pageData[i].name == pages[j].name){
            pages[j].isSelected = pageData[i].isSelected;
            break;
          }
        }
      }
      this.pages = pages;
      service.pages = pages;
      service.bomBeginningPageState  = this.pages[findBombPage()].isSelected;
      $rootScope.$broadcast("stateOfBomUpdated");
      $rootScope.$broadcast("selectedUpdated");
    }
    
     service.updateKeys = function(eventKey, tsKey, sKey, trKey, s5Key, yam, speed, pag){
      this.totalSynergyKey = tsKey;
      this.eventBriteKey = eventKey;
      this.slackKey = sKey;
      this.trelloKeys = trKey;
      this.totalSynergy5Key = s5Key;
      this.yammerKey = yam;
      this.speed = speed;
      this.pages = pag;
      
      this.bomBeginningPageState  = this.pages[findBombPage()].isSelected;
      $rootScope.$broadcast("stateOfBomUpdated");
      
      $rootScope.$broadcast("keysUpdated");
      $rootScope.$broadcast("speedUpdated");
      $rootScope.$broadcast("selectedUpdated");

    }
    
    service.saveTrelloListId = function(listId){
      chrome.storage.local.set({'trelloListSelected' : listId});
      service.trelloListSelected = listId;
      $rootScope.$broadcast('trelloListUpdated');
    }

    service.passCallsData = function(callsData, progressData){
      this.callsData = callsData;
      this.progressData = progressData;
      $rootScope.$broadcast('callsDataUpdated');
    }


    service.updateTab = function(value){
        this.tab = value;
        $rootScope.$broadcast("tabUpdated");
    }

    service.updateGravatars = function(images){
      this.images = images;
      $rootScope.$broadcast("gravatarsUpdated");
    }
    
    service.updateStaffInfo = function(d){
      this.staffInfo = d;
      $rootScope.$broadcast("staffInfoUpdated");
    }


    service.updateSpeed = function(value){
        this.speed = value;
        $rootScope.$broadcast("speedUpdated")
    }

    service.updatePages = function(value){
      this.pages = value;
      $rootScope.$broadcast("selectedUpdated")
    }

    service.updateEventData = function(value){
      this.eventData = value;
      $rootScope.$broadcast("eventDataUpdated")
    }

    service.updateTotalAttendees = function(value){
      this.totalAttendees = value;
      $rootScope.$broadcast("attendeesUpdated");
    }

    service.sendForData = function(){
      $rootScope.$broadcast("fetchEventData");
      $rootScope.$broadcast("5minuteDataFetch");
    }

    service.sendForCallsData = function(){
      $rootScope.$broadcast("fetchCallsData");
      $rootScope.$broadcast("hourlyDataCall");
    }

    service.restore = function(speed, page){
      this.pages = page;
      this.speed = 15000;
      $rootScope.$broadcast("speedUpdated");
      $rootScope.$broadcast("selectedUpdated");
    }

    service.updateSynergy5Data = function(data){
      this.synergy5Data = data;
      $rootScope.$broadcast("synergy5DataUpdated");
    }
    
    service.updateTrelloSelectedName = function(name){
      service.trelloSelectedName = name;
      $rootScope.$broadcast("trelloSelectedNameUpdate");
    }

    service.savePagesAndSpeed = function(pages2, speed2){
      this.pages = pages2;
      this.speed = speed2;
      this.bomBeginningPageState  = this.pages[findBombPage()].isSelected;
      service.pages = pages2;
      service.speed = speed2;
      $rootScope.$broadcast("speedUpdated");
      $rootScope.$broadcast("stateOfBomUpdated");
      $rootScope.$broadcast("selectedUpdated");
    }


    service.updateABC123 = function(data){
      this.abc123 = data;
      $rootScope.$broadcast("abc123Updated");
    }
    
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
      
      var trelloSplitKeys = keys.split("-");
      var url = 'https://api.trello.com/1/tokens/' + userAuth + '/member/idBoards?key=' + trelloSplitKeys[0] + '&token=' + userAuth;
      var modifiedUrl = url.replace(/\s/g, '');

      $http.get(modifiedUrl)
      .success(function(data){
          service.getTrelloLists(data,trelloSplitKeys[0], userAuth);
      })
      .error(function(data){
        
          console.log("Could not get trello boards :(");
      });
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
          console.log("Could not get trello lists :(");
      });
    }
    
    service.authenticateTwitter = function(){
      //var key = '?' Go online and get
      //var secretKey = '???';
      
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
          console.log("Did not get bearer token: " + JSON.stringify(errorData));
        });
    }
    
    function findBombPage(){
      for(var i = 0; i < this.pages.length; i++){
        if('Bom Radar' == this.pages[i].name){
          return i;
        }
      }
      return "Page does not exist";
    }



    return service;
});

  var app = angular.module('myApp', ['appService', 'uiSlider', 'nvd3ChartDirectives', 'ngAnimate', 'gravatarModule', 'ngAudio', 'ngMd5'])
  .config( [
    '$compileProvider',
    function( $compileProvider ) {
        var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
        var newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0,-1)
        + '|chrome-extension:'
        +currentImgSrcSanitizationWhitelist.toString().slice(-1);


        $compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);
    }
]);




    var synergyApiKey = "";

    var eventBriteKey = "?";

    var test = 1;

    var speed = 15000;

    var pages = [
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
      {"name" : "Yammer", "isSelected" : false},
      {"name" : "Twitter", "isSelected" : false},
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
      {"name" : "Leaderboard", "isSelected" : false},
      {"name" : "Marketing Values 1", "isSelected" : false},
      {"name" : "Marketing Values 2", "isSelected" : false},
      {"name" : "Total Synergy Structure", "isSelected" : false},
      {"name" : "Bom Radar", "isSelected" : false}
    ];

    var tabOpen = 4;

    var cloudConversionData = "";







// Maybe place settings tabs at default 99 - just for memory