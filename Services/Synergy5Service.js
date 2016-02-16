(function(){
  angular
    .module('myApp')
    .factory('Synergy5Service', Service);
    
  Service.$inject = ['$q', '$http'];
  function Service($q, $http){
    
    var service = {};
    service.getLatestClient = getLatestClient;
    service.getCountryData = getCountryData;
    service.getIndustryData = getIndustryData;
    service.getStaffData = getStaffData;
    service.getProductData = getProductData;
    
    function getLatestClient(key){
      
      var clients = ["InternsRUs", "Ned Sneebly", "Footy Heads Incorporated"];
      
      return $q(function (resolve, reject){
        
        console.log("Inside q");
        
        $http({
          method: 'GET',
          url: '/Synergy5NewClient' + key
        })
        .then(function(success){
          resolve(success);
        }, function(error){
          var randomClient = clients[Math.floor(Math.random() * clients.length)];
          var randomNumber = Math.floor(Math.random() * 200);
          console.log("Random is: " + randomClient);
          reject({ "Name" : randomClient, "Position" : randomNumber });
        });
        
      });
      
    }
    
    function getCountryData(key){
      
      return $q(function(resolve, reject){
        
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
        $http({
           url: 'https://app.totalsynergy.com/internalkpi/totalsynergy/summary/product',
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
    return service;
  }
  
})();