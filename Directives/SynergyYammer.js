app.directive("synergyYammer", function(){


  var controller = function($scope, Service, YammerService, gravatarService){
    
   $scope.users = [];
   $scope.message = [];
    
    $scope.$on('shortDataFetch', function(){
      getYammerData();
    });

    
    $scope.$on('gravatarsUpdated', function(){
      getYammerData();
    });
    
    $scope.$watch('keys', function(){
      $scope.yammerKey = $scope.keys[5];
      $scope.yammerClientId = $scope.keys[9];
      YammerService.setKeys($scope.yammerKey, $scope.yammerClientId);
    })
    
    //IF NEW ACCESS TOKEN NEEDED - FOLLOW STEPS FOR OAUTH LOCALHOST ACCESS CODE ONLINE 
    //currently 7FPAj1DeqTJylDNWlGzJg
    function getYammerData(){

      YammerService.getYammerData().then(function success(data){

        sortUsers(data);
        getGroups();
      }, function error(data){
        $scope.data = "fail";
      });
    }
    
    function sortUsers(data){
      $scope.users = [];
      
      for(var i = 0; i < data.length; i++)
      {
          var user = {FullName : data[i].full_name, Position: data[i].job_title, Id : data[i].id};
          $scope.users.push(user);
      }

    }
    
    function getGroups(){
      
      YammerService.getGroups().then(function success(data){
           $scope.groups = [];
            
           for(var i = 0; i < data.group_memberships.length; i++)
           {
             var group = {Name: data.group_memberships[i].name, Id: data.group_memberships[i].id};
             $scope.groups.push(group);
           }
           
           getMessages();
      }, function error(data){
          $scope.data = "fail";
      });

    }
    
    function getMessages(){
      YammerService.getMessages().then(function success(data){
           sortMessages(data.messages);
           getImages();
           pinImages();
         }, function error(data){
           $scope.data = "fail";
         });
    }
    
    //converts userId to userName
    function getName(id){
      for(var i = 0; i < $scope.users.length; i++)
      {
        if(id == $scope.users[i].Id)
        {
          return $scope.users[i];
        }
        
      }
      
      return 'No Match';
    }
    
    //converts groupId to groupName
    function getGroup(id){
      for(var i = 0; i < $scope.groups.length; i++)
      {
        if(id == $scope.groups[i].Id)
        {
          return $scope.groups[i].Name;
        }
        
      }

      return id;
    }
    
    function sortMessages(data){
      $scope.messages = [];
      
      for(var i = 0; i < data.length; i++)
      {
        var property = "group_id";
        if(data[i].replied_to_id === null && data[i].body.plain != ""){
         var user = getName(data[i].sender_id);
         var message = {User : user.FullName, Position : user.Position, Message : data[i].body.plain, Group : getGroup(data[i].group_id), Created: new Date(data[i].created_at)};
         $scope.messages.push(message);
        }
      }
    }
    
    
    //SORTING IMAGES BELOW
    
    function getImageSource(name){
      
      for(var i = 0; i < Service.images.length; i++){
        if(name == Service.images[i].Name){
          return Service.images[i].Image;
        }
      }
    }
    
    //ORGANISING IMAGES FOR LEADERBOARD
    function getImages(){
      for(var j = 0 ; j < $scope.messages.length; j++){
        var imageSource = getImageSource($scope.messages[j].User);
        $scope.messages[j].Image = imageSource;
      }
    }
    
    //PIN THE IMAGES ONTO THE ACTUALL DIVS
    function pinImages(){

        for(var x = 0; x < $scope.messages.length; x++){
            $('.yammerGrav' + x).empty();
            var img = document.createElement('img');
            img.src = $scope.messages[x].Image;
            img.setAttribute("class", "yammerGrav");
            $('.yammerGrav' + x).prepend(img);
        }
    }


  };

  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/SynergyYammer.html',
    controller: controller,
    scope : {
      tab : "=tab",
      keys : "=keys"
    }
  }
  
});
