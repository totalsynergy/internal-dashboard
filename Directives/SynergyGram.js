app.directive("synergyGram", function(){


  var controller =  function($scope, Service, ngAudio, $http, $timeout){

    $scope.totalImageInformation = [];
    $scope.randomNumbers = [];
    $scope.divNames = ['firstInstagram','secondInstagram','thirdInstagram','fourthInstagram','fifthInstagram','sixthInstagram','seventhInstagram','eighthInstagram'];


    $scope.$watch('keys', function(){
      getInstagramImage();
    });
    
    $scope.$on('longDataFetch', function(){
      //console.log("You heard the boss");
      getInstagramImage();
    });


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

      $http.get("https://api.instagram.com/v1/tags/teamTotalSynergy/media/recent?access_token=20776276.0c90f58.1b3974ff4a9842da90dd430e665f40b8&count=20")
      .success(function(data){
        if(data.data[0].caption != undefined) //If not the Request Worked, but returned wrong response
        {
            $scope.data = data;
            $scope.totalImageInformation = [];
            $scope.randomNumbers = [];
        
            var limit = 8;
            
            if(data.data.length < limit)
            {
              limit = data.data.length;
            }
            
            //pickInstagramImages(data.data.length);
            for(var i =0; i < limit; i++)
            {
              //console.log("Timage: " +  data.data[i].caption.text);
                var object = {"caption" : data.data[i].caption.text, "likes" : data.data[i].likes.count, "image" : data.data[i].images.low_resolution.url, "comments" : data.data[i].comments.count, "tags" : data.data[i].tags};
                $scope.totalImageInformation.push(object);
            }
            for(var i = 0; i < limit; i++)
            {
              storeImage(i);
            }
        }

      })
      .error(function(data){
        //console.log("Instagram failed");
      });
    }
    
    function storeImage(index){
      //$(".instagramImage").remove();
      
      var imageSrc = $scope.totalImageInformation[index].image;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', imageSrc, true);
      xhr.responseType = 'blob';
      
      xhr.onload = function(e) {
        var img = document.createElement('img');
        img.src = window.URL.createObjectURL(this.response);
        img.setAttribute("class", "instagramImage");
        img.setAttribute("id", "instagramImage" + index);

        
        if(imageSrc && img.src && img.src != "")
        {
          $('#' + $scope.divNames[index]).empty();
          $('#' + $scope.divNames[index]).prepend(img);
        }

      };
      
      xhr.send();
    }


  };

  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/SynergyGram.html',
    controller: controller,
    scope : {
      keys : "=keys",
      tab : "=tab"
    }
  }
  
});
