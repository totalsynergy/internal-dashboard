app.controller('TwentiethKPI', function($scope, Service, ngAudio, $http){

    $scope.countries = [];
    $scope.count = 0;

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      //weGotKey();
    });

    $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
      weGotKey();
       // count++;
      //}
    })

    function weGotKey(){
      //debugger
       $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/Clients',
         method: 'POST',
         headers : {'internal-token' : $scope.totalSynergyKey}
         }).success(function(d, status, headers, config){
           $scope.data = d.data[10].Country;
           $scope.countries = [];
           for(var i = 0; i < d.data.length; i++){
              //$scope.countryNames.push(data[i].Country);
              incrementCategory(d.data[i].Country);
            }
           if($scope.count == 0){
            loadMap();
            //$scope.count++;
          }
           //count(d.data[10].Country);

         })
        .error(function(data, status, headers, config){
           $scope.data = "fail";
        });
    }

    function count(data){
      $scope.countries = [];
      for(var i = 0; i < data.length; i++){
        //$scope.countryNames.push(data[i].Country);
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
      new Heatmap(1000, 'heatMapContainer');
                console.log('HeatMap Ready for action');
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

                /*for (var key in Heatmap.worldmap['names']) {
                  console.log('Heating up ' + key);
                    if (key == 'AU') {
                        values[key] = 0;
                    }
                    else {
                        values[key] = parseInt(Math.random() * 100);
                    }
                }
                for(var x = 0; x < 20; x++){
                  var pathObject = Heatmap.worldmap['names'][0];
                  //var string = pathObject[1];
                  console.log('Keycode is: ' + pathObject);
                  //$scope.keys.push(keyCode + "");
                } */
                $.each(Heatmap.worldmap['names'], function(k, v) {
                  //display the key and value pair
                  var boolTest = true;
                  console.log(k + ' is to ' + v);
                  console.log('Scope countries length of ' + $scope.countries.length);
                  for(var y = 0; y < $scope.countries.length; y++){

                    if(v == $scope.countries[y].name){
                      console.log('v matched ' + $scope.countries[y].name);
                      values[k] = $scope.countries[y].count;
                      boolTest = false;
                      break;
                    }
                    else
                      console.log(v + ' did not match anything.');
                  }
                  if(boolTest)
                    values[k] = 0;
                });



                Heatmap.updateMap(values);
      }
      $scope.count++;
    }
});