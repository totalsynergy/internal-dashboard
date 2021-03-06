app.directive("synergy5HeatMap", function(){
  

  var controller = function($scope, Synergy5Service){

    $scope.countries = [];
    $scope.count = 0;


    $scope.$watch('keys', function(){
      $scope.totalSynergy5Key = $scope.keys[4];
      getMapData();
    })

    $scope.$on('longDataFetch', function(){
      getMapData();
    })

    function getMapData(){
      
      Synergy5Service.getCountryData($scope.totalSynergy5Key).then(function(success){
        
         $scope.data = success.data;
         $scope.countries = [];
         
         for(var i = 0; i < success.data.length; i++){
            //$scope.countryNames.push(data[i].Country);
            incrementCategory(success.data[i].Country);
          }
          
         loadMap();
         
      });
    }

    function count(data){
      $scope.countries = [];
      for(var i = 0; i < data.length; i++){
        incrementCategory('theBoys');
      }
    }

    function incrementCategory(countryName){
      if($scope.countries.length == 0)
        $scope.countries.push({"name" : countryName, "count" : 1});
      else{
        if(countryDoesNotExist(countryName))
          $scope.countries.push({"name" : countryName, "count" : 1});
      }
    }

    function countryDoesNotExist(countryName){
      for(var i = 0; i < $scope.countries.length; i++){
        if(countryName == $scope.countries[i].name){
          $scope.countries[i].count++;
          return false;
        }
      }
      return true;
    }

    function loadMap(){
        $("#heatMapContainer2").empty();
        var width = $(window).height()*1.5;
        new Heatmap(width, 'heatMapContainer2');

        var callback = function(data) {
              var text = "";

              for (var i = 0; i < data.length; i++) {
                  if (i > 0) {
                      text += ",";
                  }

                  text += data[i].getId();
              }

              $('#marked').text(text);
          };

          Heatmap.init(callback);

          var values = new Array();
          values[7] = 100;
          values [8] = 250;
          values [9] = 250;
          $.each(Heatmap.worldmap['names'], function(k, v) {
            //display the key and value pair
            var boolTest = true;
            for(var y = 0; y < $scope.countries.length; y++){
              if($scope.countries[y].name == 'Hong Kong SAR')
                $scope.countries[y].name = 'China';
              if(v == $scope.countries[y].name){
                values[k] = $scope.countries[y].count;
                boolTest = false;
                break;
              }
              else{}
            }
            if(boolTest)
              values[k] = 0;
          });
          Heatmap.updateMap(values);

      }
  };
  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/Synergy5HeatMap.html',
    controller: controller,
    scope : {
      tab : "=tab",
      keys : "=keys"
    }
  }
  
});
