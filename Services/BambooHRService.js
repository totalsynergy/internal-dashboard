(function(){
  
  angular
    .module('myApp')
    .factory('BambooHRService', Service);
    
  Service.$inject = ['$q', '$http'];
  function Service($q, $http){
    
    var service = {};
    service.getBirthdays = getBirthdays;

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

    return service;
  }
  
})();