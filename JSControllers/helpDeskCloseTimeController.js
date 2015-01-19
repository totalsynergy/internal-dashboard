app.controller('ThirteenthKPI', function($scope, Service, ngAudio){
    $scope.totalAttendees = 0;
    $scope.sound = ngAudio.load("assets/bell.mp3");
    $scope.count = 0;
    $scope.monthData = [];
    $scope.monthsUsed = [];
    $scope.closedCallerData = [
                {
                    "values": [ [ 1025409600000 , 0] , [ 1028088000000 , 6.3382185140371] , [ 1030766400000 , 5.9507873460847] , [ 1033358400000 , 4.569146943813] ]
                },
                {
                    "values": [ [ 1025409600000 , 3] , [ 1028088000000 , 12] , [ 1030766400000 , 4] , [ 1033358400000 , 0] ]
               },
                {
                    "values": [ [ 1025409600000 , 7] , [ 1028088000000 , 8.3382185140371] , [ 1030766400000 , 8.9507873460847] , [ 1033358400000 , 11.569146943813] ]
                }
            ];

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      if($scope.tab != 13)
        $scope.data = $scope.blankData;
      else
        $scope.data = $scope.chartData;
    });

     $scope.$on('callsDataUpdated', function(){
      $scope.progressData = Service.progressData;
      $scope.show = $scope.progressData[$scope.progressData.length - 2];
      initiateMonths();
      formatForGraph();
      putIntoGraph();
    })

    $scope.xAxisTickFormatFunction = function(){
    return function(d){
        return d3.time.format('%b')(new Date(d));
      }
    }

    function putIntoGraph(){
      var chartData = [
                {
                    "values": [ [$scope.monthData[3].CompleteDate, $scope.monthData[3].OneHour] , [$scope.monthData[2].CompleteDate, $scope.monthData[2].OneHour] , [$scope.monthData[1].CompleteDate, $scope.monthData[1].OneHour] , [$scope.monthData[0].CompleteDate, $scope.monthData[0].OneHour] ]
                },
                {
                    "values": [ [$scope.monthData[3].CompleteDate, $scope.monthData[3].OneDay] , [$scope.monthData[2].CompleteDate, $scope.monthData[2].OneDay] , [$scope.monthData[1].CompleteDate, $scope.monthData[1].OneDay] , [$scope.monthData[0].CompleteDate, $scope.monthData[0].OneDay] ]
                },
                {
                    "values": [ [$scope.monthData[3].CompleteDate, $scope.monthData[3].MoreThanThreeDays] , [$scope.monthData[2].CompleteDate, $scope.monthData[2].MoreThanThreeDays] , [$scope.monthData[1].CompleteDate, $scope.monthData[1].MoreThanThreeDays] , [$scope.monthData[0].CompleteDate, $scope.monthData[0].MoreThanThreeDays] ]
                },
            ];
        //var object = { "values" : [ [$scope.monthData[i].CompleteDate, $scope.monthData[i].OneHour], [$scope.monthData[i].CompleteDate, $scope.monthData[i].OneDay], [$scope.monthData[i].CompleteDate, $scope.monthData[i].MoreThanThreeDays] ];
        //var object = [{
                //    "values": [ [$scope.monthData[i].CompleteDate, $scope.monthData[i].OneHour], [$scope.monthData[i].CompleteDate, $scope.monthData[i].OneDay], [$scope.monthData[i].CompleteDate, $scope.monthData[i].MoreThanThreeDays] ]
                //};
        //chartData.push(object);

      $scope.chartData = chartData;
      $scope.blankData = [
        {
                    "values": [ [$scope.monthData[3].CompleteDate, 0] , [$scope.monthData[2].CompleteDate, 0] , [$scope.monthData[1].CompleteDate, 0] , [$scope.monthData[0].CompleteDate, 0] ]
                },
                {
                    "values": [ [$scope.monthData[3].CompleteDate, 0] , [$scope.monthData[2].CompleteDate, 0] , [$scope.monthData[1].CompleteDate, 0] , [$scope.monthData[0].CompleteDate, 0] ]
                },
                {
                    "values": [ [$scope.monthData[3].CompleteDate, 0] , [$scope.monthData[2].CompleteDate, 0] , [$scope.monthData[1].CompleteDate, 0] , [$scope.monthData[0].CompleteDate, 0] ]
                },
        ];
    }


    $scope.colorFunction = function() {
      var colorArray = ['#78AD29', '#009EE3', '#F39200'];
	    return function(d, i) {
        	return colorArray[i];
	    };
    }

    function initiateMonths(){
      $scope.monthData = [];
      for(var i = 0; i < 4; i++){
        var monthDate = new Date();
        var currentDateMinusMonths = new Date(new Date(monthDate).setMonth(monthDate.getMonth()-i));
        var modifiedDate = currentDateMinusMonths.getMonth();
        modifiedDate++;
        modifiedDate.toString();
        //if(modifiedDate.length == 1)
        //  modifiedDate = '0' + modifiedDate;
        var data = {"month": modifiedDate, "OneHour": 0, "OneDay": 0, "MoreThanThreeDays": 0, "CompleteDate" : currentDateMinusMonths};
        $scope.monthData.push(data);
      }
    }

    function formatForGraph(){
      for(var i = 0; i < $scope.progressData.length; i++){
        var stringMonth = $scope.progressData[i].OpenDate;
        var substring = stringMonth.substr(5,1);
        if(substring == '1')
          slicedMonth = stringMonth.substr(5,2);
        else
          slicedMonth = stringMonth.substr(6,1);
        //$scope.monthData.push(slicedMonth);
        incrementMonth(slicedMonth, $scope.progressData[i].ClosingClassification);
      }
    }


    function incrementMonth(month, classification){
      for(var i = 0; i < $scope.monthData.length; i++){
        if(month == $scope.monthData[i].month){
          if(classification == '1 Hour')
            $scope.monthData[i].OneHour++;
          else if(classification == '1 Day')
            $scope.monthData[i].OneDay++;
          else
            $scope.monthData[i].MoreThanThreeDays++;
        }
      }
    }


});