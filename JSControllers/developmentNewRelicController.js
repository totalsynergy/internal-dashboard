app.controller('KPI13', function($scope, Service, $timeout, $http){

    $scope.count = 0;
    $scope.tweets = [];
    
    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;

    });

    $scope.$on('keysUpdated', function(){
      if($scope.count > 0)
        //$scope.getTweets();
      $scope.count++;
    });
    
    $scope.$on('Twitter Authenticated', function(){
      $scope.twitterBearerToken = Service.twitterBearerToken;
      console.log("Twitter Controller recieved token: " + $scope.twitterBearerToken);
      //$scope.getTweets();
    });

    //Use the authentication (performed in Service) and get totalSynergy tweets - count = last 3
    $scope.getTweets = function(){
      
      $http({
         url: 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=totalsynergy&count=3&trim_user=true&exclude_replies=true',
         method: 'GET',
         headers: {
           'Authorization' : 'Bearer ' + $scope.twitterBearerToken
           }
         })
         .success(function(d, status, headers, config){
           
           $scope.sortTweets(d);
           
         })
        .error(function(data, status, headers, config){
           console.log("Unable to get tweets, error was: " + data);
        });
        
    }
    
    //Goes through the JSON recieved and formats it into tweet objects
    $scope.sortTweets = function(tweets){
      
      $scope.tweets = [];
      
      for(var i =0; i < tweets.length; i++){
        
        var formattedDate = $scope.formatDate(tweets[i].created_at);
        
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
      
      console.log("Tweets are: " + JSON.stringify($scope.tweets));
    }
    
    //Changes the recieved date from +0000 to local time and returns a string to reflect when it was posted
    $scope.formatDate = function(date){

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

});
