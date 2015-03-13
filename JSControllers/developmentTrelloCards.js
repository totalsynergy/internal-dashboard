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

    $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
      $scope.trelloKeys = Service.trelloKeys.split("-");
      if($scope.count == 0)
        $scope.count++;
        trelloGet();
    })

    $scope.$on('gravatarsUpdated', function(){
      $scope.images = Service.images;
      testImages();
    })

    $scope.$on('fetchEventData', function(){
      if($scope.count == 0){
        $scope.count++
        $scope.doingCards = [];
        trelloGet();
        testImages();
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

    function trelloGet(){
      $http.get("https://api.trello.com/1/boards/Wsp49XKC/members?key=" + $scope.trelloKeys[0] + "&token=" + $scope.trelloKeys[1])
      .success(function(data){
           $scope.memberNames = data;
           getMemberCards(data);
         })
        .error(function(data){
           $scope.data = "fail";
        });
    }

    function getMemberCards(data){
      $scope.cardNames = [];
      $scope.memberInfo = [];
      $scope.doingCards = [];
      for(var i = 0; i < data.length; i++){
        getMemberInformation(data[i].id, data[i].fullName);
      }
    }

    function getMemberInformation(id, name){
      $http.get("https://api.trello.com/1/boards/Wsp49XKC/members/" + id + "/cards?key=d04c9c2bd2be123721cdbf17f78f5c20&token=ff2c359e14b2cf86320ff8db0b88150236e5781f284cdc075b52b0cf38afe6d1")
      .success(function(data){        //id List == 4ff4e26b97a6411d1c392800
          if(data[0] != undefined){
            $scope.memberInfo.push([name,data[0].name]);
            pickCardToShow(data, name);
           }
           $scope.count = 0;
         })
        .error(function(data){

        });
    }

    function pickCardToShow(data, name){

      var maxNumber = data.length;
      var doingCards = [];
      for(var i = 0; i < data.length; i++){
        if(data[i].idList == "4ff4e26b97a6411d1c392800")
          doingCards.push(data[i].name);
      }
     var randomCardNumber = Math.floor((Math.random() * doingCards.length));
     if(doingCards[randomCardNumber] != undefined){
      $scope.doingCards.push({"Name" : name, "CardName" : doingCards[randomCardNumber], "Image" : "Trello Name Does not Match Synergy Records"});
     }
     $scope.count = 0;
     $scope.unShuffledCards = $scope.doingCards;
     var shuffledCards = shuffle($scope.doingCards);
     $scope.doingCards = shuffledCards;
    }
});