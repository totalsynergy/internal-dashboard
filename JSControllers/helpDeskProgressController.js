app.controller('EleventhKPI', function($scope, Service, $http, gravatarService){
    $scope.data = null;
    $scope.people = null;
    $scope.slackKey = '';
    $scope.shorterItems = [];
    $scope.imageNameAndMessage = [];
    $scope.progressData = 'empty';
    $scope.data1 = [
                {
                    "key" : "Series 1",
                    "values": [["firstMonth", 20], ["second", 17], ["thiard", 30], ["fgfdgf", 45], ["thdfgird", 12], ["tshird", 7], ["thffird", 54], ["thdfd", 30],["thifrd", 30],["thgrd", 14]
                    ,["thixrd", 32],["thcird", 29],["thvird", 18],["thibrd", 21],["tnhird", 14],["thffffsdird", 30],["tmhird", 30],["tlhird", 17],["thkird", 30],["thjird", 18],["thhird", 43]]
                }];
    $scope.data2 = [
                {
                    "key" : "Series 1",
                    "values": [["firstMonth", 10], ["second", 12], ["thaird", 54], ["fgfdgf", 12], ["thdfgird", 54], ["thqwird", 3], ["thffird", 15], ["thefd", 21],["thtird", 43],["thrird", 27]
                    ,["thirdd", 12],["thifrd", 39],["thirgd", 28],["thhird", 11],["thijrd", 3],["thffffsdird", 30],["thkird", 31],["thlird", 32],["thiird", 65],["tuhird", 6],["thyird", 43]]
                }];

    $scope.data3 = [
  	{
      	"key": "Series 1",
          "values": [ [ 1025409600000 , 0] , [ 1028088000000 , -6.3382185140371] , [ 1030766400000 , -5.9507873460847] , [ 1033358400000 , -11.569146943813] , [ 1036040400000 , -5.4767332317425] , [ 1038632400000 , 0.50794682203014] , [ 1041310800000 , -5.5310285460542] , [ 1043989200000 , -5.7838296963382] , [ 1046408400000 , -7.3249341615649] , [ 1049086800000 , -6.7078630712489] , [ 1051675200000 , 0.44227126150934] , [ 1054353600000 , 7.2481659343222] , [ 1056945600000 , 9.2512381306992] , [ 1059624000000 , 11.341210982529] , [ 1062302400000 , 14.734820409020] , [ 1064894400000 , 12.387148007542] , [ 1067576400000 , 18.436471461827] , [ 1070168400000 , 19.830742266977] , [ 1072846800000 , 22.643205829887] , [ 1075525200000 , 26.743156781239] , [ 1078030800000 , 29.597478802228]]
      },
      {
      	"key": "Series 2",
          "values": [ [ 1025409600000 , 0] , [ 1028088000000 , 0] , [ 1030766400000 , 0] , [ 1033358400000 , 0] , [ 1036040400000 , 0] , [ 1038632400000 , 0] , [ 1041310800000 , 0] , [ 1043989200000 , 0] , [ 1046408400000 , 0] , [ 1049086800000 , 0] , [ 1051675200000 , 0] , [ 1054353600000 , 0] , [ 1056945600000 , 0] , [ 1059624000000 , 0] , [ 1062302400000 , 0] , [ 1064894400000 , 0] , [ 1067576400000 , 0] , [ 1070168400000 , 0] , [ 1072846800000 , 0] , [ 1075525200000 , -0.049184266875945], [ 1078030800000 , -0.049184266875945]]
     }
    ]

    $scope.data4 = [
                {
                    "key" : "Series 1",
                    "values": [["firstMonth", 13], ["second", 12], ["thaird", 54], ["fgfdgf", 12], ["thdfgird", 54], ["thqwird", 3], ["thffird", 35], ["thefd", 21],["thtird", 13],["thrird", 27]
                    ,["thirdd", 22],["thifrd", 19],["thirgd", 28],["thhird", 11],["thijrd", 3],["thffffsdird", 38],["thkird", 31],["thlird", 32],["thiird", 25],["tuhird", 6],["thyird", 43]]
                }];

    $scope.$on('tabUpdated', function(){
      $scope.tab = Service.tab;
    });

    $scope.$on('keysUpdated', function(){
      $scope.slackKey = Service.slackKey;
      //weGotKey();
    })

    $scope.$on('callsDataUpdated', function(){
      $scope.progressData = Service.progressData;
      firstSort();
      sort();
    })

    function firstSort(){
      for(var j = 20; j < 25; j++){
      $scope.shorterItems.push($scope.progressData[j]);
      }
      for(var i = 0; i < $scope.progressData.length; i+= 3){
        var item = $scope.progressData[$scope.progressData.length - (i + 1)]
        //if(item.Status = "Support")
          $scope.shorterItems.push([ item.Status]);//item.ClientName, item.OpenDate, item.Queue, item.QueueId,
        //$scope.shorterItems.push($scope.progressData[$scope.progressData.length - i]);
      }
    }

    function sort(){
      for(var i = 0; i < $scope.progressData.length; i++){
        if($scope.progressData[i].Status != 'Development' && $scope.progressData[i].Status != 'Closed' && $scope.progressData[i].Status != 'Support' && $scope.progressData[i] != undefined){
          $scope.slightlySortedData.push($scope.progressData[i]);
        }
      }
    }

  });
