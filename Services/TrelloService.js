(function(){
  angular
    .module('myApp')
    .factory('TrelloService', Service);
    
  Service.$inject = ['$http', '$q'];
  
  function Service($q, $http){
    var service = {};
    
    service.authorizeTrello = authorizeTrello;
    service.trelloChange = trelloChange;
    service.getTrelloBoards = getTrelloBoards;
    service.getTrelloLists = getTrelloLists;
    service.getTrelloCards = getTrelloCards;
    
    function authorizeTrello(){
      $(".synergyPages").append("<webview src='https://trello.com/1/authorize?key=d04c9c2bd2be123721cdbf17f78f5c20&name=Synergy+Dashboard&expiration=never&response_type=token&scope=read' id='trelloAuthorize' onload='trelloChange' scrolling='no'></webview>");
      var webview = document.getElementById("trelloAuthorize");
      webview.addEventListener("loadstop", $scope.trelloChange);
    };
    
    //Check whether the current webview contains the key we need
    function trelloChange(){
        
       var webview = document.getElementById("trelloAuthorize");
       
       webview.executeScript(
        {code: 'document.getElementsByTagName ("PRE")[0].firstChild.data'},
        function(results) {

          if(results && results != ''){
            
            var key = results[0].replace(/(\r\n|\n|\r)/gm," ");
            
            $("#trelloAuthorize").remove();
            
            chrome.storage.local.set({'trelloUserAuth' : key });
            
            $scope.trelloAuthWorks = true;
          }

      });
    };
    
    //Use the user auth to get the list of boards they are assigned to
    function getTrelloBoards(key, userAuth){
      
      if(key && key != ''){

        var url = 'https://api.trello.com/1/tokens/' + userAuth + '/member/idBoards?key=' + key + '&token=' + userAuth;
        var modifiedUrl = url.replace(/\s/g, '');
        
        return $q(function(resolve, reject){
          $http({
             url: modifiedUrl,
             method: 'GET'
          })
          .success(function(success){
            resolve(success);
          })
          .error(function(errorData){
            reject(errorData);
          });
        });
      }
    }
    
    //batch call with the board id's to get potential lists to show
    function getTrelloLists(boards, appKey, userKey){
      
      var batchString = '';
      
      for(var i =0; i < boards.length; i++){
        if(i !== 0)
          batchString += ",";
        batchString += "/1/boards/" + boards[i] + "?lists=open";
      }
      
      var batchUrl = 'https://api.trello.com/1/batch/?urls=' + batchString + '&key=' + appKey + '&token=' + userKey;
      var modUrl = batchUrl.replace(/\s/g, '');

      return $q(function(resolve, reject){
          $http({
             url: modUrl,
             method: 'GET'
          })
          .success(function(success){
            resolve(success);
          })
          .error(function(errorData){
            reject(errorData);
          });
        });
    }
    
    function getTrelloCards(listId, trelloKey, trelloUserAuth){
      var url = "https://api.trello.com/1/lists/" + listId + "/cards?members=true&cards=open&attachment_fields=false&card_fields=name,idMembers&key=" 
          + trelloKey + "&token=" + trelloUserAuth;
      
      var modifiedUrl = url.replace(/\s/g, '');
      
      return $q(function(resolve, reject){
        $http({
           url: modifiedUrl,
           method: 'GET'
        })
        .success(function(success){
          resolve(success);
        })
        .error(function(errorData){
          reject(errorData);
        });
      });
      
    }
    
    return service;
    
  }
})();