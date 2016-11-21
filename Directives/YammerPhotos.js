app.directive("yammerPhotos", function(){


  var controller = function($scope, Service, YammerService, gravatarService){
    
   $scope.users = [];
   $scope.messagesWithImages = [];
    
    $scope.$on('shortDataFetch', function(){
      getYammerData();
    });

    
    $scope.$on('gravatarsUpdated', function(){
      getYammerData();
    });
    
    $scope.$watch('keys', function(){
      $scope.yammerKey = $scope.keys[5];
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
           $scope.messagesWithImages = [];
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
      
      
      
      var i = 0;
      
      //Go through and get messages that have an image attachment
      while($scope.messagesWithImages.length < 3 && i < data.length)
      {
        //if message is not null and has an attachment that is an image
        var isAMessage = data[i].replied_to_id === null && data[i].body.plain != "";
        var hasAttachments = data[i].attachments && data[i].attachments.length != 0;
        
        
        if(hasAttachments)
        {
          var user = getName(data[i].sender_id);
          
          for(var attachmentIndex = 0; attachmentIndex < data[i].attachments.length; attachmentIndex++)
          {
             var isImage =  data[i].attachments[attachmentIndex] && data[i].attachments[attachmentIndex].type == "image";
             
             var likedBy = data[i].liked_by ? data[i].liked_by.count : 0;
             
             if(isImage)
             {
                var message = {
                  User : user.FullName, 
                  Position : user.Position,
                  Message : data[i].body.plain,
                  Group : getGroup(data[i].group_id),
                  Created: new Date(data[i].created_at),
                  ScaledUrl: data[i].attachments[attachmentIndex].image.url,
                  Likes: likedBy
                };
                $scope.messagesWithImages.push(message);
             }
          }
          

        }

        
        i++;
        
      }
      
      //Fetch older images
      if($scope.messagesWithImages.length < 3)
      {
        var oldestImageNumber = data[data.length - 1].id;
              
        YammerService.getMessages(oldestImageNumber).then(function success(data){
           sortMessages(data.messages);
         }, function error(data){
           $scope.data = "fail";
         });
      }
      
      loadAttachments();
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
      for(var j = 0 ; j < $scope.messagesWithImages.length; j++){
        var imageSource = getImageSource($scope.messagesWithImages[j].User);
        $scope.messagesWithImages[j].Image = imageSource;
      }
    }
    
    //PIN THE IMAGES ONTO THE ACTUALL DIVS
    function pinImages(){

        if($scope.messagesWithImages[0])
        {
          appendGravatar('#first-yammer-grav', $scope.messagesWithImages[0].Image);
        }
        
        if($scope.messagesWithImages[1])
        {
          appendGravatar('#second-yammer-grav', $scope.messagesWithImages[1].Image);
        }
        
        if($scope.messagesWithImages[2])
        {
          appendGravatar('#third-yammer-grav', $scope.messagesWithImages[2].Image);
        }
        
    }
    
    function appendGravatar(domId, imgSrc)
    {
      $(domId).empty();
      var img = document.createElement('img');
      img.src = imgSrc;
      img.setAttribute("class", "yammer-photo-gravatar");

      $(domId).prepend(img);
    }
    
    function loadAttachments()
    {

      
      if($scope.messagesWithImages[0])
      {
        fetchAttachment($scope.messagesWithImages[0].ScaledUrl, "first-image");
      }
      
      if($scope.messagesWithImages[1])
      {
        fetchAttachment($scope.messagesWithImages[1].ScaledUrl, "second-image");
      }
      
      if($scope.messagesWithImages[2])
      {
        fetchAttachment($scope.messagesWithImages[2].ScaledUrl, "third-image");
      }
      
    }
    
    function fetchAttachment(url, domId){
      
      var height = 300;
      var width = 250;
      var formattedUrl = url.replace("{{width}}", width).replace("{{height}}", height);
      
      var xhr = new XMLHttpRequest();
      xhr.open('GET', formattedUrl, true);
      xhr.responseType = 'blob';
      xhr.setRequestHeader("Authorization", "Bearer 7FPAj1DeqTJylDNWlGzJg");
      
      xhr.onload = function(e) {
        
        var img = document.createElement('img');
        img.src = window.URL.createObjectURL(this.response);
        img.setAttribute("class", "yammer-image");
        
        if(img.src && img.src != "")
        {
          $('#' + domId).empty();
          $('#' + domId).prepend(img);
        }

      };
      
      xhr.send();
    }


  };

  
  return{
    restrict: 'AEC',
    templateUrl: '../Views/YammerPhotos.html',
    controller: controller,
    scope : {
      tab : "=tab",
      keys : "=keys"
    }
  }
  
});
