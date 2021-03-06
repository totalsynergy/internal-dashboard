app.directive("synergyTrello", function(){


  var controller = function($scope, Service, ngAudio, $http, $timeout, TrelloService){
    $scope.count = 0;
    $scope.tabCount = 0;
    $scope.doingCards = [];
    $scope.images = [];
    $scope.unShuffledCards = [];
    $scope.trelloKeys = [];

    $scope.$on('trelloListUpdated', function(){
      
      $scope.trelloKeys = Service.trelloKeys.split("-");
      $scope.trelloUserAuth = Service.trelloUserAuth;
      $scope.listId = Service.trelloListSelected;
      $scope.listName = Service.trelloListName;

      getTrelloCards();

    });

    $scope.$on('gravatarsUpdated', function(){
      $scope.images = Service.images;
      addImages();
    });

    $scope.$on('shortDataFetch', function(){
      getTrelloCards();
    });
    
    function getTrelloCards(){
      
      TrelloService.getTrelloCards($scope.listId, $scope.trelloKeys[0], $scope.trelloUserAuth).then(function(success){
        
        $scope.doingCards = [];
                 
         for(var i = 0; i < data.length; i++){

            if(data[i].members[0] && !nameAlreadyExists(data[i].members[0].fullName)){
              var card = {"Name" : data[i].members[0].fullName, "CardName" : data[i].name};
              $scope.doingCards.push(card);
            }
         }
               
        if($scope.images && $scope.images.length !== 0){
          addImages();
        }
        
      });
    }
    
    function addImages(){

      for(var i = 0; i < $scope.doingCards.length; i++){
        for(var j = 0; j < $scope.images.length; j++){

          var doingCardsName = capitaliseFirstLetter($scope.doingCards[i].Name);
          var imageName = capitaliseFirstLetter($scope.images[j].Name);

          if(doingCardsName == imageName){

            var image = $scope.images[j].Image;
            $scope.doingCards[i].Image = image;
            }
          }
      }
      $scope.unShuffledCards = $scope.doingCards;
      pinImages();
    }

    function pinImages(){
      //Ensure that DOM has loaded
      $timeout(function(){
          for(var x = 0; x < $scope.doingCards.length; x++){
          $('#trello' + x).empty();
          var img = document.createElement('img');
          img.src = $scope.doingCards[x].Image;

          img.setAttribute("id", "trelloGravatar");
          var element = "#trello" + x.toString();

          $(element).prepend(img);
        }
      }, 2000);

    }

    function capitaliseFirstLetter(string){
      return string.charAt(0).toUpperCase() + string.slice(1,7);
    }

    function shuffle(o){
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o.slice(0,6);
    }
    
    function nameAlreadyExists(name){
      for(var i = 0; i < $scope.doingCards.length; i++){

        if(name === $scope.doingCards[i].Name)
          return true;
      }
      
      return false;
    }


  };

  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/SynergyTrello.html',
    controller: controller,
    tab: "=tab"
  };
  
});
