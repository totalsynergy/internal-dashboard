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
  /*chrome.power.requestKeepAwake('display');
    chrome.storage.local.get('eventBriteKey', function (result) {
        eventBriteKey = result.eventBriteKey;
    });


    chrome.storage.local.get('synergyKey', function (result) {
        keywords = result.keywords;
        $("#keywords").val(keywords);
    }); */
}

chrome.power.requestKeepAwake('display');