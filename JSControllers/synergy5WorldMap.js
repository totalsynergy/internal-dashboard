app.controller('KPI27', function($scope, Service, ngAudio, $http){

    $scope.countries = [];
    $scope.count = 0;

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      //weGotKey();
    });

    $scope.$on('keysUpdated', function(){
      $scope.totalSynergy5Key = Service.totalSynergy5Key;
      weGotKey();
    })

    $scope.$on('callsDataUpdated', function(){
      weGotKey();
    })

    function weGotKey(){
      //debugger
       $http({
         url: 'https://beta.totalsynergy.com/internalkpi/totalsynergy/summary/country',
         method: 'POST',
         headers: {'Content-Type': 'application/json', 'internal-token' : $scope.totalSynergy5Key}
         }).success(function(d, status, headers, config){
           $scope.data = d.data;
           $scope.countries = [];
           for(var i = 0; i < d.data.length; i++){
              //$scope.countryNames.push(data[i].Country);
              incrementCategory(d.data[i].Country);
            }
           if($scope.count == 0){
            loadMap();
            //$scope.count++;
          }
         })
        .error(function(data, status, headers, config){
           $scope.data = "fail";
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
      if($scope.count == 0){
        var width = $(window).height()*1.5;
      new Heatmap(width, 'heatMapContainer2');
                //console.log('HeatMap Ready for action');
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
      $scope.count++;
    }
});