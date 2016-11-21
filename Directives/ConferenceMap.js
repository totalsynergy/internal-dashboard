app.directive("conferenceMap", function(){
  

  var controller = function($scope, Service, $http, EventbriteService, MailchimpService){
  
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
      //$scope.getPagedData(1, event);
      $scope.loadMailChimpData(event);
      
    });
    
    $scope.$on('shortDataFetch', function(){
      
      var event = { "attendees" : [] };
      $scope.loadMailChimpData(event);
      //$scope.getPagedData(1, event);
      
    });
    
    //Count Attendees in each state - N.B NSW and ACT counted as one so fall through in switch
    function count(data){
      
      var totalAttendees = 0;
      totalAttendees = data.length;
      
      MailchimpService.updateTotalAttendees(totalAttendees);
    }


    $scope.loadMailChimpData = function(event)
    {
      MailchimpService.getAttendeesData().then(function success(data){
        count(data.members);
        
      }, function error(data){
        //
      })
    }
    
    $scope.getPagedData = function(page, event) {
      
      
      EventbriteService.getAttendeesData(page, $scope.eventBriteKey).then(function(success){

        for(i = 0; i < success.attendees.length; i++)
        {
          event.attendees.push(success.attendees[i]);
        }
        
        if(page < success.pagination.page_count)
        {
          $scope.getPagedData(page + 1, event);
        } 
        else
        {
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
      tab: "=",
      keys: "="
    }
  }
  
});
