app.directive("synergyLeaderboard", function(){
  

  var controller = function($scope, Service, Synergy5Service, $http, $timeout){
  
    $scope.timeout1 = null;
    $scope.title = "Development Leaderboard";
    
    $scope.needsSliding = false;
    
    $scope.Math = window.Math;
    //math for math function in angular bindings
  
    $scope.count = 0;
    $scope.leaderBoardRankings = [];
    $scope.missingTimeSheets = [];
      
      $scope.$watch('tab', function(){
        $scope.tab = Service.tab;
        if($scope.tab == 32){
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
        //Also update the title while your at it
        $scope.title = Service.leaderboardSlug + " Leaderboard"
      });
      
      
      $scope.$watch('keys', function(){
        $scope.synergy4Key = $scope.keys[0];
        $scope.synergy5Key = $scope.keys[4];
      });
      
      function needToSlide(){
        var topTenHeight = $(".leaderboardTopTen").height();
        var othersHeight = $(".companyLeaderboardHeader").height() + $(".leaderboardFirstPlace").height() + $(".leaderboardSecondPlace").height()*2;
        var pageHeight = $(document).height();
        return true;
      }
      
      function getLeaderBoardStats(){
  
        Synergy5Service.getSynergy5Leaderboard($scope.synergy5Key, Service.leaderboardSlug).then(function success(data){

          if(data.length)
          {
            sortData(data);
             getImages(Service.images);
          }

        }, function error(data){
          $scope.data = "fail";
        });
      }
      
      function sortData(data){
        $scope.leaderBoardRankings = [];
        var topScore = 100/data[0].penalties;

        for(var i = 0; i < data.length; i++){

          var fullName = data[i].name;
          var score = Math.floor( ( (100/data[i].penalties)/topScore) * 100 );
          var ranking = data[i].position;

          $scope.leaderBoardRankings.push({"Name" : fullName, "Score" : score, "Ranking" : score, "Image" : null, "Email" : data[i].email});
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
          
          //Make the emails match if there are differences - e.g. Mels email
          var imageEmail = images[i].Email.endsWith('.au') ? images[i].Email.slice(0,images[i].Email.length - 3) : images[i].Email;
          var leaderboardEmail = $scope.leaderBoardRankings[index].Email.endsWith('.au') 
            ? $scope.leaderBoardRankings[index].Email.slice(0,$scope.leaderBoardRankings[index].Email.length - 3) : $scope.leaderBoardRankings[index].Email;
          
          if(leaderboardEmail == imageEmail){
            //console.log("Found the dev for: " + imageEmail);
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
    templateUrl: '../Views/SynergyLeaderboard.html',
    controller: controller,
    scope : {
      tab : "=tab",
      keys: "=keys"
    }
  }
  
});
