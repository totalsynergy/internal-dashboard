  app.controller('KPI12', function($scope, Service, $http, gravatarService){
    $scope.data = null;
    $scope.people = null;
    $scope.slackKey = '';
    $scope.imageNameAndMessage = [];


    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $scope.$on('keysUpdated', function(){
      $scope.slackKey = Service.slackKey;
      weGotKey();
    })

    $scope.returnName = function(id){
      if($scope.people != null){
      for(i = 0; i < $scope.people.length; i++){
        if($scope.people[i].id == id)
          return $scope.people[i].real_name;
      }
      return "didnt work";
      }
    }


    function weGotKey(){
      $http.get("https://slack.com/api/channels.history?token=" + $scope.slackKey + "&channel=C02NW54S2&pretty=1")
      .success(function(data){
        $scope.data = data.messages;
        //Service.updateEventData(data);
      })
      .error(function(){
        $scope.data = "fail";
      })

      $http.get("https://slack.com/api/users.list?token=" + $scope.slackKey + "&channel=C02NW54S2&pretty=1")
      .success(function(data){
        $scope.people = data.members;
        //Service.updateEventData(data);
      })
      .error(function(){
        $scope.people = "fail";
      })
    }

    function getGravatar(email){
        var lowerCaseEmail = email.toLowerCase();
        var hash = md5.createHash(lowerCaseEmail || '');
        var url = "https://secure.gravatar.com/avatar/" +  hash + "?s=300&d=mm";
        var loadImage = function(uri) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function() {
            var image  = window.URL.createObjectURL(xhr.response);
            return image;
          }
        //xhr.open('GET', uri, true);
        //xhr.send();
        }
        //if(isTrue($scope.blanks, index))
        loadImage(url);
    }

  });