app.controller('SeventhKPI', function($scope, Service, $http, gravatarService, md5, $timeout){


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


  $scope.error = {
      message: null,
      errorFunction: null,
  };

  function isEmpty(number){
    for(var i = 0; i < $scope.blankSpots.length; i++){
      if(number == $scope.blankSpots[i])
        return true;
    }
    return false;
  }

  function pickNumbersToBeBlanks(){
    var emptiesNeeded = 21 - $scope.data.length;
    for(var i = 0; i <= emptiesNeeded; i++){
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


    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
      if($scope.tab == 7){
        $scope.count = 0;}
      if($scope.tab != 7){
        weGotKey();
      }
    });


    $scope.$on('keysUpdated', function(){
      $scope.totalSynergyKey = Service.totalSynergyKey;
      if($scope.count == 0)
      initialiseArray();
      weGotKey();
      $scope.count++;
    })

    $scope.$on('fetchEventData', function(){
      $scope.displayArray = [];
      weGotKey();
      //pickNumbers();
      //pickDecisiveNumbers();
    })

    function initialiseArray(){
      for(i = 0; i < 32; i ++){
        $scope.displayArray[i] = null;
      }
    }



    function weGotKey(){
      //debugger
      if($scope.count <= 1){

       $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/staff',
         method: 'POST',
         headers : {'internal-token' : $scope.totalSynergyKey}
         }).success(function(d, status, headers, config){
           $scope.data = d.data;
           sortEmails2(d.data, d.data.length);
           $scope.count++;
           $scope.dataLength = d.data.length;
         })
        .error(function(data, status, headers, config){
           $scope.data = "fail";
        });

      }
    }

    function sortEmails2(data, length){
      console.log(data, length);
      $scope.blankSpots = [];
      pickNumbersToBeBlanks();
      console.log($(window).width());
      pushBlankSpotsForLogo();
      $(".gravImage").remove();
      var counter = 0;
      $scope.arrayOfEmpties = [];
      for(i = 0; i < 28; i++){
        if(isEmpty(i))
          $("#gravDiv").append('<img src="assets/transparent.png" class="gravImage"> ');
        else if(data[counter] != undefined){
          var lowerCaseEmail = data[counter].Email.toLowerCase();
          var hash = md5.createHash(lowerCaseEmail || '');
          hash += "..";
          $("#gravDiv").append('<webview src="https://secure.gravatar.com/avatar/' +  hash + '?s=300&d=mm" class="gravImage" allowtransparency="on" ng-show="true"></webview>');
          counter++;
        }
        //loadWebViews(hash, i);
        $scope.imageCounter++;
      }
    }

    function pushBlankSpotsForLogo(){
      /*if($(window).width() >= 1350 && $(window).width() <= 1575)
        $scope.blankSpots.push(8,9,13,14);
      if($(window).width() >= 1575 && $(window).width() <= 1800)*/
        $scope.blankSpots.push(9,10,11,16,17,18);/*
      if($(window).width() >= 1800 && $(window).width() <= 2025)
        $scope.blankSpots.push(10,11,12,13,18,19,20,21);
      if($(window).width() >= 2025 && $(window).width() <= 2250)
        $scope.blankSpots.push(12,13,14,21,22,23); */
    }
    /*
    function randomNumber(){
      var isPickable = false;
      var randomNum = 0;
      while(!isPickable){
        randomNum = Math.floor((Math.random() * 32));
        if(!numberIsUsed(randomNum)){
          $scope.arrayOfEmpties.push(randomNum);
          isPickable = true;
        }
      }
      return randomNum;
    }

    function numberIsUsed(number){
      if(number == 11 || number == 10 || number == 12 || number == 13 || number == 18 || number == 20 || number == 21 || number == 19)
        return true;
     if($scope.arrayOfEmpties.length == 0)
      return false;
     for(i = 0; i < $scope.arrayOfEmpties.length; i++){
       if(number == $scope.arrayOfEmpties[i])
        return true;
     }
      return false;
    }
    /*
    function originalLoadAvatar(hash, index, email){
      var url = "https://secure.gravatar.com/avatar/" +  hash + "?s=300&d=mm";
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);

      xhr.responseType = 'blob';

      xhr.onload = function(e) {
        if (this.status == 200) {
          var blob = this.response;
          var image  = window.URL.createObjectURL(blob);
          $scope.displayArray[randomNumber()] = {photo: image, emailAddress: email};
        }
      };

      xhr.onerror = function(e) {
        console.log("Error " + e.target.status + " occurred while receiving the document.");
      };

      xhr.send();
    }

      function loadAvatar(hash, index, email){
         var count = $scope.imageCounter
         var url = "https://secure.gravatar.com/avatar/" +  hash + "?s=300&d=mm";
         var loadImage = function(uri) {
         var xhr = new XMLHttpRequest();
         xhr.responseType = 'blob';
         xhr.onload = function() {
             var image  = window.URL.createObjectURL(xhr.response);
             $scope.displayArray[randomNumber()] = {photo: image, emailAddress: email};
           }
         xhr.open('GET', uri, true);
         xhr.send();
     }
     loadImage(url);
      }

    function defaultLoad(hash, index, email){
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://secure.gravatar.com/avatar/' +  hash + '?s=300&d=mm', true);
      xhr.responseType = 'blob';
      xhr.onload = function(e) {
        var img = new Image();
        img.src = window.URL.createObjectURL(this.response);
        $scope.displayArray[randomNumber()] = {photo: image, emailAddress: email};
      };

      xhr.send();
    }

    $scope.noImage = function(image){
      if($scope.standardImage == image)
        return true;
      return false;
    }

        var requestError = function (error) {

        var errorItem = angular.copy($scope.error);
        errorItem.message = error.message;
        $scope.errorList.push(errorItem);
        console.log("Error has occured:" ,error);
      };

    $scope.ralLoad = function(){
      var remoteImage,
      container = document.querySelector('#gravDiv'),
      toLoad = { 'images': [
         'https://secure.gravatar.com/avatar/db454bee724da405a69c9c7249e71487?s=300&d=mm',
         'https://secure.gravatar.com/avatar/db454bee724da405a69c9c7249e71487?s=300&d=mm' ] }; // list of image URLs

      toLoad.images.forEach(function(imageToLoad) {
        remoteImage = new RAL.RemoteImage(imageToLoad);
        container.appendChild(remoteImage.element);
        RAL.Queue.add(remoteImage);
      });
      RAL.Queue.setMaxConnections(4);
      RAL.Queue.start();
    }

  /*
  function loadAvas(hash, i ,email){

        var encode64 = function(inputStr) {
        var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var outputStr = "";
        var i = 0;
        while (i > 2) {
            var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
            var enc3, enc4;
            if (isNaN(byte2)) { enc3 = enc4 = 64 } else {
                enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
                if (isNaN(byte3))
                { enc4 = 64 }
                else {
                    enc4 = byte3 & 63
                }
            }
            outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4)
        }
        return outputStr;
    }

  /*
    send_with_ajax = new function(){
        if (window.XMLHttpRequest || window.ActiveXObject) {

            var URL = 'https://secure.gravatar.com/avatar/db454bee724da405a69c9c7249e71487?s=300&d=mm';

            if (window.ActiveXObject) {
                try {
                    xhr = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (exception) {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
            } else {
                xhr = new XMLHttpRequest();
            }
        } else {
            alert("Your browser does not support XMLHTTP Request...!");
        }

        xhr.open("GET", URL, true);
        xhr.overrideMimeType('text/plain; charset=x-user-defined');
        xhr.send(null);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if ((xhr.status == 200) || (xhr.status == 0)) {
                    var image = new Image();
                    //var image  = window.URL.createObjectURL(xhr.response);
                    console.log(image, xhr);
                    image.src = "data:image/jpeg;base64," + encode64(xhr.responseText);
                    $scope.displayArray[randomNumber()] = {photo: image, emailAddress: email};
                    //image.src = imageVal;
                } else {
                    alert("Something misconfiguration : " +
                      "\nError Code : " + xhr.status +
                      "\nError Message : " + xhr.responseText);
                }
            }
        };


     }
    }
    send_with_ajax();

*/
  });

