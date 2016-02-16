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
          tab : "="
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
      
      var sound = ngAudio.load("assets/cheering.wav");
      var confettiRunning = false;
      
      $scope.$watch("keys", getLatestClient);
      
      $scope.$watch("tab", function(){console.log($scope.tab)});
      
      setDataFetchTimer();
      
      function setDataFetchTimer(){
        $interval(getLatestClient, 5000);
      }
      
      function getLatestClient(){
        
        Synergy5Service
          .getLatestClient()
          .then(function(success){
            console.log(success);
          }, function(error){
            setLatest(error.Name, error.Position);
          });
      }
      
      function setLatest(name, position){
        var newPosition = getOrdinal(position);
        
        if(vm.latestClientPosition != 0 && position > getInt(vm.latestClientPosition))
        {
          console.log("Looks like we have to try and change page");
          Service.updateTab(38, function(){
            console.log("Run callback we on")
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