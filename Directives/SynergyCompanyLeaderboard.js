app.directive("synergyCompanyLeaderboard", function(){
  

  var controller = function($scope, Service, $http, $timeout){
  
    $scope.timeout1 = null;
    
    $scope.Math = window.Math;
    $scope.title = "Total Synergy Leaderboard";
    //math for math function in angular bindings
  
    $scope.count = 0;
    $scope.leaderBoardRankings = [];
    $scope.missingTimeSheets = [];
      
      $scope.$watch('tab', function(){
        $scope.tab = Service.tab;
        if($scope.tab == 39){
          slideUp();
          $scope.count = 0;
        }
        else if($scope.count == 0){
          pageChanged();
          $scope.count++;
        }
      });
  
      $scope.$on('gravatarsUpdated', function(){
        getLeaderBoardStats();
      });
      
      
      $scope.$watch('keys', function(){
        $scope.synergy4Key = $scope.keys[0];
      });
      
      
      function getLeaderBoardStats(){
  
        $http({
           url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/timeSheetLeaderboard',
           method: 'POST',
           headers : {'internal-token' : $scope.synergy4Key}
           }).success(function(d, status, headers, config){
             
             if(d.data)
              sortData(d.data);
             
             getImages(Service.images);
             
           })
          .error(function(data, status, headers, config){
             $scope.data = "fail";
          });
      }
      
      function sortData(data){
        $scope.leaderBoardRankings = [];
        var topScore = data[0].Ranking;
        for(var i = 0; i < data.length; i++){
          var fullName = data[i].FirstName + " " + data[i].LastName;
          var ranking = Math.floor((data[i].Ranking/topScore)*100);
          var score = data[i].Count;
          $scope.leaderBoardRankings.push({"Name" : fullName, "Score" : score, "Ranking" : ranking, "Image" : null});
        }
      }
      
      //Remove any nonaplhanumeric characters
      $scope.removeWhiteSpace = function(string){
        if(string)
          return string.replace(/\W/g,'');
        else
          return ' ';
      }
      
          
      //ORGANISING IMAGES FOR LEADERBOARD
      function getImages(images){
        for(var j = 0 ; j < $scope.leaderBoardRankings.length; j++){
          storeImageSource(j ,images);
        }
        
        pinImages();
      }
      
      
      //Returns the image source for a person. N.B can not save images only their source
      function storeImageSource(index, images){
        for(var i = 0; i < images.length; i++){
          
          if($scope.leaderBoardRankings[index].Name == images[i].Name){
            //console.log("Company - Found the match for: " + images[i].Name);
            $scope.leaderBoardRankings[index].Image = images[i].Image;
            break;
          }
        }
  
      }
  
      //PIN THE IMAGES ONTO THE ACTUALL DIVS
      function pinImages(){
        //make sure ng-repeat has fully run and assigned div's there dynamic $index
          angular.element(document).ready(function () {
              pin();
          });
        
      }
      
      
      //Something wrong in the pins //if ng-repeat assigning strange div names
      function pin(){
  
        for(var x = 0; x < $scope.leaderBoardRankings.length; x++){
                  var className = "." + $scope.removeWhiteSpace($scope.leaderBoardRankings[x].Name);
                  $(className).empty();
                  var img = document.createElement('img');
                  img.src = $scope.leaderBoardRankings[x].Image;
                  img.setAttribute("class", "lbGravatar");
                  $(className).prepend(img);
              }
      }
  
      function capitaliseFirstLetter(string){
        return string.charAt(0).toUpperCase() + string.slice(1,7);
      }
      
      
      //SLIDING ANIMATIONS
      function slideUp(){
        var peopleToSlide = Math.ceil(($scope.leaderBoardRankings.length)) - 7;
        var speed = parseInt(Service.speed);
        $scope.timeout1 = $timeout(function(){
          //since each person is 10% we must slide up 10% for each person row below top ten
            $('.leaderboardTopTen').animate({bottom: 7*peopleToSlide + "%"}, speed - 4000);
        },2000);
        
      }
      
      function pageChanged(){
        $('.leaderboardTopTen').stop();
        $timeout(function(){
            $('.leaderboardTopTen').css('bottom', '0px');
        },1000);
        $timeout.cancel($scope.timeout1);
      }
  
  };
  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/SynergyCompanyLeaderboard.html',
    controller: controller,
    scope : {
      tab : "=tab",
      keys: "=keys"
    }
  }
  
});
