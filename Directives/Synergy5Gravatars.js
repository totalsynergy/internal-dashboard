(function (){
  console.log("File opened");
  angular
    .module('myApp')
    .directive('synergy5Gravatars', Synergy5Gravatars);
    
  function Synergy5Gravatars(){
    
    var directive = {
      restrict: 'AEC',
      templateUrl: '../Views/Synergy5Gravatars.html',
      controller: Controller,
      controllerAs: 'vm',
      scope : {
        tab : "="
      },
      bindToController: true
    };
    
    return directive;
  }
  
  Controller.$inject = ['$scope', 'Service'];
    
  function Controller($scope, Service){
    var vm = this;
    var emptySpots = [];
    vm.title = "Synergy 5 Gravatar Controller";
    vm.gravatars= [];
    
    $scope.$on('gravatarsUpdated', updateGravatars);
    
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
      var empties = [12,10,11, 19, 17, 18];
      var moreNeeded = amount - empties.length - 1;
      
      console.log("Need to make: " + moreNeeded + " spots");
      
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
    
  }
  
})();


