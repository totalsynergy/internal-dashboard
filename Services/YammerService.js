(function(){
  
  angular
    .module('myApp')
    .factory('YammerService', Service);
    
  Service.$inject = ['$q', '$http'];
  function Service($q, $http){
    
    var service = {};
    service.getGroups = getGroups;
    service.getMessages = getMessages;
    service.getYammerData = getYammerData;
    service.setKeys = setKeys;
    
    service.encodedKey = '';
    
    function setKeys(yammerKey, yammerClientId){
      console.log("Make the encoded with: " + yammerKey + " & " + yammerClientId);
    }
    
    function getGroups(key){

      console.log("GET YAMMER GROUPS: " + key);
      return $q(function(resolve, reject){
         $http({
           url: 'https://www.yammer.com/api/v1/users/current.json?include_group_memberships=true',
           method: 'GET',
           headers: {'Content-Type': 'application/json', 'Authorization' : 'Bearer 7FPAj1DeqTJylDNWlGzJg' }
           }).success(function(d, status, headers, config){
             resolve(d);
           })
          .error(function(data, status, headers, config){
             reject(data);
          });
      });
      
    };
    
    function getMessages(olderThan){

      var url = 'https://www.yammer.com/api/v1/messages/my_feed.json';
      
      if(olderThan){
        url += "?older_than=" + olderThan;
      }
      
      return $q(function(resolve, reject){
        $http({
           url: url,
           method: 'GET',
           headers: {'Content-Type': 'application/json', 'Authorization' : 'Bearer 7FPAj1DeqTJylDNWlGzJg' }
           }).success(function(d, status, headers, config){
             resolve(d);
           })
          .error(function(data, status, headers, config){
             reject(data);
          });
      });
    }
    
    function getYammerData(){

      return $q(function(resolve, reject){
        $http({
          // url: 'https://www.yammer.com/api/v1/messages/my_feed.json',
           url : 'https://www.yammer.com/api/v1/users.json',
           method: 'GET',
           headers: {'Content-Type': 'application/json', 'Authorization' : 'Bearer 7FPAj1DeqTJylDNWlGzJg' }
           }).success(function(d, status, headers, config){
             resolve(d);
           })
          .error(function(data, status, headers, config){
             reject(data);
          });
      });
    }

    return service;
  }
  
})();