app.directive("whosOut", function(){


  var controller = function($scope, BambooHRService, Service){
  
      var employees = [];
      
      $scope.whosOut = []; // {dateDisplay, employees}
      $scope.bambooKey = "";
      
      $scope.$on('gravatarsUpdated', function(){
        getEmployees();
      });
      
      $scope.$watch('keys', function(){
        $scope.bambooKey = $scope.keys[8];

        BambooHRService.updateKey($scope.bambooKey);
      })
      
      function getEmployees(){
        BambooHRService.getEmployees(null).then(function success(data){

          employees = [];
          
          data = data.employees;
          
          for(var i = 0; i < data.length; i++)
          {
            var employeeObject = { "Name" : data[i].displayName, "Email" : data[i].workEmail};
            employees.push(employeeObject);
          }
          
          getTimeOff();
        });
      }
      
      function getTimeOff(){
        
        var today = new Date();
        var dateToFetchFrom = today.toISOString();
        
        BambooHRService.getTimeOff(null, dateToFetchFrom).then(function success(data){
          
          var sortedTimeOff = [];
          
          $scope.whosOut = [];
          
          for(var i = 0; i < data.length; i++)
          {
            
            //for every date they are away for add entries
            var dateAway = Date.parse(data[i].start);
            dateAway = new Date(dateAway);
            var endDate = Date.parse(data[i].end);
            endDate = new Date(endDate);
            
            while(dateAway <= endDate)
            {
              var dateDisplay = getDateDisplay(dateAway.toISOString());
              var existingPosition = dateGroupingPosition(dateDisplay);
              
              var employeeObject = {
                    "Name": data[i].name,
                    "Email" : getEmployeeEmail(data[i].name)
                  };
                  
              if(existingPosition != -1)
              {
                //Make sure doesnt already exist
                var employeesInGroup = $scope.whosOut[existingPosition].Employees;
                
                var alreadyExists = false;
                for(var z =0; z < employeesInGroup.length; z++)
                {
                  if(employeesInGroup[z].Name == employeeObject.Name)
                  {
                    alreadyExists = true;
                    break;
                  }
                }
                
                if(!alreadyExists)
                {
                  $scope.whosOut[existingPosition].Employees.push(employeeObject);
                }
                
              }
              else
              {
                //Make new ojbect
                var timeOffDateGrouping = {
                  "Date" : dateAway.toISOString(),
                  "DateDisplay" : dateDisplay,
                  "Employees" : [employeeObject]
                };
                
                $scope.whosOut.push(timeOffDateGrouping);
              }
              
              dateAway.setDate(dateAway.getDate() + 1);
              
            }
            
          }
          
          getImages();


        });
      }
      
      function getEmployeeEmail(name){
        for(var i = 0; i < employees.length; i++)
        {
          if(employees[i].Name == name)
          {
            return employees[i].Email;
          }
        }
      }
      
      function getDateDisplay(isoDate){
        
        var date = Date.parse(isoDate);
        date = new Date(date);
        var current = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(current.getDate() + 1);
        
        //Person is currently on leave
        if(date <= current)
        {
          return "Today";
        }
        else if(date <= tomorrow)
        {
          return "Tomorrow";
        }
        else
        {
          return dayOfWeekAsString(date.getDay()) + ", " + date.getDate() + " " + monthAsString(date.getMonth());
        }

      }
      
      function dayOfWeekAsString(dayIndex) {
        return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dayIndex];
      } 
      
      function monthAsString(monthIndex){
        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[monthIndex];
      }
      
      function dateGroupingPosition(date){
        for(var i = 0; i < $scope.whosOut.length; i++)
        {

          if($scope.whosOut[i].DateDisplay == date)
          {
            return i;
          }
        }
        
        return -1;
      }
      
      
      //SORTING IMAGES BELOW
    function getImageSource(employee){
      
      for(var i = 0; i < Service.images.length; i++){
        if(employee.Email == Service.images[i].Name){
          return Service.images[i].Image;
        }
      }
      
      //fallback to match by name
      for(var i = 0; i < Service.images.length; i++){
        if(employee.Name == Service.images[i].Name){
          return Service.images[i].Image;
        }
      }
    }
    
    //ORGANISING IMAGES FOR LEADERBOARD
    function getImages(){
      for(var j = 0 ; j < $scope.whosOut.length; j++){
        
        for(var i = 0; i < $scope.whosOut[j].Employees.length; i++)
        {
            
            var imageSource = getImageSource($scope.whosOut[j].Employees[i]);
            $scope.whosOut[j].Employees[i].Image = imageSource;
        }
        
        
      }
      
      pinGravatars();
    }
    
    function pinGravatars(){
      
      for(var j = 0 ; j < $scope.whosOut.length; j++){
        
        var dateRow = $("#whos-out-" + j);
        dateRow.empty();
        dateRow.prepend('<h2>' + $scope.whosOut[j].DateDisplay + '</h2>');
        
        for(var i = 0; i < $scope.whosOut[j].Employees.length; i++)
        {
            var container = document.createElement('div');
            var img = document.createElement('img');
            
            if($scope.whosOut[j].Employees[i].Image)
            {
              img.src = $scope.whosOut[j].Employees[i].Image;
            }
            else
            {
              img.src = "assets/mysterious.png";
            }
            
            img.setAttribute("class", "yammer-photo-gravatar");
            
            
            var title = document.createElement('span');
            title.innerHTML  = $scope.whosOut[j].Employees[i].Name;
            
            $(container).prepend(img);
            $(container).prepend(title);
            
            dateRow.append(container);

        }
        
        
        
        
      }
    }
  
  };

  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/whosOut.html',
    controller: controller,
    scope: {
      tab : "=tab",
      keys: "=keys"
    }
  }
  
});
