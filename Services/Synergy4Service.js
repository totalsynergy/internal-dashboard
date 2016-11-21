(function(){
  angular
    .module('myApp')
    .factory('Synergy4Service', service);
  
  service.$inject = ['$http', '$rootScope', '$q'];
  
  function service($http, $rootScope, $q){
    var service = {};
    service.getMapData = getMapData;
    service.getCloudData = getCloudData;
    service.getDesktopVersionsData = getDesktopData;
    service.getSynergyStaff = getSynergyStaff;
    service.getClientRanks = getClientRanks;
    
    service.mapData = {};
    service.synergyStaff = {};
    service.clientRanks = [];
    
    function getMapData(key){
      
      $http({
       url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/Clients',
       method: 'POST',
       headers : {'internal-token' : key}
       }).success(function(data){
         service.mapData = data;
         $rootScope.$broadcast('synergy4MapData');
       })
      .error(function(data){
         console.log("Could not get synergy 4 data");
      });

    };
    
    function getCloudData(key){
      return $q(function(resolve, reject){
         $http({
           url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/CloudUptake',
           method: 'POST',
           headers : {'internal-token' :key}
           })
           .success(function(d, status, headers, config){
             resolve(d);
           })
          .error(function(data, status, headers, config){
             reject(d);
          });
      })
    }
    
    function getDesktopData(key){
      return $q(function(resolve, reject){
        $http({
          url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/ClientVersions',
          method: 'POST',
          headers : {'internal-token' : key}
        }).success(function(d, status, headers, config){
            resolve(d);
        })
        .error(function(data, status, headers, config){
            reject(data);
        });
      })
    }
    
    function getSynergyStaff(key){
      return $q(function(resolve, reject){
        $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/staff',
         method: 'POST',
         headers : {'internal-token' : key}
         }).success(function(d, status, headers, config){
           resolve(d);
         })
        .error(function(data, status, headers, config){
           reject(data);
        });
      })
    }
    
    function getClientRanks(key){
        $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/ClientRanks',
         method: 'POST',
         headers : {'internal-token' : key}
         }).success(function(d, status, headers, config){
           
           var data = d.data;

           if(data && data != null)
           {
            for(var i = 0; i < data.length; i++)
            {
              var category = data[i].ClientRanking;
              var clientName = data[i].LicenseName;
              addNameToCategory(category, clientName);
            }
           }

           $rootScope.$broadcast('abc123Updated');
         })
        .error(function(data, status, headers, config){
           console.log(data);
        });
    }
    
    function addNameToCategory(category, clientName){
      for(var i = 0; i < service.clientRanks.length; i++){
        if(category == service.clientRanks[i].CategoryName){
          service.clientRanks[i].Clients.push(clientName);
          return;
        }
      }
      var emptyArray = [clientName];
      var jsonCategoryObject = {"CategoryName" : category, "Clients": emptyArray};
      service.clientRanks.push(jsonCategoryObject);
    }

    
    
    
    return service;
  }
  
})();