app.directive("synergy4DesktopVersion", function(){
  

  var controller = function($scope, Synergy4Service){
      $scope.barData = 0;
      $scope.percentage = 0;
      $scope.rawData = 0;
      $scope.testData = 0;
  
  
      $scope.$watch('keys', function(){
        $scope.totalSynergyKey = $scope.keys[0];
        getData();
      });
  
      $scope.$on('shortDataFetch', function(){
        getData();
      });
  
      $scope.$watch('tab', function(){
        
        if($scope.tab == 16){
          $scope.barData = $scope.rawData;
        }
        else{
          $scope.barData = $scope.testData;
        }
      });
  
      function getData(){
        
        Synergy4Service.getDesktopVersionsData($scope.totalSynergyKey).then(function(success){
          $scope.originalData = success.data;
          sortData(success.data);
        })
        
      }
  
      function sortData(dataPassed){
          var dataToPass = [];
          var blankData = [];
          var data = [];
          var percentageSum = 0;
         if(dataPassed && dataPassed != null && dataPassed.length >= 3){
           
           for(i = 0; i < dataPassed.length; i++){
             
             var versionObject = [dataPassed[i].Version, dataPassed[i].Count];
             var blankVersionObject = [dataPassed[i].Version, 0];
             
             dataToPass.push(versionObject);
             blankData.push(blankVersionObject);
             
             percentageSum += dataPassed[i].Count;
            }
            
            $scope.percentage = parseInt((dataPassed[i-2].Count + dataPassed[i-1].Count)/percentageSum*100);
         }
  
          var data = [
                  {
                      "values": dataToPass
                  }];
          var blankData = [
                  {
                      "values": blankData
                  }];
  
           $scope.barData = data;
           $scope.rawData = data;
           $scope.testData = blankData;
      }
  
      $scope.colorFunction = function(){
        return function(d, i) {
          if(i == $scope.originalData.length - 1)
      	    return '#F39200'
      	 else if(i == $scope.originalData.length - 2)
      	    return '#004F93'
      	 else
      	  return '#78AD29'
      };
    }
  };
  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/Synergy4DesktopVersion.html',
    controller: controller,
    scope : {
      tab : "=tab",
      keys : "=keys"
    }
  }
  
});
