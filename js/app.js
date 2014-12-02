

  angular.module('appService', []).factory('Service', function($rootScope){
    var service = {};
    service.tab = 3;
    service.second = 0;
    service.speed = 15000;
    service.pages = null;
    service.eventData = {};
    service.totalAttendees = 0;
    service.totalSynergyKey = "";
    service.eventBriteKey = "";

    service.updateKeys = function(eventKey, tsKey, speed, pag){
      this.totalSynergyKey = tsKey;
      this.eventBriteKey = eventKey;
      this.speed = speed;
      this.pages = pag;
      $rootScope.$broadcast("keysUpdated");
      $rootScope.$broadcast("speedUpdated");
      $rootScope.$broadcast("selectedUpdated")
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



    return service;
});

  var app = angular.module('myApp', ['appService', 'uiSlider', 'nvd3ChartDirectives']);



    var synergyApiKey = "";

    var eventBriteKey = "?";

    var test = 1;

    var speed = 15000;

    var pages = [
      {"name" : "totalSynergy", "isSelected" : false},
      {"name" : "desktopVersion", "isSelected" : false},
      {"name" : "another Graph", "isSelected" : true},
      {"name" : "total Attendees", "isSelected" : true},
      {"name" : "attendeeMap", "isSelected" : true},
      {"name" : "conferenceCountDown", "isSelected" : true}
    ];

    var tabOpen = 4;






// Maybe place settings tabs at default 99 - just for memory