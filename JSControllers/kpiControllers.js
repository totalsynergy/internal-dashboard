
//tab = 1
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
    $scope.percentage = 92;
    $scope.internPieData = [
      {key: "Productive Time", y: 8},
      {key: "UnProductive Time", y: 92}
      ];

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      if(Service.tab == 2){
        $scope.internPieData = [
          {key: "Productive Time", y: 8},
          {key: "UnProductive Time", y: 92}
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
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/staff',
         method: 'POST',
         headers : {'internal-token' : $scope.totalSynergyKey}
         }).success(function(d, status, headers, config){
           $scope.data = d.data[0].Email;
         })
        .error(function(data, status, headers, config){
           $scope.data = "fail";
        });
    }

  });






  app.controller('TenthKPI', function($scope, Service, $http, gravatarService){
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

      $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/Clients',
         method: 'POST',
         headers : {'internal-token' : $scope.totalSynergyKey}
         }).success(function(d, status, headers, config){
           //$scope.data = d.data
           $scope.data = d.data[0];
         })
        .error(function(data, status, headers, config){
           $scope.data = "fail";
        });

    }
  });