app.directive("synergy4HeatMap", function(){
  

  var controller = function($scope, Synergy4Service ){

      $scope.countries = [];
      $scope.count = 0;
  
      $scope.$watch('keys', function(){
        $scope.totalSynergyKey = $scope.keys[0];
      })
      
      $scope.$on('synergy4MapData', function(){
        
        var d = Synergy4Service.mapData;
        
        $scope.countries = [];
        
        for(var i = 0; i < d.data.length; i++){
           incrementCategory(d.data[i].Country);
         }

         
        loadMap();
      })

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
        $("#heatMapContainer").empty();
        var width = $(window).height()*1.5;
        new Heatmap(width, 'heatMapContainer');

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
            }
            if(boolTest)
              values[k] = 0;
          });

          Heatmap.updateMap(values);

      }
      
      
  };
  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/Synergy4HeatMap.html',
    controller: controller,
    scope: {
      tab : "=tab",
      keys: "=keys"
    }
  }
  
});
