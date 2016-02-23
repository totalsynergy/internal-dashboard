(function(){
  angular
    .module('myApp')
    .factory('EventbriteService', Service);
    
  Service.$inject = ['$http', '$q', '$rootScope'];
  
  function Service($http, $q, $rootScope){
    var service = {};
    service.getCountdown = getCountdown;
    service.getAttendeesData = getAttendeesData;
    service.updateTotalAttendees = updateTotalAttendees;
    
    function getCountdown(key){
      
      return $q(function(resolve, reject){
        
        $http.get("https://www.eventbriteapi.com/v3/events/17562070626/?token=" + key)
        .success(function(data){
          resolve(data);
        })
        .error(function(data){
          reject(data);
        });
        
      });
      
    }
    
    function getAttendeesData(page, key){
      
      return $q(function(resolve, reject){
        
        $http.get("https://www.eventbriteapi.com/v3/events/17562070626/attendees/?page=" + page  + "&token=" + key)
        .success(function(data){
          resolve(data);
        })
        .error(function(data){
          reject(data);
        });
      
      });
    }
    
      function updateTotalAttendees(attendees){
        service.totalAttendees = attendees;
        $rootScope.$broadcast('attendeesUpdated');
      }
  
    return service;
  }
  
})();