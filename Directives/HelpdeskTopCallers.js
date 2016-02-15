app.directive("helpdeskTopCallers", function(){


  var controller = function($scope, Service, ngAudio){
    $scope.count = 0;
    $scope.callerStats = [];
    $scope.barData = [];
    $scope.even = 0;

    $scope.$watch('tab', function(){
      
      if($scope.tab != 9)
        $scope.data = $scope.blankData;
      else
        $scope.data = $scope.barData;
    });

     $scope.$on('callsDataUpdated', function(){
      $scope.progressData = Service.progressData;
      sortData();
    })

    function sortData(){
      $scope.barData = [];
      $scope.callerStats = [];
      
      if($scope.progressData && $scope.progressData != null){
        for(var i = 0; i < $scope.progressData.length; i++){
          feedThrough($scope.progressData[i]);
        }
        $scope.callerStats.sort(function(a,b) {
          return b.Count - a.Count;
        });
        formatForGraph();
      }
    }

    function feedThrough(dataInstance){
      if($scope.callerStats.length == 0){
        var caller = {"Name" : dataInstance.ClientName, "Count" : 0};
        $scope.callerStats.push(caller);
      }
      if(!alreadyExists(dataInstance.ClientName)){
        var caller = {"Name" : dataInstance.ClientName, "Count" : 0};
        $scope.callerStats.push(caller);
      }

    }

    function alreadyExists(name){
      for(var i = 0; i < $scope.callerStats.length; i++){
        if(name == $scope.callerStats[i].Name){
          $scope.callerStats[i].Count++;
          return true;
        }
      }
      return false;
    }

    function formatForGraph(){
      var dataToPass = [];
      var blankDataToPass = [];
      var topTen = 0;

      for(var i = 0; i < 10; i++){
         var name = $scope.callerStats[i].Name;
         var newName = name;
         if(name.length > 30){
           newName = name.substr(0,20);
           newName += "...";
         }
         var category = [newName, $scope.callerStats[i].Count];
         dataToPass.push(category);
         blankDataToPass.push([newName, 0]);
         topTen += $scope.callerStats[i].Count
      }

      $scope.percentage = Math.floor(topTen/$scope.progressData.length*100);

      $scope.barData = [
        {
            "values": dataToPass
        }];

      $scope.blankData = [
        {
            "values": blankDataToPass
        }];
    }

    $scope.colorFunction = function(){
      $scope.even++;
      return function(d, i) {
        if($scope.even%2 == 0)
    	    return '#F39200'
    	 else
    	  return '#78AD29'
      };
    }

    $scope.valueFormatFunction = function(){
      var format = d3.format(',.0f');
      return function(d){
    	  return format(d);
      }
    }

  };

  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/HelpDeskTopCallers.html',
    controller: controller,
    scope: {
      tab : "=tab"
    }
  }
  
});
