app.controller('KPI32', function($scope, Service, $http, $timeout){
  
  $scope.positions = [4,5,6,7,8,9,10];
  $scope.timeout1 = null;
  
  $scope.Math = window.Math;
  //math for math function in angular bindings

    $scope.employees = [
      {"Name" : "Adsam", "Number": 4},
      {"Name" : "Adadm", "Number": 8},
      {"Name" : "Adafm", "Number": 5},
      {"Name" : "Adgam", "Number": 9},
      {"Name" : "Ahdam", "Number": 6},
      {"Name" : "Adjam", "Number": 10},
      {"Name" : "Adjam", "Number": 7}
    ];
    
    $scope.count = 0;
    
    $scope.topTen = [
      {"name" : "empty", "score": 0, "position": 1, "image" : "empty"},
      {"name" : "empty", "score": 0, "position": 2, "image" : "empty"},
      {"name" : "empty", "score": 0, "position": 3, "image" : "empty"},
      {"name" : "empty", "score": 0, "position": 4, "image" : "empty"},
      {"name" : "empty", "score": 0, "position": 5, "image" : "empty"},
      {"name" : "empty", "score": 0, "position": 6, "image" : "empty"},
      {"name" : "empty", "score": 0, "position": 7, "image" : "empty"},
      {"name" : "empty", "score": 0, "position": 8, "image" : "empty"},
      {"name" : "empty", "score": 0, "position": 9, "image" : "empty"},
      {"name" : "empty", "score": 0, "position": 10, "image" : "empty"},
      {"name" : "empty", "score": 0, "position": 11, "image" : "empty"}
      ];
      
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
      console.log("Refetching on 5 minute mark");
    });
    
    $scope.$on('keysUpdated', function(){
      $scope.synergy4Key = Service.totalSynergyKey;
    })
    
    $scope.$on('gravatarsUpdated', function(){
      weGotKey();
    })
    
    function weGotKey(){
      $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/timeSheetLeaderboard',
         method: 'POST',
         headers : {'internal-token' : $scope.synergy4Key}
         }).success(function(d, status, headers, config){
           sortData(d.data);
           getnonTimeSheets(Service.images);
           testImages(Service.images);
         })
        .error(function(data, status, headers, config){
           $scope.data = "fail";
        });
    };
    
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
    
    $scope.getColumn = function(number){
      //Here we go +2 since the $index count in ng-repeat skips firstPlace and starts at 0
      return parseInt((number + 2)%3);
    };
    
    //get those who do not have time sheet data
    
    function getnonTimeSheets(images){
      console.log("Getting no timers");
      $scope.missingTimeSheets = [];

      for(var i = 0; i < images.length; i++){
        for(var j = 0 ; j < $scope.leaderBoardRankings.length; j++){
          
          if(images[i].Name == $scope.leaderBoardRankings[j].Name){
            break;
          }
          if(j == $scope.leaderBoardRankings.length - 1 && images[i].Name != ''){
            console.log(images[i].Name + " Does not exist");
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
    function testImages(images){
      for(var j = 0 ; j < $scope.leaderBoardRankings.length; j++){
        var imageSource = getImageSource($scope.leaderBoardRankings[j].Name,images);
        console.log("For " + $scope.leaderBoardRankings[j].Name + " src is: " + imageSource);
        $scope.leaderBoardRankings[j].Image = imageSource;
      }
      pinImages();
    }
    
    //PIN THE IMAGES ONTO THE ACTUALL DIVS
    function pinImages(){
      //need to place small timeout to allow data to bind to divs
      $timeout(function(){
              console.log("Pin images");
        for(var x = 0; x < $scope.leaderBoardRankings.length; x++){
            $('.lbGrav' + x).empty();
            if ($('.lbGrav' + x).length){
              console.log('Found :' + x);
            }
            var img = document.createElement('img');
            console.log("TRYING TO PIN TO: " + $scope.leaderBoardRankings[x].Image);
            img.src = $scope.leaderBoardRankings[x].Image;
            img.setAttribute("class", "lbGravatar");
            console.log("Image html is" + img);
            $('.lbGrav' + x).prepend(img);
            console.log($('.lbGrav' + x).html());
        }
      }, 100);

    }

    function capitaliseFirstLetter(string){
      return string.charAt(0).toUpperCase() + string.slice(1,7);
    }
    
    
    //NOW USING TRANSLATE FOR SLIDING ANIMATIONS - LOT FASTER THAT TOP MOVEMENT - LESS PAINT COST
    function slideUp(){
      var peopleToSlide = Math.ceil(($scope.leaderBoardRankings.length)) - 7;
      console.log("Sliding up: " + peopleToSlide + " with speed: " + Service.speed);
      var speed = parseInt(Service.speed);
      console.log("Speed: " + speed);
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
