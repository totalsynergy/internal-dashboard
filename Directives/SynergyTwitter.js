app.directive("synergyTwitter", function(){
  

  var controller = function($scope, Service, $timeout, $http, TwitterService){

    $scope.count = 0;
    $scope.tweets = [];


    $scope.$watch('keys', function(){
      $scope.twitterSecret = $scope.keys[7];
      $scope.twitterKey = $scope.keys[6];
      authenticateTwitter();
    });
    
    $scope.$on('longDataFetch', authenticateTwitter);
    
    
    function authenticateTwitter(){
      $scope.twitterSecret = Service.twitterS;
      $scope.twitterKey = Service.twitterKey;
      
      TwitterService.authenticateTwitter($scope.twitterKey, $scope.twitterSecret).then(function(success){
        return success.access_token;
      })
      .then(function(twitterBearerToken){
        $scope.twitterBearerToken = twitterBearerToken;
        getTweets();
      });
    }

    //Use the authentication (performed in Service) and get totalSynergy tweets - count = last 3
    function getTweets(){
      TwitterService.getTweets($scope.twitterBearerToken).then(function(success){
        sortTweets(success);
      });
      
    }
    
    //Goes through the JSON recieved and formats it into tweet objects
    function sortTweets(tweets){
      
      $scope.tweets = [];
      
      for(var i =0; i < tweets.length; i++){
        
        var formattedDate = formatDate(tweets[i].created_at);
        
        //Change the color based on amount of retwees/favourites - used within inline styling
        var retweetsColor = (tweets[i].retweet_count == 0) ? "#f39200" : (tweets[i].retweet_count <= 2) ? "#78ad29" : "#009ee3";
        var favouritesColor = (tweets[i].favorite_count == 0) ? "#f39200" : (tweets[i].favorite_count <= 2) ? "#78ad29" : "#009ee3";
        
        var tweet = {
          "Text" : tweets[i].text,
          "Retweets" : tweets[i].retweet_count,
          "RetweetsColor" : retweetsColor,
          "Favourites" : tweets[i].favorite_count,
          "FavouritesColor" :favouritesColor,
          "Date" : formattedDate
        }
        
        $scope.tweets.push(tweet);
      }

    }
    
    //Changes the recieved date from +0000 to local time and returns a string to reflect when it was posted
    function formatDate(date){

      var date2 = new Date(date);
      var currentDate = new Date();
      
      //time difference 17 hours
      date2.setHours(date2.getHours() - 17);
      
      var timeDiff = Math.abs(date2.getTime() - currentDate.getTime());
      var hoursDifference = Math.ceil(timeDiff / (1000 * 3600));

      if(hoursDifference > 23){
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        return diffDays + " days ago"
      }
      else{
        return hoursDifference + " hours ago";
      }

    }
  };
  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/SynergyTwitter.html',
    controller: controller,
    scope: {
      tab : "=tab",
      keys: "=keys"
    }
  }
  
});
