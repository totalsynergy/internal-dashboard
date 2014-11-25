app.controller('EventBriteController', function($http, Service){
  $http.get("https://www.eventbriteapi.com/v3/events/10584525601/?token=W2LZ6BZPYSUFE2BBEML2")
    .success(function(data){
      $scope.eventData = data;
      Service.updateEventData(data);
      Service.update(10);
    })
    .fail(function(data){
      Service.updateTab(12);
    })
  })