app.directive("synergy5Industries", function(){
  

  var controller = function($scope, Synergy5Service){

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
      
      Synergy5Service.getIndustryData($scope.totalSynergy5Key).then(function(success){
          $scope.data = success.data;
          sort(success.data);
          fillSubscribers();
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
