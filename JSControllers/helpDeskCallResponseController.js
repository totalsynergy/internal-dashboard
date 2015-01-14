app.controller('TenthKPI', function($scope, Service){
    $scope.callsData = [];
    $scope.count = 0;
    $scope.maxY = 200;
    $scope.blankData1 = [];
    $scope.blankData2 = [];
    $scope.blankData3 = [];
    $scope.callsDataBarData = [];
    $scope.callsDataBarData2 = [];
    $scope.callsDataBarData3 = [];
    $scope.callsDataBarDataRec = [];
    $scope.callsDataBarData2Rec = [];
    $scope.callsDataBarData3Rec = [];
    var dataLength = 0;


    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      if(Service.tab == 10){
        $scope.callsDataBarData = $scope.callsDataBarDataRec;
        $scope.callsDataBarData2 = $scope.callsDataBarData2Rec;
        $scope.callsDataBarData3 = $scope.callsDataBarData3Rec;
      }
      else if(Service.tab != 9 && Service.tab != 11){
        $scope.callsDataBarData2 = $scope.blankData2;
        $scope.callsDataBarData = $scope.blankData2;
        $scope.callsDataBarData3 = $scope.blankData3;
      }
    });

    $scope.$on('keysUpdated', function(){
      $scope.slackKey = Service.slackKey;
      //weGotKey();
    })

    $scope.yAxisTickFormatFunction = function(){
      var format = d3.format(',.0f');
      return function(d){
    	  return format(d);
      }
    }

    $scope.xAxisTickFormatFunction = function(){
    return function(d){
        return d3.time.format('%b')(new Date(d));
      }
    }

    $scope.$on('callsDataUpdated', function(){
      $scope.callsData = Service.callsData;
      $scope.test = Service.callsData;
      formatForGraph();
    })

    function formatForGraph(){
      var monthCounts = [0,0,0,0];
      var calls = $scope.callsData;
      for(var i = 0; i < calls.length; i++){
          monthCounts[i] += calls[i].OneHour;
          monthCounts[i] += calls[i].FourHours;
          monthCounts[i] += calls[i].OneDay;
      }

      $scope.monthCounts = monthCounts;
      calculateMaxY();
      //Really? Somehow put into for Loop. DONT BE LAZY
      $scope.callsDataBarDataRec = [
           {
             "key": "Series 1",
             "values": [ [$scope.callsData[0].date, $scope.callsData[0].OneHour], [$scope.callsData[1].date, $scope.callsData[1].OneHour] , [$scope.callsData[2].date, $scope.callsData[2].OneHour], [$scope.callsData[3].date, $scope.callsData[3].OneHour]]
           }];
      $scope.callsDataBarData2Rec = [
          {
             "key": "Series 2",
            "values": [ [$scope.callsData[0].date, $scope.callsData[0].FourHours + $scope.callsData[0].OneHour], [$scope.callsData[1].date, $scope.callsData[1].FourHours + $scope.callsData[1].OneHour] , [$scope.callsData[2].date, $scope.callsData[2].FourHours + $scope.callsData[2].OneHour], [$scope.callsData[3].date, $scope.callsData[3].FourHours + $scope.callsData[3].OneHour]]
           }];
      $scope.callsDataBarData3Rec = [
          {
             "key": "Series 3",
            "values": [ [$scope.callsData[0].date, monthCounts[0]], [$scope.callsData[1].date, monthCounts[1]] , [$scope.callsData[2].date, monthCounts[2]], [$scope.callsData[3].date, monthCounts[3]]]
           }];



      $scope.callsDataBarData = $scope.callsDataBarDataRec;
      $scope.callsDataBarData2 = $scope.callsDataBarData2Rec;
      $scope.callsDataBarData3 = $scope.callsDataBarData3Rec;
    }

    function calculateMaxY(){
      var maxNumber = 0;
      for(var i = 0; i < $scope.monthCounts.length; i++){
        if($scope.monthCounts[i] > maxNumber)
          maxNumber = $scope.monthCounts[i];
      }
      $scope.maxY = Math.ceil(maxNumber / 20) * 20;
    }

    $scope.colorFunction = function(){
      return function(d, i) {
    	  return '#F39200'
      };
    }

    $scope.colorFunction2 = function(){
      return function(d, i) {
        return '#009EE3'
      };
    }

    $scope.colorFunction3 = function(){
      return function(d, i) {
        return '#78AD29'
      };
    }

  });