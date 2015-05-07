app.controller('KPI1', function($scope, Service, $http, gravatarService, md5, $timeout){


    $scope.gravatar = 'https://secure.gravatar.com/avatar/db454bee724da405a69c9c7249e71487?s=300&d=mm';
    $scope.errorList = [];

    //BE CAREFUL BELOW
    $scope.dataLength = 20;
    $scope.count = 0;
    $scope.displayArray = [];
    $scope.arrayOfEmpties = [];
    $scope.emailTest = [];
    $scope.isTrue = "false";
    $scope.blankSpots = [];
    $scope.trelloImages = [];

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });


    $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
      if($scope.count == 0)
      //initialiseArray();
      $scope.count = 0;
      weGotKey();
      $scope.count++;
    })

    $scope.$on('fetchEventData', function(){
      $scope.displayArray = [];
      $scope.count = 0;
      weGotKey();
      //pickNumbers();
      //pickDecisiveNumbers();
    })

    function weGotKey(){
      //debugger

      if($scope.count < 1){

       $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/staff',
         method: 'POST',
         headers : {'internal-token' : $scope.totalSynergyKey}
         }).success(function(d, status, headers, config){
           $scope.data = d.data;
           sortEmails2(d.data, d.data.length);
           $scope.count++;
           $scope.dataLength = d.data.length;
           Service.updateStaffInfo(d);
         })
        .error(function(data, status, headers, config){
           $scope.data = "fail";
        });
        $scope.count++;
      }
    }

    function emptyDivs(){
      for(var i = 1; i <= 28; i++){
        var divName = '#g' + i;
        $(divName).empty();
      }
    }

    //TypeError: Cannot read property 'Email' of undefined
    //at sortEmails2 (totalSynergyGravatarController.js:85)

    function sortEmails2(data, length){
      var counter = 0;
      $scope.trelloImages = [];
      emptyDivs();
      pickNumbersToBeBlanks();

      //$("#twitterDiv").empty();
      $scope.arrayOfEmpties = [];
      for(i = 1; i <= 28; i++){
        var name = '';
        var email = '';
        var blank = false;
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
        loadAvatar(hash, i, name, blank, counter);
        //$scope.emailTest.push(email);
      }
      $timeout(function(){
        Service.updateGravatars($scope.trelloImages);
      }, 5000);
    }
    
    function loadInitials(name, index){
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
          $(divName).prepend(img);
          $(divName).append('<p id="gravatarName">' + name + '</p>');

          var srcClone = img.src;
          $scope.trelloImages.push({"Name": name, "Image" :srcClone});
        };
        xhr.send();
    }

      function loadAvatar(hash, index, email, blank){
        var count = 0;
        var url = "https://secure.gravatar.com/avatar/" +  hash + "?s=300&d=404";
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            var img = document.createElement('img');
            img.setAttribute("id", "realImageContainer");
            if(blank)
              img.src = "assets/transparent.png";
            else{

              if(xhr.status == 404 && email != ''){
                count++;
                loadInitials(email,index);
              }
                
              else{
                img.src = window.URL.createObjectURL(this.response);
                 
                var divName = "#g" + index;
                $(divName).prepend(img);
                $(divName).append('<p id="gravatarName">' + email + '</p>');
      
                var srcClone = img.src;
                $scope.trelloImages.push({"Name": email, "Image" :srcClone});
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
    for(var i = 1; i < emptiesNeeded; i++){
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


  });

