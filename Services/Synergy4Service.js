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
    
    service.mapData = {};
    
    function getMapData(key){
      
      $http({
       url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/Clients',
       method: 'POST',
       headers : {'internal-token' : key}
       }).success(function(data){
         console.log("YAAA");
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
    
    return service;
  }
  
})();