app.controller('KPI20', function($scope, Service, ngAudio, $http){

    $scope.synergy5Data = "nothingYet";

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      //$(".circle1").css("width", "25%");
      //$(".circle1").css("height", "30%");
      //$(".circle1").css("margin-top", "-12.5%"); //half of height
      //weGotKey();
    });

    $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
    })

    $scope.$on('synergy5DataUpdated', function(){
      $scope.synergy5Data = Service.synergy5Data;
      sortData();
    })

    function sortData(){
      var rawNumbers= [];
      var highestNumber = 0;
      for(var i = 0; i < $scope.synergy5Data.length; i++){
        var countNumber = $scope.synergy5Data[i].Count
        rawNumbers.push(countNumber);
        if(countNumber > highestNumber)
          highestNumber = countNumber;
        console.log($scope.synergy5Data[i].Name + " " + $scope.synergy5Data[i].Count);
      }
      console.log("Highest number is : " + highestNumber);
      $scope.rawNumbers = rawNumbers;
      changeShapeCSS(rawNumbers, highestNumber);
    }

    function changeShapeCSS(numbers, highestNumber){
      var divNames = [".circle1", ".circle2", ".circle3", ".square1", ".square2", ".square3"];
      var colors = ["#72C2E4","#39B1E4", "#009FE4","#f3C17A", "#f3A73D","#f39200"];
      for(var i = 0; i < numbers.length; i++){

        var proportion = 1.8*(numbers[i]/highestNumber);
        if(proportion < 1/2)
          proportion = 1/2;
        console.log("Proportion: " + proportion + " for " + divNames[i]);
        $(divNames[i]).css("width", 50*proportion + "%");
        $(divNames[i]).css("height", 60*proportion + "%");
        //$(".shapeNumbers" + i).css("font-size", proportion*20 + "px");
        //$(".shapeNumbers" + (i + 1) ).css("margin-top", -50*proportion + "%"); //half of height
        $(".shapeNumbers" + (i + 1) ).css("font-size", 8*proportion + "vw"); //half of height
        $(divNames[i]).css("margin-top", -25*proportion + "%"); //half of height
        if(numbers[i] == 0)
          $(divNames[i]).css("background","#ffffff");
        else
          $(divNames[i]).css("background",colors[i]);
      }
    }
});
