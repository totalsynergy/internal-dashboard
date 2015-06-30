app.controller('KPI6', function($scope, Service, $http, gravatarService){
    $scope.stat = "";
    $scope.your_email = "adamhannigan@hotmail.com";
    $scope.unknown = [];
    $scope.count = 0;
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
      if(Service.tab == 6){
        $scope.barData = $scope.recoveryData;
      }
      else if(Service.tab != 7 && Service.tab != 5){
        $scope.barData = $scope.blankData;
      }
    });

    $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
      if($scope.count == 0){
        weGotKey();
        $scope.count++;
      }
    })

    $scope.$on('fetchCallsData', function(){
      if($scope.count > 0)
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
      
      if($scope.data && $scope.data != null){
        for(i=0; i < $scope.data.length; i++){
          var group = $scope.data[i].Category;
          group = findGroup(group);
          incrementCategory(group);
        }
        formatForGraph();
      }
    }

    function responseClassificationSort(){
      $scope.callsData = [];
      
      if($scope.data && $scope.data != null){
        
        for(var i =0; i < $scope.data.length; i++){
          
          if($scope.data[i].ResponseDate != ""){
            
            var month = $scope.data[i].ResponseDate;
            var slicedMonth = month.substr(0,7);
            
            $scope.month = slicedMonth;
            
            var classification = $scope.data[i].ResponseClassification;
            $scope.classification = classification;
            
            incrementCategoryForResponse(slicedMonth, classification);
          }
          
        }
      }
      Service.passCallsData($scope.callsData, $scope.data);
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