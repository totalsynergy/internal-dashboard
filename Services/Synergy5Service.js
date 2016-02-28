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
    service.getSynergyStaff = getSynergy5Staff;
    
    function getLatestClient(key){
      
      return $q(function (resolve, reject){
        
        $http({
          method: 'POST',
          url: 'https://app.totalsynergy.com/internalkpi/totalsynergy/summary/newclient',
          headers: {'Content-Type': 'application/json', 'internal-token' : key}
        }).success(function(d, status, headers, config){
          console.log(JSON.stringify(d));
           resolve(d);
         })
        .error(function(data, status, headers, config){
           reject(data);
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
    
    function getSynergy5Staff(key){
      return $q(function(resolve, reject){
        $http({
          method: 'POST',
          url: 'https://app.totalsynergy.com/internalkpi/totalsynergy/summary/synergystaff',
          headers: {'Content-Type': 'application/json', 'internal-token' : key}
        }).success(function(d, status, headers, config){
            console.log(JSON.stringify(d));
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