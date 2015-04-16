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
    
    //Gets the Members Id in trello
    function trelloGet(){
      $http.get("https://api.trello.com/1/boards/Wsp49XKC/members?key=" + $scope.trelloKeys[0] + "&token=" + $scope.trelloKeys[1])
      .success(function(data){
           $scope.memberNames = data;
           getMemberCards(data);
           getVersion4Development();
         })
        .error(function(data){
           $scope.data = "fail";
        });

    }
    
    function getVersion4Development(){
      $http.get("https://api.trello.com/1/boards/numEgxqS/members?key=" + $scope.trelloKeys[0] + "&token=" + $scope.trelloKeys[1])
      .success(function(data){
            addSynergy4Members(data);
         })
        .error(function(data){
           $scope.data = "fail";
        });
    }
    
    function cardExists(name){
      for(var i = 0 ; i < $scope.memberInfo.length; i++){
        if(name == $scope.memberInfo[i][0]){
          return true;
        }
      }
      return false
    }
    
    function addSynergy4Members(data){
      for(var i = 0; i < data.length; i++){
        if(!cardExists(data[i].fullName)){
          getMemberInformation(data[i].id, data[i].fullName, "numEgxqS");
        }
      }
    }

    function getMemberCards(data){
      $scope.cardNames = [];
      $scope.memberInfo = [];
      $scope.doingCards = [];
      for(var i = 0; i < data.length; i++){
        getMemberInformation(data[i].id, data[i].fullName, "Wsp49XKC");
      }
    }
    
    //SYNERGY 5 BOARD = Wsp49XKC
    //SYNERGY 4 BOARD = numEgxqS
    function getMemberInformation(id, name, board){
      $http.get("https://api.trello.com/1/boards/" + board + "/members/" + id + "/cards?key=" + $scope.trelloKeys[0] + "&token=" + $scope.trelloKeys[1])
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

    //WILL ITERATE THROUGH CARDS IN DOING LIST (4FF4e26....) & RANDOMLY PICK ONE FOR EACH EMPLOYEE
    //SYNERGY 4 DOING BOARD = 4ff4dab0bf42db525c9fa152
    //SYNERGY 5 DOING BOARD ID = 4ff4e26b97a6411d1c392800
    function pickCardToShow(data, name){

      var maxNumber = data.length;
      var doingCards = [];
      for(var i = 0; i < data.length; i++){
        if(data[i].idList == "4ff4e26b97a6411d1c392800" || data[i].idList == "4ff4dab0bf42db525c9fa152")
          doingCards.push(data[i].name);
      }
     var randomCardNumber = 0;    //THIS WAS PREVIOUSLY AT MATH.FLOOR - KEEP HERE IF RANDOMISED FUNCTION IS LATER REQUIRED
     if(doingCards[randomCardNumber] != undefined){
      $scope.doingCards.push({"Name" : name, "CardName" : doingCards[randomCardNumber], "Image" : "Trello Name Does not Match Synergy Records"});
     }
     $scope.count = 0;
     $scope.unShuffledCards = $scope.doingCards;
     var shuffledCards = shuffle($scope.doingCards);
     $scope.doingCards = shuffledCards;
    }
});