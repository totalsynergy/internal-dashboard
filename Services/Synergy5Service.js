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
          url: 'http://localhost:5000/internalkpi/middleofalphabet/summary/newclient?internal-token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFkYW0uaGFubmlnYW5AdG90YWxzeW5lcmd5LmNvbSIsImFwcGxpY2F0aW9uaWQiOjAsInVzZXJuYW1lIjoiYWRhbWhhbm5pZ2FuIiwidGVuYW50IjoiIiwiY29kZV9leHBpcmVzIjo2MzYyMzQwMzY5NDkwNjcyMzF9.Ao_BiSkOkXr7p7gwBY-Zg3dVByUt3PtU81pIxw3ITIw'
        })
        .then(function(success){
          resolve(success);
        }, function(error){
          reject(error);
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
        resolve(
          {"data": 
            {"data" : [ {"Name" : "Adam hannigan", "Email" : "adam.hannigan@totalsynergy.com"} ]
            }
          }
        );
        /*$http({
          method: 'POST',
          url: 'http://localhost:5000/internalkpi/middleofalphabet/summary/synergystaff?internal-token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFkYW0uaGFubmlnYW5AdG90YWxzeW5lcmd5LmNvbSIsImFwcGxpY2F0aW9uaWQiOjAsInVzZXJuYW1lIjoiYWRhbWhhbm5pZ2FuIiwidGVuYW50IjoiIiwiY29kZV9leHBpcmVzIjo2MzYyMzQwMzY5NDkwNjcyMzF9.Ao_BiSkOkXr7p7gwBY-Zg3dVByUt3PtU81pIxw3ITIw'
        })
        .then(function(success){
          resolve(success);
        }, function(error){
          reject(error);
        });*/
      });
    }
    return service;
  }
  
})();