

  angular.module('appService', []).factory('Service' , function($rootScope){
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
    service.callsData = null;
    service.progressData = null;
    service.images = [];
    service.synergy5Data = null;
    service.abc123 = null;

     service.updateKeys = function(eventKey, tsKey, sKey, trKey, s5Key, speed, pag){
      this.totalSynergyKey = tsKey;
      this.eventBriteKey = eventKey;
      this.slackKey = sKey;
      this.trelloKeys = trKey;
      this.totalSynergy5Key = s5Key;
      this.speed = speed;
      this.pages = pag;
      $rootScope.$broadcast("keysUpdated");
      $rootScope.$broadcast("speedUpdated");
      $rootScope.$broadcast("selectedUpdated");
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
      console.log("Gravatar update");
      $rootScope.$broadcast("gravatarsUpdated");
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
    }

    service.sendForCallsData = function(){
      $rootScope.$broadcast("fetchCallsData");
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

    service.savePagesAndSpeed = function(pages, speed){
      this.pages = pages;
      this.speed = speed;
      $rootScope.$broadcast("speedUpdated");
      $rootScope.$broadcast("selectedUpdated");
    }

    service.updateABC123 = function(data){
      this.abc123 = data;
      $rootScope.$broadcast("abc123Updated");
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
      {"name" : "Development SlackPage", "isSelected" : false},
      {"name" : "Synergy 4 Cloud Users", "isSelected" : false},
      {"name" : "Synergy 4 Intern PieChart", "isSelected" : false},
      {"name" : "Synergy 4 Desktop Version Graph", "isSelected" : true},
      {"name" : "Synergy 4 Client Aus Map", "isSelected" : false},
      {"name" : "Synergy 4 World Map", "isSelected" : false},
      {"name" : "Synergy 5 Trial vs Active", "isSelected" : false},
      {"name" : "Synergy 5 Timeline", "isSelected" : false},
      {"name" : "Synergy 5 Client Count", "isSelected" : false},
      {"name" : "Synergy 5 World Map", "isSelected" : false},
      {"name" : "Synergy 5 Subscribers", "isSelected" : false},
      {"name" : "Synergy 5 Staff Distribution", "isSelected" : false},
      {"name" : "Synergy 5 Client Happy", "isSelected" : false},
      {"name" : "Synergy 5 Client Fine", "isSelected" : false},
      {"name" : "Synergy 5 Client Sad", "isSelected" : false},
      {"name" : "Joke of The Day", "isSelected" : false}
    ];

    var tabOpen = 4;

    var cloudConversionData = "";







// Maybe place settings tabs at default 99 - just for memory