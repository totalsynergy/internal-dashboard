(function(){
  
  angular
    .module('myApp')
    .factory('TwitterService', Service);
    
  Service.$inject = ['$q', '$http'];
  function Service($q, $http){
    
    var service = {};
    service.twitterBearerToken = "";
    service.authenticateTwitter = authenticateTwitter;    
    service.getTweets = getTweets;
    
    function authenticateTwitter(twitterKey, twitterSecret){
      
      var key = twitterKey;
      var secretKey = twitterSecret;
      
      var encodedKey = encodeURIComponent(key);
      var encodedSecretKey = encodeURIComponent(secretKey);
      
      var concatenatedKey = encodedKey + ":" + encodedSecretKey;
      var base64String = btoa(concatenatedKey);
      
      return $q(function(resolve, reject){
              $http({
           url: 'https://api.twitter.com/oauth2/token',
           method: 'POST',
           headers: {
             'Authorization' : 'Basic '+ base64String,
             'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8'
           },
           data : 'grant_type=client_credentials'
        })
        .success(function(successData){
          resolve(successData);
        })
        .error(function(errorData){
          reject(errorData);
        });
      });

    };
    
    function getTweets(bearerToken){
      return $q(function(resolve, reject){
        $http({
         url: 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=totalsynergy&count=4&trim_user=true&exclude_replies=true',
         method: 'GET',
         headers: {
           'Authorization' : 'Bearer ' + bearerToken
           }
         })
         .success(function(d, status, headers, config){
           resolve(d);
         })
        .error(function(data, status, headers, config){
           reject(data);
        });
      })
    }

    return service;
  }
  
})();