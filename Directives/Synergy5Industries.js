app.directive("synergy5Industries", function(){
  

  var controller = function($scope, Service, ngAudio, $http){

     $scope.subscribers = [
        {"Name" : "General", "Percent" : 0},
        {"Name" : "Environmental", "Percent" : 0},
        {"Name" : "Engineer", "Percent" : 0},
        {"Name" : "Construction", "Percent" : 0},
        {"Name" : "Architect", "Percent" : 0},
        {"Name" : "Urban", "Percent" : 0},
        {"Name" : "Project Manager", "Percent" : 0},
        {"Name" : "Other", "Percent" : 0}
    ];

    $scope.$watch('keys', function(){
      $scope.totalSynergy5Key = $scope.keys[4];
      console.log($scope.keys);
      getIndustryData();
    })


    $scope.$on('longDataFetch', function(){
      getIndustryData();
    })

    function fillSubscribers(){
      for(var i = 0; i < $scope.subscribers.length; i++){
        $('.fillingDiv' + i).css('height', $scope.subscribers[i].Percent + '%');
      }
    }

    function getIndustryData(){
      console.log("Keys is: " + $scope.totalSynergy5Key);
      $http({
         url: 'https://app.totalsynergy.com/internalkpi/totalsynergy/summary/industries',
         method: 'POST',
         headers: {'Content-Type': 'application/json', 'internal-token' : $scope.totalSynergy5Key}
         }).success(function(d, status, headers, config){
           $scope.data = d.data;
           sort(d.data);
           fillSubscribers();
         })
        .error(function(data, status, headers, config){
          console.log(JSON.stringify(data));
           $scope.data = "fail";
        });
    }

    function sort(data){
      var total = 0;

      for(var j = 0; j < data.length; j++){
        total += data[j].Count;
      }
      
      for(var h = 0; h < data.length; h++){
        
        var matched = false;
        
        for(var i = 0; i  < $scope.subscribers.length; i++){
          
          if(data[h].Name == $scope.subscribers[i].Name)
          {
            $scope.subscribers[i].Percent = Math.round( data[h].Count/total * 100 * 10) / 10 // Math.floor((data[h].Count/total)*100);
            matched = true;
            break;
          }
        }
        
        if(!matched)
        {
          $scope.subscribers[7].Percent = Math.round( data[h].Count/total * 100 * 10) / 10
        }
      }
    }



  };
  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/Synergy5Industries.html',
    controller: controller,
    scope : {
      tab : "=tab",
      keys : "=keys"
    }
  }
  
});
