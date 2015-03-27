app.controller('KPI2', function($scope, Service, ngAudio, $http){

    $scope.imageUrls = [];
    $scope.divNames = ['firstInstagram','secondInstagram','thirdInstagram','fourthInstagram','fifthInstagram','sixthInstagram','seventhInstagram','eighthInstagram']
    $scope.imageHolder = [];
    $scope.totalImageInformation = [];
    $scope.randomNumbers = [];

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
      getInstagramImage();
    })

    $scope.$on('fetchEventData', function(){
      getInstagramImage();
    })


  function randomDoesNotExist(number){
    for(var i = 0; i < $scope.randomNumbers.length; i++){
      if(number == $scope.randomNumbers[i])
        return false;
    }
    return true;
  }

    function pickInstagramImages(lengthOf){
      $scope.randomNumbers = [];
      for(var i = 0; i < 8; i++){
        var randomNum = Math.floor((Math.random() * 15));
        if(randomDoesNotExist(randomNum)){
          $scope.randomNumbers.push(randomNum);
        }
        else
          i--;
      }
    }


    function getInstagramImage(){
      $scope.imageUrls = [];
      $http.get("https://api.instagram.com/v1/users/598377249/media/recent/?client_id=89b41cbb03d149c4af0e7d39e2026f78")
      .success(function(data){
        $scope.data = data;
        var limit = 8;
        pickInstagramImages(data.data.length);
        for(var i =0; i < limit; i++){
          var number = $scope.randomNumbers[i];
            var object = {"caption" : data.data[number].caption.text, "likes" : data.data[number].likes.count, "image" : data.data[number].images.low_resolution.url, "comments" : data.data[number].comments.count, "tags" : data.data[number].tags};
            $scope.totalImageInformation.push(object);
        }
        storeImages();
      })
      .error(function(data){
        $scope.totalSynergyFeed = "failed";
      });

    }

    function storeImages(){
      $(".instagramImage").remove();
      var counter = 1;
      for(var i = 0; i < 8; i++){
        var imageSrc = $scope.totalImageInformation[i].image;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', imageSrc, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
          var img = document.createElement('img');
          img.src = window.URL.createObjectURL(this.response);
          img.setAttribute("class", "instagramImage");

          var div = $scope.divNames[1 + counter];
          $scope.imageHolder.push(img);
        };
        xhr.send();
      }
      pinToDivs();
    }

    function pinToDivs(){
      for(var i = 0; i < 8; i++){
        $('#' + $scope.divNames[i]).prepend($scope.imageHolder[i]);

      }
    }

});
