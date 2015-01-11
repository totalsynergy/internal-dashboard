app.controller('FirstKPI', function($scope, $http, Service, $interval){
    $scope.keyAvailable = false;
    $scope.totalSynergyKey = "empty";
    $scope.cloudUptakeData = null;
    $scope.onCloud = 0;
    $scope.notOnCloud = 0;
    $scope.pieData = null;
    $scope.percentage = 0;




    $scope.$on('fetchEventData', function(){
      weGotKey();
    })

   $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
      weGotKey();
    })

    function weGotKey(){
      //debugger
       $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/CloudUptake',
         method: 'POST',
         headers : {'internal-token' : $scope.totalSynergyKey}
         }).success(function(d, status, headers, config){
           $scope.cloudUptakeData = d.data;
           sortData(d.data);
         })
        .error(function(data, status, headers, config){
           $scope.data2 = "fail";
        });
    }

    $scope.colorFunction = function() {
      var colorArray = ['#F39200', '#004F93'];
	    return function(d, i) {
    	return colorArray[i];
      };
    }

    function sortData(data){
      $scope.percentage = parseInt((data[0].Count / (data[0].Count + data[1].Count ))*100);
      var dataToPass = [];
      var dataArray = {key: "Not On Cloud", y: data[1].Count};
      dataToPass.push(dataArray);
      var dataArray2 = {key: "On Cloud", y: data[0].Count};
      dataToPass.push(dataArray2);
      cloudConversionData = dataToPass;
      $scope.pieData = dataToPass;
      $scope.originalData = dataToPass;
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


    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;

      //ngAudio.play("assets/bell.mp3");

      if(Service.tab == 1){
        $scope.pieData = $scope.originalData;
        //countUpPercentage2();
      }
      else{
        $scope.pieData = [{key: "Not On Cloud", y: 100}, {key: "On Cloud", y: 0}];
      }
    });

    /*function countUpPercentage2(){
      var limit = $scope.percentage;
      $scope.percentage = 0;
      $interval(function(){
        $scope.percentage++;
      },10, limit)
    } */
  });











  //tab = 2
app.controller('SecondKPI', function($scope, Service){
    $scope.percentage = 96.5;
    $scope.internPieData = [
      {key: "Productive Time", y: 8},
      {key: "UnProductive Time", y: 96.5}
      ];

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      if(Service.tab == 2){
        $scope.internPieData = [
          {key: "Productive Time", y: 8},
          {key: "UnProductive Time", y: 96.5}
        ];
        //countUpPercentage2();
      }
      else{
        //$scope.internPieData = [{key: "Productive Time", y: 100}, {key: "UnProductive Time", y: 0}];
        $scope.internPieData = cloudConversionData;
      }
    });

    $scope.$on('attendeesUpdated', function() {
      $scope.totalAttendees = Service.totalAttendees;
    });

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

    $scope.colorFunction = function() {
      var colorArray = ['#F39200', '#004F93'];
	    return function(d, i) {
    	return colorArray[i];
      };
    }

   });











app.controller('ThirdKPI', function($scope, $http, Service, $interval){
    $scope.keyAvailable = false;
    $scope.data2 = "nothing yet";
    $scope.totalSynergyKey = "";
    $scope.lengthOfData = 0;
    $scope.barData = 0;
    $scope.percentage = 0;
    $scope.rawData = 0;
    $scope.testData = 0;


    $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
      weGotKey();
    })

    $scope.$on('fetchEventData', function(){
      weGotKey();
    })

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      if(Service.tab == 3){
        $scope.barData = $scope.rawData;
        //countUpPercentage();
      }
      else{
        $scope.barData = $scope.testData;
      }
    });
    /*
    function countUpPercentage(){
      var limit = $scope.percentage;
      $scope.percentage = 0;
      $interval(function(){
        $scope.percentage++;;
      },10, limit)
      //for(i = 0; i < limit; i++){
      //  $scope.percentage += 1;
      //}
      //
      */


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
         var blankVersionObject = [dataPassed[i].Version, 0];
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








app.controller('FourthKPI', function($scope, Service, ngAudio){
    $scope.totalAttendees = 0;
    $scope.sound = ngAudio.load("assets/bell.mp3");

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $scope.$on('attendeesUpdated', function() {
      if($scope.totalAttendees != Service.totalAttendees && $scope.totalAttendees != 0)
        $scope.sound.play();
      $scope.totalAttendees = Service.totalAttendees;

    });
   });








app.controller('FifthKPI', function($scope, Service, $http){
    $scope.NSWnACT = 0;
    $scope.QLD = 0;
    $scope.VICnTAS = 0;
    $scope.NT = 0;
    $scope.WA = 0;
    $scope.SA = 0;
    $scope.international = 0;
    $scope.data = {};

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
      var event = { "attendees" : [] };
      $scope.getPagedData(1, event);
      //$http.get("https://www.eventbriteapi.com/v3/events/13747447987/attendees/?token=" + $scope.eventBriteKey)
      //.success(function(data){
      //    count(data);
        //Service.updateEventData(data);
      //});
    })

    $scope.getPagedData = function(page, event) {
      $http.get("https://www.eventbriteapi.com/v3/events/13747447987/attendees/?page=" + page  + "&token=" + $scope.eventBriteKey)
      .success(function(data){
        for(i = 0; i < data.attendees.length; i++){
          event.attendees.push(data.attendees[i]);
        }
        if(page < data.pagination.page_count)
        {
          $scope.getPagedData(page + 1, event);
        } else {
          count(event);
        }
        //Service.updateEventData(data);
      });
    };

    function weGotKey(){
      var event = { "attendees" : [] };
      $scope.getPagedData(1, event);
      //$http.get("https://www.eventbriteapi.com/v3/events/13747447987/attendees/?token=" + $scope.eventBriteKey)
      //.success(function(data){
      //  count(data);
      //  $scope.address = data.attendees[0].profile.addresses.work.region;
        //Service.updateEventData(data);
      //})
    }
  });










app.controller('SixthKPI', function($scope, $http, Service, $interval){

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







app.controller('SeventhKPI', function($scope, Service, $http, gravatarService, md5, $timeout){

  $scope.error = {
      message: null,
      errorFunction: null,
  };


  $scope.errorList = [];

    //BE CAREFUL BELOW
    $scope.dataLength = 20;
    $scope.count = 0;
    $scope.displayArray = [];
    $scope.arrayOfEmpties = [];

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });


    $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
      if($scope.count == 0)
      weGotKey();
      $scope.count++;
      initialiseArray();
    })

    $scope.$on('fetchEventData', function(){
      $scope.displayArray = [];
      weGotKey();
      //pickNumbers();
      //pickDecisiveNumbers();
    })

    function initialiseArray(){
      for(i = 0; i < 32; i ++){
        $scope.displayArray[i] = null;
      }
    }



    function weGotKey(){
      //debugger

       $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/staff',
         method: 'POST',
         headers : {'internal-token' : $scope.totalSynergyKey}
         }).success(function(d, status, headers, config){
           console.log(d,status,headers,config);
           //sortEmails(d.data);
           sortEmails2(d.data, d.data.length);
           $scope.data = d.data;
           $scope.count++;
           $scope.dataLength = d.data.length;
         })
        .error(function(data, status, headers, config){
           $scope.data = "fail";
        });
    }

    function sortEmails2(data, length){
      console.log(data, length);
      var counter = 0;
      $scope.arrayOfEmpties = [];
      for(i = 0; i < data.length; i++){

        var lowerCaseEmail = data[i].Email.toLowerCase();
        var hash = md5.createHash(lowerCaseEmail || '');
        loadAvatar(hash, i, data[i].Name);
        $scope.imageCounter++;
      }
    }

    function randomNumber(){
      var isPickable = false;
      var randomNum = 0;
      while(!isPickable){
        randomNum = Math.floor((Math.random() * 32));
        if(!numberIsUsed(randomNum)){
          $scope.arrayOfEmpties.push(randomNum);
          isPickable = true;
        }
      }
      return randomNum;
    }

    function numberIsUsed(number){
      if(number == 11 || number == 10 || number == 12 || number == 13 || number == 18 || number == 20 || number == 21 || number == 19)
        return true;
     if($scope.arrayOfEmpties.length == 0)
      return false;
     for(i = 0; i < $scope.arrayOfEmpties.length; i++){
       if(number == $scope.arrayOfEmpties[i])
        return true;
     }
      return false;
    }

    function loadAvatar(hash, index, email){
        var count = $scope.imageCounter;
        var url = "https://secure.gravatar.com/avatar/" +  hash + "?s=300&d=mm";
        var loadImage = function(uri) {
        var xhr = new XMLHttpRequest();
        //xhr.responseType = 'blob';
        xhr.onload = function() {
            var image  = window.URL.createObjectURL(xhr.response);
            $scope.displayArray[randomNumber()] = {photo: image, emailAddress: email};
          }
        console.log("URI Of Request for Gravatar", uri)
          xhr.onerror = requestError;
        xhr.onabort = requestError;
        xhr.open('GET', uri, true);

        xhr.send();
        }
        //if(isTrue($scope.blanks, index))
        loadImage(url);

    }

    $scope.noImage = function(image){
      if($scope.standardImage == image)
        return true;
      return false;
    }



        var requestError = function (error) {
        // The response is always empty
        // See https://xhr.spec.whatwg.org/#request-error-steps and https://fetch.spec.whatwg.org/#concept-network-error
        var errorItem = angular.copy($scope.error);
        errorItem.message = error.message;
        $scope.errorList.push(errorItem);
        console.log("Error has occured:" ,error);
        //completeRequest(callback, -1, null, null, '');
      };





  });

/*

app.controller('SeventhKPI', function($scope, Service, $http, gravatarService, md5, $timeout){

    //BE CAREFUL BELOW
    $scope.dataLength = 20;
    $scope.count = 0;
    $scope.displayArray = [];
    $scope.arrayOfEmpties = [];

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });


    $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
      if($scope.count == 0)
      weGotKey();
      $scope.count++;
      initialiseArray();
    })

    $scope.$on('fetchEventData', function(){
      $scope.displayArray = [];
      weGotKey();
      pickNumbers();
      pickDecisiveNumbers();
    })

    function initialiseArray(){
      for(i = 0; i < 32; i ++){
        $scope.displayArray[i] = null;
      }
    }



    function weGotKey(){
      //debugger

       $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/staff',
         method: 'POST',
         headers : {'internal-token' : $scope.totalSynergyKey}
         }).success(function(d, status, headers, config){
           //sortEmails(d.data);
           sortEmails2(d.data, d.data.length);
           $scope.data = d.data;
           $scope.count++;
           $scope.dataLength = d.data.length;
         })
        .error(function(data, status, headers, config){
           $scope.data = "fail";
        });
    }

    function sortEmails2(data, length){
      var counter = 0;
      $scope.arrayOfEmpties = [];
      for(i = 0; i < data.length; i++){
        var hash = md5.createHash(data[i].Email || '');
        loadAvatar(hash, i, data[i].Name);
        $scope.imageCounter++;
      }
    }

    function randomNumber(){
      var isPickable = false;
      var randomNum = 0;
      while(!isPickable){
        randomNum = Math.floor((Math.random() * 32));
        if(!numberIsUsed(randomNum)){
          $scope.arrayOfEmpties.push(randomNum);
          isPickable = true;
        }
      }
      return randomNum;
    }

    function numberIsUsed(number){
      if(number == 11 || number == 10 || number == 12 || number == 13 || number == 18 || number == 20 || number == 21 || number == 19)
        return true;
     if($scope.arrayOfEmpties.length == 0)
      return false;
     for(i = 0; i < $scope.arrayOfEmpties.length; i++){
       if(number == $scope.arrayOfEmpties[i])
        return true;
     }
      return false;
    }

    function loadAvatar(hash, index, email){
        var count = $scope.imageCounter
        var url = "https://secure.gravatar.com/avatar/" +  hash + "?s=300&d=mm";
        var loadImage = function(uri) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function() {
            var image  = window.URL.createObjectURL(xhr.response);
            $scope.displayArray[randomNumber()] = {photo: image, emailAddress: email};
          }
        xhr.open('GET', uri, true);
        xhr.send();
        }
        //if(isTrue($scope.blanks, index))
        loadImage(url);

    }

    $scope.noImage = function(image){
      if($scope.standardImage == image)
        return true;
      return false;
    }


  });

*/




  app.controller('EighthKPI', function($scope, Service, $http, gravatarService){
    $scope.stat = "";
    $scope.your_email = "adamhannigan@hotmail.com";

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
      weGotKey();
    })

    function weGotKey(){
      //debugger
       $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/Clients',
         method: 'POST',
         headers : {'internal-token' : $scope.totalSynergyKey}
         }).success(function(d, status, headers, config){
           //$scope.data = d.data
           count(d.data);
         })
        .error(function(data, status, headers, config){
           $scope.data = "fail";
        });
    }


    function count(data){
      $scope.total = 0;
      $scope.NSW = 1;
      $scope.ACT = 0;
      $scope.QLD = 0;
      $scope.VIC = 0;
      $scope.TAS = 0;
      $scope.NT = 0;
      $scope.WA = 0;
      $scope.SA = 0;
      $scope.international = 0;
      for(i = 0; i < data.length; i++){
        if(data[i].Active && !data[i].NoUpgrades && !data[i].Testing){
            switch(data[i].State){
             case 'NSW': $scope.NSW++;
                         break;
             case 'ACT': $scope.ACT++;
                         break;
             case 'QLD': $scope.QLD += 1;
                         break;
             case 'VIC': $scope.VIC++;
                         break;
             case 'TAS': $scope.TAS += 1;
                         break;
             case 'NT': $scope.NT += 1;
                         break;
             case 'WA': $scope.WA += 1;
                        break;
             case 'SA': $scope.SA += 1;
                        break;
              default: ;
              }
           if(data[i].Country != 'Australia')
            $scope.international++;
           else
            $scope.total++;
            }
        }
       }

  });






  app.controller('NinthKPI', function($scope, Service, $http, gravatarService){
    $scope.stat = "";
    $scope.your_email = "adamhannigan@hotmail.com";
    $scope.unknown = [];
    $scope.categories = [];
    $scope.barData = [];
    $scope.blankData = [];
    $scope.recoveryData = [];
    $scope.colorCounter = 0;
    $scope.currentDate = new Date();
    $scope.yearAgoData = 0;
    $scope.maxY = 130;
    $scope.testData = [
        {
            "values": [ ['one', 5],['onse', 15],['ossne', 7],['osssne', 11]]
        }];
    $scope.groupingList = [
      {"from": "Document Management", "to": "Documents & Transmittals"},
      {"from": "Document Tables", "to": "Connect"},
      {"from": "Notes", "to": "Admin + Default Menus"},
      {"from": "KPI Panels", "to": "Admin + Default Menus"},
      {"from": "Web Application", "to": "Project Accounting"},
      {"from": "Notes", "to": "Admin + Default Menus"},
      {"from": "Server \\ Database", "to": "Technical"},
      {"from": "Upgrade", "to": "Technical"},
      {"from": "Transmittals", "to": "Documents & Transmittals"},
      {"from": "MYOB Connect", "to": "Connect"},
      {"from": "Templates", "to": "Reporting"},
      {"from": "Downloads Library", "to": "Reporting"},
      {"from": "Reports", "to": "Reporting"},
      {"from": "Error Messages", "to": "Technical"},
      {"from": "Licensing", "to": "Technical"},
      {"from": "Projects", "to": "Project Accounting"},
      {"from": "Tasks + Checklists", "to": "Admin + Default Menus"},
      {"from": "Alerts \\ messages", "to": "Admin + Default Menus"},
      {"from": "Attributes", "to": "Admin + Default Menus"},
      {"from": "Installation", "to": "Technical"},
      {"from": "Quickbooks Connect", "to": "Connect"},
      {"from": "Xero Connect", "to": "Connect"},
      {"from": "MYOB Export", "to": "Connect"},
      {"from": "Time and Expense Entry", "to": "Project Accounting"},
      {"from": "Costing and Rates", "to": "Project Accounting"},
      {"from": "Implementation and Training Issue", "to": "Project Accounting"},
      {"from": "Installation", "to": "Technical"},
      {"from": "MS Office Integration", "to": "Technical"},
      {"from": "Offices", "to": "Project Accounting"},
      {"from": "New product ideas", "to": "New product ideas"},
      {"from": "Contract Expenditure", "to": "Contract Administration"}
    ];

    $scope.callsData = [];

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      if(Service.tab == 9){
        $scope.barData = $scope.recoveryData;
      }
      else if(Service.tab != 8 && Service.tab != 10){
        $scope.barData = $scope.blankData;
      }
    });

    $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
      weGotKey();
    })


    $scope.colorFunction = function(){
      return function(d, i) {
        if(d[1] > 5)
    	    return '#F39200'
    	 else
    	  return '#78AD29'
      };
    }

    $scope.valueFormatFunction = function(){
      var format = d3.format(',.0f');
      return function(d){
    	  return format(d);
      }
    }

    function weGotKey(){
      //debugger
      var currentDate = new Date();
      var currentDateMinusThreeMonths = new Date(new Date(currentDate).setMonth(currentDate.getMonth()-3));
      currentDateMinusThreeMonths.setDate(1);
       $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/helpdeskdata',
         method: 'POST',
         headers: {'Content-Type': 'application/json', 'internal-token' : $scope.totalSynergyKey},
         data: {from:currentDateMinusThreeMonths, to:currentDate}
         }).success(function(d, status, headers, config){
           $scope.data = d.data;
           $scope.rawData = d;
           newSort();
           responseClassificationSort();
         })
        .error(function(data, status, headers, config){
           $scope.data = "fail";
        });
    }

    function newSort(){
      $scope.categories = [];
      for(i=0; i < $scope.data.length; i++){
        var group = $scope.data[i].Category;
        group = findGroup(group);
        incrementCategory(group);
      }
      formatForGraph();
    }

    function responseClassificationSort(){
      $scope.callsData = [];
      for(var i =0; i < $scope.data.length; i++){
        if($scope.data[i].ResponseDate != ""){
        var month = $scope.data[i].ResponseDate;
        var slicedMonth = month.substr(0,7);
        $scope.month = slicedMonth;
        var classification = $scope.data[i].ResponseClassification;
        $scope.classification = classification;
        incrementCategoryForResponse(slicedMonth, classification);
        //var index = getIndexOfMonth(month);
        //$scope.index = index;
        //count(index,classifcation);
        }
      }
      Service.passCallsData($scope.callsData);
    }

    function incrementCategoryForResponse(month, classification){
      var exists = false;
      var object = null;
      var i = 0;
      if($scope.callsData.length != 0){
        for(i =0; i < $scope.callsData.length; i++){
          if(month == $scope.callsData[i].date){
            object = $scope.callsData[i];
            exists = true; break;
          }
        }
      }
      if(!exists){
        object = {"date" : month, "OneHour" : 0, "FourHours" : 0, "OneDay" : 0}      //MAKING ONE FOR EACH DAY - ONLY FOR EACH MONTH
        $scope.callsData.push(object);
      }
      if(classification == '1 Hour')                    //THEYRE FALLING THROUGH //because you're searching callsData not $scope.data
        object.OneHour++;
      else if(classification == '4 Hours')
        object.FourHours++;
      else
        object.OneDay++;
    }

    function getIndexOfMonth(monthName){
      for( var i = 0; i < $scope.callsData.length; i++){
        if(monthName == $scope.callsData[i].date) //something here not working
          return i;
      }
    }

    function count(index, classification){
        if(classification == '1 Hour')
          $scope.callsData[index].OneHour++;
        else if(classification == '4 hours')
          $scope.callsData[index].FourHours++;
        else
          $scope.callsData[index].OneDay++;
    }

    function formatForGraph(){
      var dataToPass = [];
      var sortedData = [];
      $scope.numberOfCalls = 0;
      for(var i = 0; i < $scope.categories.length; i++){
         var category = [$scope.categories[i].category, $scope.categories[i].count];
         dataToPass.push(category);
         $scope.numberOfCalls += $scope.categories[i].count;
      }
      dataToPass.sort(function(a,b){
        return b[1] - a[1];
      });
      var other = 0;
      for(var j = 8; j < dataToPass.length; j++){
        var element = dataToPass[j];
        other += element[1];
      }
      dataToPass.splice(11,6);
      dataToPass.push(['Other', other]);
      dataToPass.sort(function(a,b){    //Don't need to sort every function
        return b[1] - a[1];
      });
      var recoverData = angular.copy(dataToPass);
      for(var i = 0; i < recoverData.length; i++){
        recoverData[i][1] = null;
      }
      $scope.barData = [
        {
            "values": dataToPass
        }];
      $scope.recoveryData = $scope.barData;
      $scope.blankData =[
        {
            "values": recoverData
        }];
    }


    function findGroup(groupName){
      for( var i = 0; i < $scope.groupingList.length; i++){
        if(groupName == $scope.groupingList[i].from) //something here not working
          return $scope.groupingList[i].to;
      }
      return groupName;
    }

    function incrementCategory(groupName){
      var exists = false;
      if($scope.categories.length != 0){
        for(var i =0; i < $scope.categories.length; i++){
          if(groupName == $scope.categories[i].category){
            $scope.categories[i].count++;
            exists = true; break;
          }
        }
      }
      if(!exists){
        var categoryObject = {'category' : groupName, 'count' : 1};
        $scope.categories.push(categoryObject);
      }
    }

  });









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

      $scope.blankData1 = $scope.callsDataBarDataRec;
      for(var j = 0; j  < blankData1.values.length; j++){
        $scope.blankData1.values[j][1] = 0;
      }
      $scope.blankData2 = $scope.callsDataBarData2Rec;
      for(var j = 0; j  < blankData2.values.length; j++){
        $scope.blankData2.values[j][1] = 0;
      }
      $scope.blankData3 = $scope.callsDataBarData3Rec;
      for(var j = 0; j  < blankData3.values.length; j++){
        $scope.blankData3.values[j][1] = 0;
      }

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






  app.controller('EleventhKPI', function($scope, Service, $http, gravatarService){
    $scope.data = null;
    $scope.people = null;
    $scope.slackKey = '';
    $scope.imageNameAndMessage = [];


    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $scope.$on('keysUpdated', function(){
      $scope.slackKey = Service.slackKey;
      //weGotKey();
    })

  });


  app.controller('TwelthKPI', function($scope, Service, $http, gravatarService){
    $scope.data = null;
    $scope.people = null;
    $scope.slackKey = '';
    $scope.imageNameAndMessage = [];


    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $scope.$on('keysUpdated', function(){
      $scope.slackKey = Service.slackKey;
      weGotKey();
    })

    $scope.returnName = function(id){
      if($scope.people != null){
      for(i = 0; i < $scope.people.length; i++){
        if($scope.people[i].id == id)
          return $scope.people[i].real_name;
      }
      return "didnt work";
      }
    }


    function weGotKey(){
      $http.get("https://slack.com/api/channels.history?token=" + $scope.slackKey + "&channel=C02NW54S2&pretty=1")
      .success(function(data){
        $scope.data = data.messages;
        //Service.updateEventData(data);
      })
      .error(function(){
        $scope.data = "fail";
      })

      $http.get("https://slack.com/api/users.list?token=" + $scope.slackKey + "&channel=C02NW54S2&pretty=1")
      .success(function(data){
        $scope.people = data.members;
        //Service.updateEventData(data);
      })
      .error(function(){
        $scope.people = "fail";
      })
    }

    function getGravatar(email){
        var lowerCaseEmail = email.toLowerCase();
        var hash = md5.createHash(lowerCaseEmail || '');
        var url = "https://secure.gravatar.com/avatar/" +  hash + "?s=300&d=mm";
        var loadImage = function(uri) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function() {
            var image  = window.URL.createObjectURL(xhr.response);
            return image;
          }
        //xhr.open('GET', uri, true);
        //xhr.send();
        }
        //if(isTrue($scope.blanks, index))
        loadImage(url);
    }

  });



  /*
    function sortData(){

      $scope.unknown = [];
      $scope.namesArray = [];
      $scope.technical = 0;
      $scope.webApplication = 0;
      $scope.notes = 0;
      $scope.staff = 0;
      $scope.resource = 0;
      $scope.reporting = 0;
      $scope.projectTeams = 0;
      $scope.projectAccounting = 0;
      $scope.generalHelpFiles = 0;
      $scope.serverDatabase = 0;
      $scope.documents = 0;
      $scope.dataImport = 0;
      $scope.contactAdministration = 0;
      $scope.contacts = 0;
      $scope.connect = 0;
      $scope.billingInvoicing = 0;
      $scope.admin = 0;
      $scope.other = 0;
      $scope.upgrade = 0;
      $scope.transmittals = 0;
      $scope.templates = 0;
      $scope.MYOBConnect = 0;
      $scope.errorMessages = 0;
      $scope.licensing = 0;
      $scope.projects = 0;
      $scope.checkLists = 0;
      $scope.importData = 0;
      $scope.alerts = 0;
      $scope.installation = 0;
      $scope.xeroConnect = 0;
      $scope.quickbooksConnect = 0;
      $scope.timeAndExpenseEntry = 0;
      $scope.contractAdministration = 0;
      $scope.costingAndRates = 0;
      $scope.documentMangement = 0;
      $scope.MSOfficeIntegration = 0;
      $scope.offices = 0;
      $scope.documentTables = 0;
      for(i=0; i < $scope.data.length; i++){
        switch($scope.data[i].Category){
          case 'Web Application': $scope.webApplication++; break;
          case 'Notes' : $scope.notes++; break;
          case 'Billing \\ Invoicing': $scope.billingInvoicing++; break;
          case 'Server \\ Database' : $scope.serverDatabase++; break;
          case 'Contacts' : $scope.contacts++; break;
          case 'Upgrade' : $scope.upgrade++; break;
          case 'Admin + Default Menus': $scope.admin++; break;
          case 'Transmittals' : $scope.transmittals++; break;
          case 'MYOB Connect' : $scope.MYOBConnect++; break;
          case 'Templates' : $scope.templates++; break;
          case 'Reports' : $scope.reporting++; break;
          case 'Error Messages' : $scope.errorMessages++; break;
          case 'Licensing' : $scope.licensing++; break;
          case 'Projects' : $scope.projects++; break;
          case 'Tasks + Checklists' : $scope.checkLists++; break;
          case 'Data Import' : $scope.importData++; break;
          case 'General Help Files/doco' : $scope.generalHelpFiles++; break;
          case 'Resource Management': $scope.resource++; break;
          case 'Alerts \\ messages' : $scope.alerts++; break;
          case 'Staff \\ Employees' : $scope.staff++; break;
          case 'Installation' : $scope.installation++; break;
          case 'Quickbooks Connect ' : $scope.quickbooksConnect++; break;    //EXTRA SPACE AT THE END OF THIS - WATCH THIS WHILST FILTERING
          case 'Xero Connect' : $scope.xeroConnect++; break;
          case 'Time and Expense Entry' : $scope.timeAndExpenseEntry++; break;
          case 'Contract Administration' : $scope.contactAdministration++; break;
          case 'Costing and Rates' : $scope.costingAndRates++; break;
          case 'Document Management' : $scope.documentManagement++; break;
          case 'MS Office Integration' : $scope.MSOfficeIntegration++; break;
          case 'Offices' : $scope.offices++; break;
          case 'Document Tables' : $scope.documentTables++; break;
          default: $scope.unknown.push($scope.data[i]); $scope.unknown.push('works'); $scope.other++;
        }
      }
      for(i = 0; i < dataPassed.length; i++){
         var versionObject = [dataPassed[i].Version, dataPassed[i].Count];
         var blankVersionObject = [dataPassed[i].Version, 0];
         dataToPass.push(versionObject);
         blankData.push(blankVersionObject);
         percentageSum += dataPassed[i].Count;
          }
        $scope.percentage = parseInt((dataPassed[i-2].Count + dataPassed[i-1].Count)/percentageSum*100);
        /*var data5 = [];
        var ran = ["postWorking", 69];
        data5.push(ran);
        var data = [
                {
                    "values": dataToPass
                }];
        var blankData = [
                {
                    "values": blankData
                }];
    }


    /*function sortData(dataPassed){
        var dataToPass = [];
        var blankData = [];
        var percentageSum = 0;
       for(i = 0; i < dataPassed.length; i++){
         var versionObject = [dataPassed[i].Version, dataPassed[i].Count];
         var blankVersionObject = [dataPassed[i].Version, 0];
         dataToPass.push(versionObject);
         blankData.push(blankVersionObject);
         percentageSum += dataPassed[i].Count;
          }
        $scope.percentage = parseInt((dataPassed[i-2].Count + dataPassed[i-1].Count)/percentageSum*100);
        /*var data5 = [];
        var ran = ["postWorking", 69];
        data5.push(ran);
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
    }*/