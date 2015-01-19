app.controller('TenthKPI', function($scope, Service){
    $scope.callsData = [];
    $scope.count = 0;
    $scope.maxY = 200;
    var dataLength = 0;
    $scope.singularData = [];
    $scope.blankData = [];


    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      if($scope.tab != 10)
        $scope.data = $scope.blankData;
      else
        $scope.data = $scope.singularData;
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


      $scope.monthCounts = monthCounts;
      calculateMaxY();
      //Really? Somehow put into for Loop. DONT BE LAZY
      $scope.singularData = [
                {
                    "values":  [ [$scope.callsData[0].date, $scope.callsData[0].OneHour], [$scope.callsData[1].date, $scope.callsData[1].OneHour] , [$scope.callsData[2].date, $scope.callsData[2].OneHour], [$scope.callsData[3].date, $scope.callsData[3].OneHour]]
                },
                {
                    "values": [ [$scope.callsData[0].date, $scope.callsData[0].FourHours], [$scope.callsData[1].date, $scope.callsData[1].FourHours] , [$scope.callsData[2].date, $scope.callsData[2].FourHours], [$scope.callsData[3].date, $scope.callsData[3].FourHours]]
                },
                {
                    "values": [ [$scope.callsData[0].date, $scope.callsData[0].OneDay], [$scope.callsData[1].date, $scope.callsData[1].OneDay] , [$scope.callsData[2].date, $scope.callsData[2].OneDay], [$scope.callsData[3].date, $scope.callsData[3].OneDay]]
                }
            ];
      $scope.blankData = [
        {
          "values": [['0',0], ['0',0], ['0',0], ['0',0]]
        },
        {
          "values": [['0',0], ['0',0], ['0',0], ['0',0]]
        },
        {
          "values": [['0',0], ['0',0], ['0',0], ['0',0]]
        }
        ];
    }

    function calculateMaxY(){
      var maxNumber = 0;
      for(var i = 0; i < $scope.monthCounts.length; i++){
        if($scope.monthCounts[i] > maxNumber)
          maxNumber = $scope.monthCounts[i];
      }
      $scope.maxY = Math.ceil(maxNumber / 20) * 20;
    }

    $scope.colorFunction = function() {
      var colorArray = ['#78AD29', '#009EE3', '#F39200'];
	    return function(d, i) {
        	return colorArray[i];
	    };
    }

  });