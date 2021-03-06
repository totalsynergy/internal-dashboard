app.directive("synergyGravatar", function(){


  var controller = function($scope, Service, $http, gravatarService, md5, $timeout, Synergy4Service){


    $scope.gravatar = 'https://secure.gravatar.com/avatar/db454bee724da405a69c9c7249e71487?s=300&d=mm';

    //BE CAREFUL BELOW
    $scope.keysObtained = false;
    $scope.arrayOfEmpties = [];
    $scope.isTrue = "false";
    $scope.blankSpots = [];
    $scope.trelloImages = [];
    //IMPORTANT variable - keeps track of compelted xml requests, when this reaches 28 we can perform other operations
    $scope.completedXMLRequests = 0;


    
    //Only call this for the first keysUpdated, otherwise only fetch on 'fetchEventData' to avoid issues of multiple async
    $scope.$watch('keys', function(){
      $scope.totalSynergyKey = $scope.keys[0];

      if(!$scope.keysObtained)
        getStaff();
        
      $scope.keysObtained = true;
    });

    $scope.$on('longDataFetch', function(){
      getStaff();
    });

    //Get the list of total synergy staff so we can access their gravatars
    function getStaff(){
      Synergy4Service.getSynergyStaff($scope.totalSynergyKey).then(function(success){
        if(success.data){
             $scope.data = success.data;
             sortEmails2(success.data, success.data.length);
           }
      });
    }


    //TypeError: Cannot read property 'Email' of undefined
    //at sortEmails2 (totalSynergyGravatarController.js:85)
    function sortEmails2(data, length){
      var counter = 0;
      $scope.trelloImages = [];
      
      pickNumbersToBeBlanks();

      $scope.arrayOfEmpties = [];
      $scope.completedXMLRequests = 0;
      
      //Fill the '32' blocks on the screen with either blanks or gravatars
      for(i = 1; i <= 28; i++){
        var name = '';
        var email = '';
        var blank = false;
        
        //Load a blank rectangle instead - keeps proportions
        if(isEmpty(i)){
          blank = true;
        }
        else{
          
          if(data[counter] != undefined){
            var hash = md5.createHash(data[counter].Email || '');
            name = data[counter].Name;
            email = data[counter].Email;
          }

          counter++;
          
        }
        loadAvatar(hash, i, name, blank, counter, email);
        
      }
      //Update the gravatars that are used in other areas of the application.
    }
    
    //Load Initials as an alertnate to mystery man using Gregs initial web service
    //Append these to the appropriate divs
    function loadInitials(name, index, email){
      var initials = name.replace(/\W*(\w)\w*/g, '$1').toUpperCase();
        var url = "http://profileimages.azurewebsites.net/Image/300/" + initials;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
          var img = document.createElement('img');
          img.setAttribute("id", "realImageContainer");
          img.src = window.URL.createObjectURL(this.response);
            
          var divName = "#g" + index;
          $(divName).empty();
          $(divName).prepend(img);
          $(divName).append('<p id="gravatarName">' + name + '</p>');

          var srcClone = img.src;
          $scope.trelloImages.push({"Name": name, "Image" :srcClone, "Email" : email});
          $scope.completedXMLRequests++;
          
          //Check if all xml requests are done and send
          if($scope.completedXMLRequests == 28){
              Service.updateGravatars($scope.trelloImages);
          }
        };
        xhr.send();
    }

      //XMLHTTP request to get individual gravatars - If 404 is thrown load initials instead.
      function loadAvatar(hash, index, email, blank, counter, contactEmail){
        var count = 0;

        var url = "https://secure.gravatar.com/avatar/" +  hash + "?s=300&d=404";
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            
            var img = document.createElement('img');
            img.setAttribute("id", "realImageContainer");
            if(blank){
              img.src = "assets/transparent.png";
            }
            
            if(xhr.status == 404 && email != ''){
                count++;
                loadInitials(email,index, contactEmail);
            }
            else
            {
              img.src = window.URL.createObjectURL(this.response);
               
              var divName = "#g" + index;
            
             $(divName).empty();
              if(email)
                 $(divName).prepend(img);

              $(divName).append('<p id="gravatarName">' + email + '</p>');
    
              var srcClone = img.src;
              $scope.trelloImages.push({"Name": email, "Image" :srcClone, "Email" : contactEmail});
              $scope.completedXMLRequests++;
              
              //Check if all xml requests are done and send
              if($scope.completedXMLRequests == 28){
                  Service.updateGravatars($scope.trelloImages);
              }
            }
            
            
        };
        xhr.send();
      }


    function isEmpty(number){
      for(var i = 0; i < $scope.blankSpots.length; i++){
          if(number == $scope.blankSpots[i])
          return true;
      }
      return false;
    }

  function pickNumbersToBeBlanks(){
    $scope.blankSpots = [];
    $scope.blankSpots.push(12,10,11,19,18,17);
    var emptiesNeeded = 23 - $scope.data.length;

    for(var i = 1; i < emptiesNeeded; i+= 1){
      var randomNum = Math.floor((Math.random() * 28));
      if(randomDoesNotExist(randomNum)){
        $scope.blankSpots.push(randomNum);
      }
      else
        i--;
    }
  }

  function randomDoesNotExist(number){
    for(var i = 0; i < $scope.blankSpots.length; i++){
      if(number == $scope.blankSpots[i])
        return false;
    }
    return true;
  }



  };

  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/SynergyGravatar.html',
    controller: controller,
    scope: {
      tab : "=tab",
      keys : "=keys"
    }
  }
  
});
