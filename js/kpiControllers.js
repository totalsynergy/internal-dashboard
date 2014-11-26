  app.controller('SecondController', function($scope, $http, Service){

    $scope.data = "nothing yet";
    $scope.data2 = "nothing yet";
    $scope.version4 = "empty";
    $scope.versionData = {};

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $http({
      url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/ClientVersions',
      method: 'POST',
      headers : {'internal-token' : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRldmVsb3BlckB0b3RhbHN5bmVyZ3kuY29tIiwidXNlcmlkIjoiIn0.i80s02LZ6VPxXumvZNbA6uk9rTj0Lgy4nXNd2lIeSY8'}
    }).success(function(d, status, headers, config){
      $scope.data2 = d.data;
      $scope.version4 = d.data[0].Count;
      $scope.versionTest = d.data[0];
    })
    .error(function(data, status, headers, config){
      $scope.data2 = "fail";
    });


    /*$http.post('https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/ClientVersions', {msg:'internal-token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRldmVsb3BlckB0b3RhbHN5bmVyZ3kuY29tIiwidXNlcmlkIjoiIn0.i80s02LZ6VPxXumvZNbA6uk9rTj0Lgy4nXNd2lIeSY8'}).
      success(function(data, status, headers, config) {
        $scope.data2 = data;
    // this callback will be called asynchronously
    // when the response is available
      }).
      error(function(data, status, headers, config) {
        $scope.data2 = "failed";
    // called asynchronously if an error occurs
    // or server returns response with an error status.
      }); */

    var dataGiven = {
				internal_token : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRldmVsb3BlckB0b3RhbHN5bmVyZ3kuY29tIiwidXNlcmlkIjoiIn0.i80s02LZ6VPxXumvZNbA6uk9rTj0Lgy4nXNd2lIeSY8"
		};

		var dataObject = {};

		$http.post('https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/ClientVersions', dataObject)
		  .success(function(data, status, headers, config) {
			  $scope.data3 = config;
	  	})
	  	.error(function(data, status, headers, config) {
			  $scope.data3 = "failed";
		});

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