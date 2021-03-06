app.directive("redditJoke", function(){


  var controller = function($scope, Service, ngAudio, $http){
  
      $scope.$watch('keys', function(){
        $scope.redditKey = $scope.keys[4];
        getJokes();
      });
      
      $scope.$on('shortDataFetch', function(){
        getJokes();
      })
  
      function getJokes(){
            $http({
               url: 'http://www.reddit.com/r/cleanjokes/new.json?sort=new',
               method: 'GET',
               headers: {'Content-Type': 'application/json', 'internal-token' : $scope.totalSynergy5Key}
               }).success(function(d, status, headers, config){
                 findShortestJoke(d.data.children);
                 $scope.jokes = d.data.children[2];
               })
              .error(function(data, status, headers, config){
                 console.log("Did not get data");
              });
      }
  
      function findShortestJoke(posts){
        for(var i = 0; i< posts.length; i++){
          var postUrl = posts[i].data.url;
          var commentsIndex = postUrl.indexOf("comments");
          var jokeNameWithUnderScores = postUrl.slice(commentsIndex + 16, postUrl.length - 1);
          var jokeName = jokeNameWithUnderScores.replace(/_/g, ' ');
          if(jokeName.length < 40 && posts[i].data.selftext.length < 100){
            $scope.jokeName = jokeName.toUpperCase();
            $scope.jokeContent = posts[i].data.selftext;
            break;
          }
        }
      }
  
      function formatJoke(jokeInformation){
        var postUrl = jokeInformation.url;
        var commentsIndex = postUrl.indexOf("comments");
        var jokeNameWithUnderScores = postUrl.slice(commentsIndex + 16, postUrl.length - 1);
        var jokeName = jokeNameWithUnderScores.replace(/_/g, ' ');
        $scope.jokeName = jokeName.toUpperCase();
        $scope.jokeContent = jokeInformation.selftext;
      }
  
  
  };

  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/Joke.html',
    controller: controller,
    scope: {
      tab : "=tab",
      keys: "=keys"
    }
  }
  
});
