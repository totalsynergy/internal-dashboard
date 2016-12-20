(function(){
  
  angular
    .module('myApp')
    .factory('BambooHRService', Service);
    
  Service.$inject = ['$q', '$http'];
  function Service($q, $http){
    
    var service = {};
    service.slug = "totalsynergysandbox";
    service.sandboxKey = "9f2b2692b0f865f4f67118e1646026bc5d7841af";
    service.key = "";
    
    service.getBirthdays = getBirthdays;
    service.getEmployees = getEmployees;
    service.getTimeOff = getTimeOff;
    service.updateKey = updateKey;
    
    function updateKey(key){
      service.key = key
      
      //Check for sandbox environment
      if(key != service.sandboxKey)
      {
        service.slug = "totalsynergy";
      }
      else
      {
        console.log("In sandbox environment");
      }
    }
    
    function getBirthdays(){

      return $q(function(resolve, reject){
        
           $http({
              url: 'https://api.bamboohr.com/api/gateway.php/' + service.slug + '/v1/employees',
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
    
    function getEmployees(){

      return $q(function(resolve, reject){
        
           $http({
              url: 'https://api.bamboohr.com/api/gateway.php/' + service.slug + '/v1/employees/directory',
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
    
    function getTimeOff(start){

      
      return $q(function(resolve, reject){
        
           $http({
              url: 'https://api.bamboohr.com/api/gateway.php/' + service.slug + '/v1/time_off/whos_out?start=' + start,
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