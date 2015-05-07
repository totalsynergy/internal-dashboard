app.controller('KPI32', function($scope, Service, $http, $timeout){
  
  $scope.timeout1 = null;
  
  $scope.Math = window.Math;
  //math for math function in angular bindings

  $scope.count = 0;
      
    $scope.leaderBoardRankings = [
      ];
      
      $scope.missingTimeSheets = [];
    
    $scope.$on('tabUpdated', function(){
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

    $scope.$on('staffInfoUpdated', function(){
      $scope.staffInfo = Service.staffInfo;
    });
    
    $scope.$on('5minuteDataFetch', function(){
      weGotKey();
    });
    
    $scope.$on('keysUpdated', function(){
      $scope.synergy4Key = Service.totalSynergyKey;
    });
    
    $scope.$on('gravatarsUpdated', function(){
      weGotKey();
    });
    
    function weGotKey(){
      $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/timeSheetLeaderboard',
         method: 'POST',
         headers : {'internal-token' : $scope.synergy4Key}
         }).success(function(d, status, headers, config){
           sortData(d.data);
           getnonTimeSheets(Service.images);
           getImages(Service.images);
           pinImages();
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
    
    //For those who have not filled in Time Sheets - Potential Redundancy with new feed
    function getnonTimeSheets(images){
      $scope.missingTimeSheets = [];

      for(var i = 0; i < images.length; i++){
        for(var j = 0 ; j < $scope.leaderBoardRankings.length; j++){
          
          if(images[i].Name == $scope.leaderBoardRankings[j].Name){
            break;
          }
          if(j == $scope.leaderBoardRankings.length - 1 && images[i].Name != ''){
            var fullName = images[i].Name;
            $scope.missingTimeSheets.push({"Name" : fullName, "Score" : "Missing", "Ranking" : "Missing", "Image" : null});
          }

        }
      }
      for(y = 0; y < $scope.missingTimeSheets.length; y++){
          $scope.leaderBoardRankings.push($scope.missingTimeSheets[y]);
        }
    }
    
    function getImageSource(name, images){
      for(var i = 0; i < images.length; i++){
        if(name == images[i].Name){
          return images[i].Image;
        }
      }
    }
    
    //ORGANISING IMAGES FOR LEADERBOARD
    function getImages(images){
      for(var j = 0 ; j < $scope.leaderBoardRankings.length; j++){
        var imageSource = getImageSource($scope.leaderBoardRankings[j].Name,images);
        $scope.leaderBoardRankings[j].Image = imageSource;
      }
    }
    
    //PIN THE IMAGES ONTO THE ACTUALL DIVS
    function pinImages(){
      //make sure ng-repeat has fully run and assigned div's there dynamic $index
        angular.element(document).ready(function () {
            console.log("listener called");
            pin();
        });
      
    }
    
    function pin(){
      for(var x = 0; x < $scope.leaderBoardRankings.length; x++){
                $('.lbGrav' + x).empty();
                var img = document.createElement('img');
                img.src = $scope.leaderBoardRankings[x].Image;
                img.setAttribute("class", "lbGravatar");
                $('.lbGrav' + x).prepend(img);
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

});
