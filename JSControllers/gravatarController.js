app.controller('SeventhKPI', function($scope, Service, $http, gravatarService, md5, $timeout){

  $scope.error = {
      message: null,
      errorFunction: null,
  };

  $(document).ready(function() {
  //$("#gravDiv").append('<webview src="https://secure.gravatar.com/avatar/db454bee724da405a69c9c7249e71487?s=300&d=mm" class="gravImage"></webview>');
  //$("#gravDiv").append('<webview src="https://secure.gravatar.com/avatar/db454bee724da405a69c9c7249e71487?s=300&d=mm" class="gravImage"></webview>');
  var dca = document.createElement('div');
  $(dca).addClass('webViewGravatar')
    .html('<webview src="https://secure.gravatar.com/avatar/db454bee724da405a69c9c7249e71487?s=4000&d=mm" style="border: 0px none; margin-left: -20; height: 25%; margin-top: -50%; width: 20%;"></webview>')
    .appendTo($(".embed-container")); //main div
  var dca = document.createElement('div');
  $(dca).addClass('webViewGravatar')
    .html('<webview id="foo" src="http://www.google.com/" style="width:64%; height:48%"></webview>')
    .attr('position', 'fixed')
    .appendTo($("#gravDiv"));
  });



  $scope.gravatar = 'https://secure.gravatar.com/avatar/db454bee724da405a69c9c7249e71487?s=300&d=mm';
  $scope.errorList = [];

    //BE CAREFUL BELOW
    $scope.dataLength = 20;
    $scope.count = 0;
    $scope.displayArray = [];
    $scope.arrayOfEmpties = [];
    $scope.emailTest = [];
    $scope.isTrue = "false";

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
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

       $http({
         url: 'https://beta.synergycloudapp.com/totalsynergy/InternalKpi/Home/staff',
         method: 'POST',
         headers : {'internal-token' : $scope.totalSynergyKey}
         }).success(function(d, status, headers, config){
           sortEmails2(d.data, d.data.length);
           $scope.data = d.data;
           $scope.count++;
           $scope.dataLength = d.data.length;
         })
        .error(function(data, status, headers, config){
           $scope.data = "fail";
        });
    }

    function sortEmails2(data, length){
      console.log(data, length);
      var counter = 0;
      $scope.arrayOfEmpties = [];
      for(i = 0; i < data.length; i++){

        var lowerCaseEmail = data[i].Email.toLowerCase();
        var hash = md5.createHash(lowerCaseEmail || '');
        //loadAvatar(hash, i, data[i].Name);
        //defaultLoad(hash, i , data[i].Name);
        //$scope.emailTest.push(data[i].Name);
        $scope.imageCounter++;
      }
    }

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
*/
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



/*
<script language="javascript" type="text/javascript">
    function send_with_ajax(){
        if (window.XMLHttpRequest || window.ActiveXObject) {
            var email = document.getElementById("email").value.toLowerCase().trim();
            var sizes = document.getElementsByName('size');
            var size;
            for(var i = 0; i < sizes.length; i++){
                if(sizes[i].checked){
                    size = sizes[i].value;
                }
            }
            var URL = 'http://www.gravatar.com/avatar/' + MD5(email) + '?s=' + size;

            if (window.ActiveXObject) {
                try {
                    xhr = new ActiveXObject("Msxml2.XMLHTTP");
                } catch(exception) {
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

        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4){
                if ((xhr.status == 200) || (xhr.status == 0)){
                    var image = document.getElementById("get_img");
                    image.src = "data:image/gif;base64," + encode64(xhr.responseText);
                }else{
                    alert("Something misconfiguration : " +
                      "\nError Code : " + xhr.status +
                      "\nError Message : " + xhr.responseText);
                }
            }
        };
    }
    var MD5=function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&amp;d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&amp;k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d&lt;=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};
    var encode64 = function encode64(inputStr){var b64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var outputStr="";var i=0;while(i>2;var enc2=((byte1&3)<<4)|(byte2>>4);var enc3,enc4;if(isNaN(byte2)){enc3=enc4=64}else{enc3=((byte2&15)<<2)|(byte3>>6);if(isNaN(byte3)){enc4=64}else{enc4=byte3&63}}outputStr+=b64.charAt(enc1)+b64.charAt(enc2)+b64.charAt(enc3)+b64.charAt(enc4)}return outputStr};
</script>
*/