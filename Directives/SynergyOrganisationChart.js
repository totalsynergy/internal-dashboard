app.directive('synergyOrganisationChart', function(){

  return{
    restrict: 'AEC',
    templateUrl: '../Views/SynergyOrganisationChart.html',
    scope : {
      tab : "=tab"
    }
  }
  
});