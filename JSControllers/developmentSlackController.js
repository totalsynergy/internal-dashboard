  app.controller('KPI12', function($scope, Service, $http, gravatarService){
    $scope.data = [];
    $scope.people = null;
    $scope.slackKey = '';
    $scope.imageNameAndMessage = [];
    $scope.images = [];


    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $scope.$on('keysUpdated', function(){
      $scope.slackKey = Service.slackKey;
      weGotKey();
    })

    $scope.$on('gravatarsUpdated', function(){
      $scope.images = Service.images;
      testImages();
    })



    function weGotKey(){
<<<<<<< HEAD
=======
      //https://slack.com/api/channels.list?token=xoxp-2778174876-3184954930-3668145319-e5c1ea&pretty=1
>>>>>>> origin/master
      $http.get("https://slack.com/api/channels.list?token=xoxp-2778174876-3184954930-3668145319-e5c1ea&pretty=1")
      .success(function(data){
        var channelList = data.channels;
        fetchRightChannels(channelList);
      })
      .error(function(){
      })
    }



    function fetchRightChannels(list){
      for(var i = 0; i <  list.length; i++){
<<<<<<< HEAD
=======
        //CHANGE THE FILTER HERE FOR WHICH CHANNELS TO FETCH
>>>>>>> origin/master
        if(list[i].name == 'random')
          fetchChannelHistory(list[i].id, list[i].name);
      }
    }

    function fetchChannelHistory(channelId, channelName){

      $scope.data = [];

      //SCANS NAMES IN GENERAL - SO TO MATCH USER ID WITH FULL NAME
      $http.get("https://slack.com/api/users.list?token=" + $scope.slackKey + "&channel=" + channelId + "&pretty=1")
      .success(function(data){
        $scope.people = data.members;
        //Service.updateEventData(data);
      })
      .error(function(){

      })

      //GETS THE ACTUAL MESSAGES IN THE GIVEN CHANNEL
      $http.get("https://slack.com/api/channels.history?token=" + $scope.slackKey + "&channel=" + channelId + "&pretty=1")
      .success(function(data){
        for(var i = 0; i < data.messages.length; i++){
          if(data.messages[i].type == 'message' && data.messages[i].text.charAt(0) != '<'){
            var newMessage = data.messages[i].text.substr(0,95);
            if(newMessage.length >= 95)
              newMessage += "...";
            var object = {"id" : data.messages[i].user, "message" : newMessage, "channelName" : channelName, "image" : null};
            $scope.data.push(object);
          }
        }
      })
      .error(function(){

      })
    }


    function testImages(){
      for(var i = 0; i < $scope.data.length; i++){
        for(var j = 0; j < $scope.images.length; j++){
          var slackName = $scope.returnName($scope.data[i].id);
          var imageName = $scope.images[j].Name;
          if(slackName == imageName){
            var image = $scope.images[j].Image;
            $scope.data[i].image = image;
            }
          }
      }
      pinImages();
    }

    function pinImages(){
        for(var x = 0; x < $scope.data.length; x++){
          $('#slackGravatarHolder' + x).empty();
          var img = document.createElement('img');
          img.src = $scope.data[x].image;
          img.setAttribute("class", "slackGravatarHolder");
          $('#slackGravatarHolder' + x).prepend(img);
      }
    }

    $scope.returnName = function(id){
      if($scope.people != null){
      for(i = 0; i < $scope.people.length; i++){
        if($scope.people[i].id == id){
          return $scope.people[i].real_name;
        }
      }
      return "didnt work";
      }
    }

  });