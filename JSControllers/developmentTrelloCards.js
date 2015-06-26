app.controller('KPI11', function($scope, Service, ngAudio, $http){
    $scope.count = 0;
    $scope.tabCount = 0;
    $scope.doingCards = [];
    $scope.images = [];
    $scope.unShuffledCards = [];
    $scope.trelloKeys = [];

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      //weGotKey();
    });

    $scope.$on('trelloListUpdated', function(){
      
      $scope.trelloKeys = Service.trelloKeys.split("-");
      $scope.listId = Service.trelloListSelected;
      $scope.listName = Service.trelloListName;

      getCardsInList();

    })

    $scope.$on('gravatarsUpdated', function(){
      $scope.images = Service.images;
      testImages();
    })
    
    $scope.$on('trelloSelectedNameUpdate' , function(){
      $scope.trelloSelectedName = Service.trelloSelectedName;
    })

    $scope.$on('fetchEventData', function(){
      if($scope.count == 0){
        $scope.count++
        $scope.doingCards = [];
        getCardsInList();
      }
    })

    function testImages(){
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
      pinImages();
      $scope.unShuffledCards = $scope.doingCards;
    }

    function pinImages(){
        for(var x = 0; x < $scope.doingCards.length; x++){
        $('#trello' + x).empty();
        var img = document.createElement('img');
        img.src = $scope.doingCards[x].Image;
        img.setAttribute("id", "trelloGravatar");
        $('#trello' + x).prepend(img);
      }
    }

    function capitaliseFirstLetter(string){
      return string.charAt(0).toUpperCase() + string.slice(1,7);
    }

    function shuffle(o){
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o.slice(0,6);
    }
    
    function getCardsInList(){
      
      $http.get("https://api.trello.com/1/lists/" + $scope.listId + "/cards?members=true&cards=open&attachment_fields=false&card_fields=name,idMembers&key=" + $scope.trelloKeys[0] + "&token=" + $scope.trelloKeys[1])
      .success(function(data){
           
           $scope.doingCards = [];
           
           for(var i = 0; i < data.length; i++){

              if(data[i].members[0] && !nameAlreadyExists(data[i].members[0].fullName)){
                var card = {"Name" : data[i].members[0].fullName, "CardName" : data[i].name};
                $scope.doingCards.push(card);
              }
           }
           
                 
          if($scope.images && $scope.images.length !== 0){
            testImages();
          }
           
           
         })
        .error(function(data){
           $scope.data = "fail";
        });
    }
    
    function nameAlreadyExists(name){
      for(var i = 0; i < $scope.doingCards.length; i++){

        if(name === $scope.doingCards[i].Name)
          return true;
      }
      
      return false;
    }

});