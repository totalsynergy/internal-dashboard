(function(){
  angular
    .module('myApp')
    .factory('HelpdeskService', service);
  
  service.$inject = ['$http', '$rootScope', '$q'];
  
  function service($http, $rootScope, $q){
    var service = {};
    
    service.getCallCategoryData = getCallCategoryData;
    service.passCallsData = passCallsData;
    
    function getCallCategoryData(key, fromDate, toDate){

       return $q(function(resolve, reject){
         $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/helpdeskdata',
         method: 'POST',
         headers: {'Content-Type': 'application/json', 'internal-token' : key},
         data: {from: fromDate, to: toDate}
         }).success(function(d, status, headers, config){
           resolve(d);
         })
        .error(function(data, status, headers, config){
           reject(data);
        });
       })
    }
    
        //Help Desk data - passing from one controller to the other
     function passCallsData(callsData, progressData){
      this.callsData = callsData;
      this.progressData = progressData;
      $rootScope.$broadcast('callsDataUpdated');
    }
    
    return service;
  }
  
})();