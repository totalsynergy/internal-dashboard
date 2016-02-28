(function (){

  angular
    .module('myApp')
    .directive('synergy5Gravatars', Synergy5Gravatars);
    
  function Synergy5Gravatars(){
    
    var directive = {
        restrict : "E",
        templateUrl : "../Views/Synergy5Gravatars.html",
        controller : Controller,
        controllerAs : 'vm',
        scope : {
          tab : "=",
          keys: "="
        },
        bindToController: true
      };
    
    return directive;
  }
  
  Controller.$inject = ['$scope', 'Synergy5Service', 'md5'];
    
  function Controller($scope, Synergy5Service, md5){
    var vm = this;
    var emptySpots = [];
    vm.title = "Synergy 5 Gravatar Controller";
    vm.gravatars= [];
  
    $scope.$watch('keys', function(){
      $scope.totalSynergyKey =vm.keys[4];
      getStaff();
    });
    
    $scope.$on('longDataFetch', function(){
      getStaff();
    });

    //Get the list of total synergy staff so we can access their gravatars
    function getStaff(){
      Synergy5Service.getSynergyStaff($scope.totalSynergyKey).then(function(success){
        if(success){
             $scope.data = success.data;
             sortEmails2(success.data, success.data.length);
           }
      });
    }
    
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
        loadAvatar(hash, i, name, blank, counter);
        
      }
      //Update the gravatars that are used in other areas of the application.
    }
    
    //Load Initials as an alertnate to mystery man using Gregs initial web service
    //Append these to the appropriate divs
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
            
          var divName = "#gS" + index;
          $(divName).empty();
          if(name)
          {
            $(divName).prepend(img);
            $(divName).append('<p>' + name + '</p>');
          }


        };
        xhr.send();
    }

      //XMLHTTP request to get individual gravatars - If 404 is thrown load initials instead.
      function loadAvatar(hash, index, email, blank){
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
                loadInitials(email,index);
            }
            else
            {
              img.src = window.URL.createObjectURL(this.response);
               
              var divName = "#gS" + index;
            
             $(divName).empty();
              if(email)
              {
                $(divName).prepend(img);
                $(divName).append('<p>' + email + '</p>');
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
    
    /*
    
    function updateGravatars(){ 
      vm.gravatars = Service.images;
      
      var empties = 0;
      var nonempties = [];
      for(var i =0; i < vm.gravatars.length; i++)
      {
        if(!vm.gravatars[i].Name)
        {
          empties++;
        }
        else
        {
          nonempties.push(vm.gravatars[i]);
        }
      }
      
      var emptySpots = makeEmptySpots(empties);
      fillImages(nonempties, emptySpots);
      
    }
    
    function fillImages(images, emptySpots){
      
      var counter = 0;
      var imageCounter = 0;
      while(counter < 28)
      {
        if(!existsInArray(counter, emptySpots))
        {
          appendImage(counter, images[imageCounter]);
          imageCounter++
        }
        
        counter++;
      }
    }
    
    function appendImage(index, grav){
      
      var img = document.createElement('img');
      img.setAttribute("id", "realImageContainer");
               
      var divName = "#gS" + index;
      
      $(divName).empty();
      
      if(grav)
      {
                img.src = grav.Image;
        $(divName).prepend(img);
        $(divName).append('<p>' + grav.Name + '</p>');
      }

    }
    
    function existsInArray(number, array){
      for(var i = 0; i < array.length; i++)
      {
        if(number == array[i])
          return true;
      }
      return false;
    }
  
    
    function makeEmptySpots(amount){

      var empties = [10, 17];
      var moreNeeded = amount - empties.length;

      
      while(moreNeeded > 0)
      {
        var random = Math.floor(Math.random() * 28);
        
        if(!existsInArray(random, empties))
        {
          empties.push(random);
          moreNeeded--;
        }
      }
      
      return empties;
      
    }
    */
    
  }
  
})();


