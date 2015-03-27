app.controller('KPI20', function($scope, Service, ngAudio, $http){

    $scope.synergy5Data = "nothingYet";

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
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
      }
      $scope.rawNumbers = rawNumbers;
      changeShapeCSS(rawNumbers, highestNumber);
    }

    function changeShapeCSS(numbers, highestNumber){
      var divNames = [".circle1", ".circle2", ".circle3", ".square1", ".square2", ".square3"];
      var colors = ["#72C2E4","#39B1E4", "#009FE4","#f3C17A", "#f3A73D","#f39200"];
      var shapeNumberNames = [".shapeNumbers1", ".shapeNumbers2", ".shapeNumbers3", ".shapeNumbers4", ".shapeNumbers5", ".shapeNumbers6"];
      for(var i = 0; i < numbers.length; i++){

        var proportion = 1.8*(numbers[i]/highestNumber);
        if(proportion < 1/2)
          proportion = 1/2;
        $(divNames[i]).css("width", 50*proportion + "%");
        $(divNames[i]).css("height", 60*proportion + "%");
        $(divNames[i]).css("width", 50*proportion + "%");
        //$(".shapeNumbers" + (i + 1) ).css("margin-top", -50*proportion + "%"); //half of height
        $(shapeNumberNames[i]).css({"font-size": 5*proportion + "vw"}); //half of height
        $(divNames[i]).css("margin-top", -25*proportion + "%"); //half of height
        if(numbers[i] == 0)
          $(divNames[i]).css("background","#ffffff");
        else
          $(divNames[i]).css("background",colors[i]);
      }
    }
});
