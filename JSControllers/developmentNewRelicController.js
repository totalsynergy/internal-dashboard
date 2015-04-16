app.controller('KPI13', function($scope, Service, $timeout, $http){

    var appended = false;
    
    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;

    });

    $scope.$on('keysUpdated', function(){
      if(!appended){
        appended= true;
        appendWebView();
      }
    });
    
    function appendWebView(){
      $(".relicFrame").append("<webview src='https://rpm.newrelic.com/accounts/876290/applications/5032960?tw[end]=1427243859&tw[start]=1427222259' id='relicWebView' scrolling='no'></webview>");
      //prevent session timeouts by refreshing - cheating
      $timeout(function(){
        
      },900000)
    }

});
