app.directive("synergy5Staff", function(){
  

  var controller = function($scope, Synergy5Service){

    $scope.categories = [
        {"Name" : "1-5 People", "Percent" : 0},
        {"Name" : "6-25 People", "Percent" : 0},
        {"Name" : "26-50 People", "Percent" : 0},
        {"Name" : "50+ People", "Percent" : 0}
      ];


    $scope.$watch('keys', function(){
      $scope.totalSynergyKey = $scope.keys[4];
      getStaffData();
    })
    
     $scope.$on('longDataFetch', function(){
        $scope.totalSynergy5Key = Service.totalSynergy5Key;
        getStaffData();
      })

    function getStaffData(){
      
      Synergy5Service.getStaffData($scope.totalSynergyKey).then(function(success){
        $scope.data = success.data;
        formatForGraph(success.data);
      });
      
    }

    function formatForGraph(data)
    {
      var total = 0;
      for(var  i = 0 ; i < data.length; i++){
        for(var j = 0; j < $scope.categories.length; j++){
          var newString = data[i].StaffSize.replace(/\s/g, '') + " People";
          if($scope.categories[j].Name == newString){
            $scope.categories[j].Percent = data[i].Count;
            total += data[i].Count;
            break;
          }
        }
      }
      turnIntoPercentage(total);
      colorChange();
    }

    function turnIntoPercentage(total){
      for(var i = 0; i < $scope.categories.length; i++){
        var percentage = $scope.categories[i].Percent/total*100;
        $scope.categories[i].Percent = Math.round(percentage);
      }
    }

    function colorChange(){
      var maxNumber = 0;
      var highestCategory = 0;
      for(var i = 0; i < $scope.categories.length; i++){
        if($scope.categories[i].Percent > maxNumber){
          maxNumber = $scope.categories[i].Percent;
          highestCategory = i;
        }
      }
      var percentageClass = ".staffDistributionPercentage" + highestCategory;
      var imageClass = ".staffSize" + highestCategory;

      $(imageClass).css("-webkit-filter", "hue-rotate(0deg)");
      $(percentageClass).css("color", "#009EE3");
      /*-webkit-filter: hue-rotate(-113deg); */
    }

   };
  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/Synergy5Staff.html',
    controller: controller,
    scope : {
      tab : "=tab",
      keys : "=keys"
    }
  }
  
});
