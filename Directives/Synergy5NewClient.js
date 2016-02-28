(function(){
  angular
    .module('myApp')
    .directive('synergy5NewClient', Synergy5NewClient);
    
    function Synergy5NewClient(){
      
      var directive = {
        restrict : "E",
        templateUrl : "../Views/Synergy5NewClient.html",
        controller : Controller,
        controllerAs : 'vm',
        scope : {
          tab : "=",
          keys: "="
        },
        bindToController: true
      };
      
      return directive;
    }
    
    Controller.$inject = ['$scope', 'Synergy5Service', 'Service', 'ngAudio', '$interval'];
    
    function Controller($scope, Synergy5Service, Service, ngAudio, $interval){
      var vm = this;
      vm.title = "New Client joined Synergy";
      vm.latestClient = "";
      vm.latestClientPosition = 0;
      vm.latestClientLocation = "";
      
      var sound = ngAudio.load("assets/cheering.wav");
      var confettiRunning = false;
      
      $scope.$watch("keys", function(){
        $scope.totalSynergyKey = vm.keys[4];
        getLatestClient();
      });
      
      setDataFetchTimer();
      
      function setDataFetchTimer(){
        $interval(getLatestClient, 3000000);
      }
      
      function getLatestClient(){
        
        Synergy5Service
          .getLatestClient($scope.totalSynergyKey)
          .then(function(success){
            if(success.data)
            {
              var org = success.data
              setLatest(org.Name, org.Position, org.Location);
            }
          }, function(error){
            
          });
      }
      
      function setLatest(name, position, location){
        var newPosition = position;
        
        if(vm.latestClient != "" && vm.latestClient != name)
        {
          Service.updateTab(38, function(){
             sound.play(); 
          });
        }
        
        //Run Confettti or Something
        if(vm.position != newPosition && position != 0 && position%50 == 0 && !confettiRunning)
        {
          runConfetti("synergy5NewClientCanvas");
          confettiRunning = true;
        }
        else if(vm.latestClientPosition != newPosition && position != 0)
        {
          $("#synergy5NewClientCanvas").remove();
          $("#synergy5-client-new-logo").after('<canvas id="synergy5NewClientCanvas"></canvas>');
          confettiRunning = false;
        }

        
        vm.latestClient = name;
        vm.latestClientPosition = newPosition;
        vm.latestClientLocation = location;
        
      }
      
      function getOrdinal(n) {
         var s=["th","st","nd","rd"],
             v=n%100;
         return n+(s[(v-20)%10]||s[v]||s[0]);
      }
      
      function getInt(str){
        return parseInt(str.slice(0, -2));
      }
    }
    
})();