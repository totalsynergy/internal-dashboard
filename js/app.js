

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

    service.updateKeys = function(eventKey, tsKey, sKey, speed, pag){
      this.totalSynergyKey = tsKey;
      this.eventBriteKey = eventKey;
      this.slackKey = sKey;
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

    service.restore = function(speed, page){
      this.pages = page;
      this.speed = 15000;
      $rootScope.$broadcast("speedUpdated");
      $rootScope.$broadcast("selectedUpdated");
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

        console.log("Changing imgSrcSanitizationWhiteList from "+currentImgSrcSanitizationWhitelist+" to "+newImgSrcSanitizationWhiteList);
        $compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);
    }
]);




    var synergyApiKey = "";

    var eventBriteKey = "?";

    var test = 1;

    var speed = 15000;

    var pages = [
      {"name" : "Cloud Users", "isSelected" : false},
      {"name" : "Another PieChart", "isSelected" : false},
      {"name" : "Desktop Version Graph", "isSelected" : true},
      {"name" : "Total Attendees", "isSelected" : true},
      {"name" : "Attendee Map", "isSelected" : true},
      {"name" : "conference CountDown", "isSelected" : true},
      {"name" : "Gravatar", "isSelected" : false},
      {"name" : "Synergy Clients", "isSelected" : false},
      {"name" : "HelpDesk1", "isSelected" : false},
      {"name" : "HelpDesk2", "isSelected" : false},
      {"name" : "HelpDesk3", "isSelected" : false},
      {"name" : "HelpDesk4", "isSelected" : false},
      {"name" : "HelpDesk5", "isSelected" : false},
      {"name" : "Test3", "isSelected" : false}
    ];

    var tabOpen = 4;

    var cloudConversionData = "";







// Maybe place settings tabs at default 99 - just for memory