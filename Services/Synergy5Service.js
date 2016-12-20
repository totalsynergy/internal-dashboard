//TO DO - Reuse the q constructor code - getting repetitive

(function(){
  angular
    .module('myApp')
    .factory('Synergy5Service', Service);
    
  Service.$inject = ['$q', '$http'];
  function Service($q, $http){
    
    var service = {};
    
    //Revealing Module pattern
    service.getLatestClient = getLatestClient;
    service.getCountryData = getCountryData;
    service.getIndustryData = getIndustryData;
    service.getStaffData = getStaffData;
    service.getProductData = getProductData;
    service.getSynergyStaff = getSynergy5Staff;
    service.getSynergy5Leaderboard = getSynergy5Leaderboard;
    
    function getLatestClient(key){
      
      return $q(function (resolve, reject){
        
        if(!key || key == '')
        {
          reject("No key");
        }
        
        $http({
          method: 'POST',
          url: 'https://app.totalsynergy.com/internalkpi/totalsynergy/summary/newclient',
          headers: {'Content-Type': 'application/json', 'internal-token' : key}
        }).success(function(d, status, headers, config){
          console.log("Got latest client: " + JSON.stringify(d));
           resolve(d);
         })
        .error(function(data, status, headers, config){
           reject(data);
        });
        
      });
      
    }
    
    function getCountryData(key){
      return $q(function(resolve, reject){
        
        if(!key || key == '')
        {
          reject("No key");
        }
        
        $http({
         url: 'https://app.totalsynergy.com/internalkpi/totalsynergy/summary/country',
         method: 'POST',
         headers: {'Content-Type': 'application/json', 'internal-token' : key}
         }).success(function(d, status, headers, config){
           resolve(d);
         })
        .error(function(data, status, headers, config){
           reject(data);
        });
        
      });
    }
    
    function getIndustryData(key){
      return $q(function(resolve, reject){
        
        if(!key || key == '')
        {
          reject("No key");
        }
        
        $http({
         url: 'https://app.totalsynergy.com/internalkpi/totalsynergy/summary/industries',
         method: 'POST',
         headers: {'Content-Type': 'application/json', 'internal-token' : key}
         }).success(function(d, status, headers, config){
           resolve(d);
         })
        .error(function(data, status, headers, config){
           reject(data);
        });
      })
    }
    
    function getStaffData(key){
      return $q(function(resolve, reject){
        
        console.log("TRY WITH STAFF DATA KEY: " + key);
        if(!key || key == '')
        {
          reject("No key");
        }
        
        $http({
         url: 'https://app.totalsynergy.com/internalkpi/totalsynergy/summary/staffSize',
         method: 'POST',
         headers: {'Content-Type': 'application/json', 'internal-token' : key}
         }).success(function(d, status, headers, config){
           resolve(d);
         })
        .error(function(data, status, headers, config){
           reject(data);
        });
      });
    }
    
    function getProductData(key){
      return $q(function(resolve, reject){
        
        if(!key || key == '')
        {
          reject("No key");
        }
        
        $http({
           url: 'https://app.totalsynergy.com/internalkpi/totalsynergy/summary/product',
           method: 'POST',
           headers: {'Content-Type': 'application/json', 'internal-token' : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRldmVsb3BlckB0b3RhbHN5bmVyZ3kuY29tIiwiYXBwbGljYXRpb25pZCI6MTMsInVzZXJuYW1lIjoiZGV2ZWxvcGVyIiwidGVuYW50IjoiIiwiY29kZV9leHBpcmVzIjo2MzYxNzE3ODk5OTY5MTI0NDF9.nma1MQu3Uot47w3tHznFm7KXpO4Q5BngFNC48qBwCbE'}
           }).success(function(d, status, headers, config){
             resolve(d);
           })
          .error(function(data, status, headers, config){
             reject(data);
          });
      })
    }
    
    function getSynergy5Staff(key){

      return $q(function(resolve, reject){
        
        if(!key || key == '')
        {
          reject("No key");
        }
        
        $http({
          method: 'POST',
          url: 'https://app.totalsynergy.com/internalkpi/totalsynergy/summary/synergystaff',
          headers: {'Content-Type': 'application/json', 'internal-token' : key}
        }).success(function(d, status, headers, config){
           resolve(d);
         })
        .error(function(data, status, headers, config){
           reject(data);
        });
      });
    }
    
    function getSynergy5Leaderboard(key, slug){

      return $q(function(resolve, reject){
        
        if(!key || key == '')
        {
          reject("No key");
        }
        
        $http({
          method: 'POST',
          url: 'https://app.totalsynergy.com/api/v1/Organisation/' + slug + '/Timesheet/Leaderboard',
          headers: {'Content-Type': 'application/json', 'internal-token' : key}
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