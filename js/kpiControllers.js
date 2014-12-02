app.controller('FirstKPI', function($scope, $http, Service){
    $scope.keyAvailable = false;

    $scope.pieData = [
      	  { key: "One", y: 5 },
          { key: "Two", y: 2 },
          { key: "Three", y: 9 },
          { key: "Four", y: 7 },
          { key: "Five", y: 4 },
          { key: "Six", y: 3 },
          { key: "Seven", y: 9 }
        ];

    $scope.xLoopFunction = function(){
      return function(d) {
          return d.key;
      };
    }

    $scope.yLoopFunction = function(){
      return function(d) {
          return d.y;
      };
    }


    $scope.xFunction = function(){
      return function() {
          return $scope.pieData.key;
      };
    }

    $scope.yFunction = function(){
    	return function(d){
	  	  return d.y;
    	};
    }


    $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;

    })


    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      $scope.pieData[2].y += 25;
      $scope.xFunction = $scope.xLoopFunction;
      $scope.yFunction = $scope.yLoopFunction;
    });

  });

app.controller('SecondController', function($scope, $http, Service, $interval){
    $scope.keyAvailable = false;
    $scope.data2 = "nothing yet";
    $scope.totalSynergyKey = "";
    $scope.lengthOfData = 0;
    $scope.barData = 0;
    $scope.percentage = 0;
    $scope.rawData = 0;
    $scope.testData = 0;
    $scope.percentageHolder = 50;

    $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
      weGotKey();
    })

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      if(Service.tab == 2){
        $scope.barData = $scope.rawData;
        countUpPercentage();
      }
      else{
        $scope.barData = $scope.testData;
      }
    });

    function countUpPercentage(){
      var limit = $scope.percentage;
      $scope.percentage = 0;
      $interval(function(){
        $scope.percentage++;;
      },10, limit)
      //for(i = 0; i < limit; i++){
      //  $scope.percentage += 1;
      //}
      //}
    }

    function weGotKey(){

    $http({
      url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/ClientVersions',
      method: 'POST',
      headers : {'internal-token' : $scope.totalSynergyKey}
    }).success(function(d, status, headers, config){
        $scope.data2 = d.data;
        $scope.keyAvailable = true;
        sortData(d.data);
    })
    .error(function(data, status, headers, config){
      $scope.data2 = "fail";
    });



    }

    function sortData(dataPassed){
        var dataToPass = [];
        var blankData = [];
        var percentageSum = 0;
       for(i = 0; i < dataPassed.length; i++){
         var versionObject = [dataPassed[i].Version, dataPassed[i].Count];
         var blankVersionObject = [dataPassed[i].Version, -0];
         dataToPass.push(versionObject);
         blankData.push(blankVersionObject);
         percentageSum += dataPassed[i].Count;
          }
        $scope.percentage = parseInt((dataPassed[i-2].Count + dataPassed[i-1].Count)/percentageSum*100);
        /*var data5 = [];
        var ran = ["postWorking", 69];
        data5.push(ran); */
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
        if(i == $scope.data2.length - 1)
    	    return '#F39200'
    	 else if(i == $scope.data2.length - 2)
    	    return '#004F93'
    	 else
    	  return '#78AD29'
    };
    }



  });



app.controller('ThirdController', function($scope, Service){
    $scope.totalAttendees = 0;

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $scope.$on('attendeesUpdated', function() {
      $scope.totalAttendees = Service.totalAttendees;
    });
   });



app.controller('FourthController', function($scope, Service, $http){
    $scope.NSWnACT = 0;
    $scope.QLD = 0;
    $scope.VICnTAS = 0;
    $scope.NT = 0;
    $scope.WA = 0;
    $scope.SA = 0;
    $scope.international = 0;

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $scope.$on('keysUpdated', function(){
      $scope.eventBriteKey = Service.eventBriteKey;
      $scope.totalSynergyKey = Service.totalSynergyKey;
      weGotKey();
    })

    function count(data){
      var totalAttendees = 0;
      $scope.NSWnACT = 0;
      $scope.QLD = 0;
      $scope.VICnTAS = 0;
      $scope.NT = 0;
      $scope.WA = 0;
      $scope.SA = 0;
      $scope.international = 0;
      for(i = 0; i < data.attendees.length; i++){
        if(!data.attendees[i].cancelled){
          if(data.attendees[i].profile.addresses.work.country === "AU"){
            switch(data.attendees[i].profile.addresses.work.region){
             case 'NSW':
             case 'ACT': $scope.NSWnACT += 1;
                          break;
             case 'QLD': $scope.QLD += 1;
                         break;
             case 'VIC':
             case 'TAS': $scope.VICnTAS += 1;
                         break;
             case 'NT': $scope.NT += 1;
                         break;
             case 'WA': $scope.WA += 1;
                       break;
             case 'SA': $scope.SA += 1;
                       break;
              default: ;
              }
            }
          else{$scope.international++;}
          totalAttendees++;
        }
      }
      Service.updateTotalAttendees(totalAttendees);
    }

    $scope.$on('fetchEventData', function(){
      $http.get("https://www.eventbriteapi.com/v3/events/13747447987/attendees/?token=" + $scope.eventBriteKey)
      .success(function(data){
        count(data);
        //Service.updateEventData(data);
      });
    })

    function weGotKey(){
      $http.get("https://www.eventbriteapi.com/v3/events/13747447987/attendees/?token=" + $scope.eventBriteKey)
      .success(function(data){
        count(data);
        $scope.address = data.attendees[0].profile.addresses.work.region;
        //Service.updateEventData(data);
      })
    }
  });



app.controller('FifthController', function($scope, $http, Service, $interval){

    $scope.days = 0;
    $scope.hours = 0;
    $scope.minutes = 0;
    $scope.keyTester = eventBriteKey;

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $scope.$on('keysUpdated', function(){
      $scope.eventBriteKey = Service.eventBriteKey;
      $scope.totalSynergyKey = Service.totalSynergyKey;
      weGotKey();
    })


    $scope.$on('selectedUpdated', function(){
      $scope.pages = Service.pages;
    })

    $scope.$on('eventDataUpdated', function(){
      $scope.eventData = Service.eventData;
    })

    function timerUpdate(d){
      $interval(function(){
        var currentDate = new Date().getTime();
        var secondsDate = (d - currentDate) / 1000;

        $scope.days = parseInt(secondsDate / 86400);
        var secondsLeft = secondsDate % 86400;

        $scope.hours = parseInt(secondsLeft / 3600);
        secondsLeft = secondsLeft % 3600;

        $scope.minutes = parseInt(secondsLeft / 60);
        $scope.seconds = parseInt(secondsLeft % 60);
      },1000);  //change this to minutes
    }

    function weGotKey(){
      $http.get("https://www.eventbriteapi.com/v3/events/13747447987/?token=" + $scope.eventBriteKey)
      .success(function(data){
        $scope.eventDate = new Date(data.start.utc).getTime();
        timerUpdate($scope.eventDate);
        $scope.eventData = data;
        $scope.eventBriteKey= "Key Works";
        //Service.updateEventData(data);
      })
      .error(function(){
        $scope.eventBriteKey = "Invalid Key";
      })
    }

    this.parseJsonDate = function(jsonDateString) {
       return new Date(parseInt(jsonDateString.replace('"', '')));
    }
  });