
app.controller('KPI29', function($scope, Service, $http){

    $scope.totalSynergyKey = '';

    $scope.categories = [
        {"Name" : "1-5 People", "Percent" : 0},
        {"Name" : "6-25 People", "Percent" : 0},
        {"Name" : "26-50 People", "Percent" : 0},
        {"Name" : "50+ People", "Percent" : 0}
      ];

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });


    $scope.$on('keysUpdated', function(){
      $scope.speed = Service.speed;
      $scope.totalSynergyKey = Service.totalSynergy5Key;
      weGotKey();
    })

    function weGotKey(){
      //console.log("Before we gett staffDistribution lets check the key which is :" + $scope.totalSynergyKey);
      $http({
         url: 'https://beta.totalsynergy.com/internalkpi/totalsynergy/summary/staffSize',
         method: 'POST',
         headers: {'Content-Type': 'application/json', 'internal-token' : $scope.totalSynergyKey}
         }).success(function(d, status, headers, config){
           $scope.data = d.data;
           formatForGraph(d.data);
         })
        .error(function(data, status, headers, config){
           $scope.data = "fail";
        });
    }

    function formatForGraph(data)
    {
      var total = 0;
      for(var  i = 0 ; i < data.length; i++){
        for(var j = 0; j < $scope.categories.length; j++){
          var newString = data[i].StaffSize.replace(/\s/g, '') + " People";
          //console.log($scope.categories[j].Name + " to " + newString);
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
      //console.log("Changing color on: " + className);
      $(imageClass).css("-webkit-filter", "hue-rotate(0deg)");
      $(percentageClass).css("color", "#009EE3");
      /*-webkit-filter: hue-rotate(-113deg); */
    }

   });







