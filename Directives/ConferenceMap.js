app.directive("conferenceMap", function(){
  

  var controller = function($scope, Service, $http){
  
    $scope.NSWnACT = 0;
    $scope.QLD = 0;
    $scope.VICnTAS = 0;
    $scope.NT = 0;
    $scope.WA = 0;
    $scope.SA = 0;
    $scope.international = 0;

    
    $scope.$watch('keys', function(){
      $scope.eventBriteKey = $scope.keys[1];
      $scope.totalSynergyKey = $scope.keys[0];
      
      var event = { "attendees" : [] };
      $scope.getPagedData(1, event);
      
    });
    
    $scope.$on('shortDataFetch', function(){
      
      var event = { "attendees" : [] };
      $scope.getPagedData(1, event);
      
    });
    
    //Count Attendees in each state - N.B NSW and ACT counted as one so fall through in switch
    function count(data){
      
      var totalAttendees = 0;
      $scope.NSWnACT = 0;
      $scope.QLD = 0;
      $scope.VICnTAS = 0;
      $scope.NT = 0;
      $scope.WA = 0;
      $scope.SA = 0;
      $scope.international = 0;
      
      for(i = 0; i < data.attendees.length; i++)
      {
        
        if(!data.attendees[i].cancelled)
        {
          
          if(data.attendees[i].profile.addresses.work.country === "AU")
          {
            
            switch(data.attendees[i].profile.addresses.work.region)
            {
              
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
          else
          {
            $scope.international++;
          }
          totalAttendees++;
        }
        
      }
      Service.updateTotalAttendees(totalAttendees);
    }



    $scope.getPagedData = function(page, event) {
      $http.get("https://www.eventbriteapi.com/v3/events/17562070626/attendees/?page=" + page  + "&token=" + $scope.eventBriteKey)
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
      });
    };
    

  };
  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/ConferenceMap.html',
    controller: controller,
    scope : {
      tab: "=tab",
      keys: "=keys"
    }
  }
  
});
