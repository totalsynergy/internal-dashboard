app.directive("bomRadar", function(){

  console.log("Bom Directive loaded");
  var controller = function($scope, Service, $http, $timeout){
    
    console.log("Bom controller loaded");
    var appended = false;
    $scope.beginningPageState = null;

    
    $scope.$on('serviceHasKeys', function(){
      console.log("Hit me");
      findBeginningState();
      if(!appended){
        appendWebView();
        getFeed();
      }
    });
    
    function findBeginningState(){
      $scope.beginningPageState = Service.bomBeginningPageState;
    } 
    
    $scope.$on('longDataFetch', function(){
      console.log("Long data fetch fired");
      getFeed();
    });
    
    $scope.$watch('keys', function(){
      console.log("Bom Radar noticed the keys were updated, notify directives");
      if(!appended){
        appendWebView();
        getFeed();
      }
    })
    
    function getFeed(){
      
        $http.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20%3D%201105779%20and%20u%3D'c'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys")
          .success(function(data){
            sortWeather(data.query.results.channel.item.forecast);
          })
          .error(function(){
          })
    }
    
    function appendWebView(data){
      appended = true;
      $(".bomRadarWebView").empty();
      $(".bomRadarWebView").append("<webview src='http://www.bom.gov.au/products/IDR714.loop.shtml' id='bomRadarWebView'></webview>");
      $(".bomRadarWebView").append("<div id = 'northSyndneyPosition'></div>")
      //prevent session timeouts by refreshing - cheating
      $timeout(function(){
        appendWebView();
        getFeed();
      },900000);
    }
    
    function sortWeather(data){
      $scope.forecast = [];
      for(var i = 0; i < 5; i++){
        var weatherObject = { "Day" : data[i].day, "Temperature" : data[i].high, "Image" : mapWeatherNames(data[i].text)};
        $scope.forecast.push(weatherObject);
      }
      pinImages();
      
      //TURN ON PAGE ONLY IF IT IS RAINING
      
      var weatherNamesArray = ["Showers", "Raining", "MostylCloudy", "Hazardous"];

      if($scope.beginningPageState){ //if page was selected to be shown
        if(weatherNamesArray.indexOf(mapWeatherNames(data[0].text)) != -1){ //exists in array
          Service.changeIndividualPage('Bom Radar', true);
        }
        else{
          Service.changeIndividualPage('Bom Radar', false);          
        }
      }
    }
    
    function pinImages(){
      var divNames = ["weatherHolder", "miniWeatherHolder1", "miniWeatherHolder2", "miniWeatherHolder3", "miniWeatherHolder4"];
      for(var i = 0; i < $scope.forecast.length; i++){
        $("." + divNames[i]).empty();
        $("." + divNames[i]).prepend('<img src="assets/weather/' + $scope.forecast[i].Image + '.png" style="Width : 100%; margin-left: -30px;">');
      }
    }
    
    function removeSpaces(str){
      return str.replace(/\s+/g, '');
    }
    
    function mapWeatherNames(name){
      var returnString = "";
      if(name.indexOf("Sunny") != -1)
        returnString = "Sunny";
      else if(name.indexOf("Showers") != -1)
        returnString = "Showers";
      else if(name != "Partly Cloudy" && name != "Mostly Cloudy")
        returnString = "Hazardous";
      else
        returnString = name;
        
      return returnString.replace(/\s+/g, '');
    }


  };

  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/BomRadar.html',
    controller: controller,
    scope: {
      tab : "=tab",
      keys : "=keys"
    }
  }
  
});
