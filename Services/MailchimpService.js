(function(){
  angular
    .module('myApp')
    .factory('MailchimpService', Service);
    
  Service.$inject = ['$http', '$q', '$rootScope'];
  
  function Service($http, $q, $rootScope){
    var service = {};
    
    service.getAttendeesData = getAttendeesData;
    service.updateTotalAttendees = updateTotalAttendees;
    service.totalAttendees = 0;
    
    function getAttendeesData(){
      
      return $q(function(resolve, reject){
        
        $http({
          method: 'GET',
          url: "https://us4.api.mailchimp.com/3.0/lists/499ea9f3f4/members",
          headers: {
            "Authorization" : "Basic QWRhbToyOTJlZDVkOTcwNDZkNWVhNzM2ZGUxZTMyODU0MGFlNi11czQ="
          }
        })
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