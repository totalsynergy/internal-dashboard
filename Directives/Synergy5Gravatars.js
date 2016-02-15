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
    vm.title = "Synergy 5 Gravatar Controller";
    vm.gravatars= [];
    
    $scope.$on('gravatarsUpdated', updateGravatars);
    
    function updateGravatars(){
      vm.gravatars = Service.images;
      
      for(var i =0; i < vm.gravatars.length; i++)
      {
        appendImage(i, vm.gravatars[i]);
      }
      
    }
    
    function appendImage(index, grav){
      
      var img = document.createElement('img');
      img.setAttribute("id", "realImageContainer");
      
      img.src = grav.Image;
               
      var divName = "#gS" + index;
      
      $(divName).empty();
      
      if(grav.Name)
      {
        $(divName).prepend(img);
        $(divName).append('<p id="gravatarName">' + grav.Name + '</p>');
      }
      else
      {
        $(divName).css('display', 'none');
      }
    }
    
  }
  
})();


