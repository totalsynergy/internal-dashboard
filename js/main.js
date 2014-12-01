(function timer(){
  setInterval(function(){
    var time = 0;
    $rootScope.$broadCast('TimeChange');
    time += 1000;
  }.1000);
})();

var synergyApiKey = "";

var eventBriteKey = "";

window.onload = function(){

}

chrome.power.requestKeepAwake('display');


var data = {
  0,1,2,3,4
};

var chartData = [
        {
            values: data,
            color: "#0000ff"
        }
    ];

var chartData2 =   [
  {x: 1, y: 1},
  {x: 2, y:2}
  ];
