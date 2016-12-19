(function(){
  
  angular
    .module('myApp')
    .factory('BambooHRService', Service);
    
  Service.$inject = ['$q', '$http'];
  function Service($q, $http){
    
    var service = {};
    service.slug = "totalsynergysandbox";
    service.key = "9f2b2692b0f865f4f67118e1646026bc5d7841af";
    
    service.getBirthdays = getBirthdays;
    service.getEmployees = getEmployees;
    service.getTimeOff = getTimeOff;

    function getBirthdays(key){

      return $q(function(resolve, reject){
        
           $http({
              url: 'https://api.bamboohr.com/api/gateway.php/totalsynergy/v1/employees?apikey=' + key,
              method: 'POST',
              headers: {
                'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8'
              }
            })
            .success(function(successData){
              resolve(successData);
            })
            .error(function(errorData){
              reject(errorData);
            });
          });

    };
    
    function getEmployees(key){

      return $q(function(resolve, reject){
        
           $http({
              url: 'https://api.bamboohr.com/api/gateway.php/totalsynergysandbox/v1/employees/directory',
              method: 'GET',
              headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Basic ' + encodedKey(),
                'Accept' : 'application/json'
              }
            })
            .success(function(successData){
              resolve(successData);
            })
            .error(function(errorData){
              reject(errorData);
            });
          });

    };
    
    function getTimeOff(key, start){

      
      return $q(function(resolve, reject){
        
           $http({
              url: 'https://api.bamboohr.com/api/gateway.php/totalsynergysandbox/v1/time_off/whos_out?start=' + start,
              method: 'GET',
              headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Basic ' + encodedKey(),
                'Accept' : 'application/json'
              }
            })
            .success(function(successData){
              resolve(successData);
            })
            .error(function(errorData){
              reject(errorData);
            });
          });

    };
    
    function encodedKey(){
      var stringToEncode = service.key + ":x";
      var encoded = btoa(stringToEncode);
      return encoded;
    }

    return service;
  }
  
})();